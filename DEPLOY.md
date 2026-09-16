# Выкладка на сервер

Два сервиса: Django-бэкенд (`../go_travel_back`) и этот сайт на Next.js.
Сайт тянет из бэкенда весь контент, поэтому **порядок запуска важен**.

## Главное правило

`npm run build` обращается к API за списком туров и направлений. Бэкенд должен
быть поднят и промигрирован **до** сборки сайта. Если он недоступен, сборка не
падает, но страницы туров и направлений не попадут в пререндер — они будут
рендериться по запросу, медленнее и без статического HTML.

Порядок всегда такой:

```
бэкенд: migrate → collectstatic → запустить
       ↓
сайт:  npm ci → npm run build → npm start
```

## 1. Бэкенд

```bash
cd go_travel_back
python -m venv .venv
.venv/bin/pip install -r requirements.txt

# переменные окружения — см. .env.example
export DJANGO_SECRET_KEY=...
export DJANGO_DEBUG=0
export DJANGO_ALLOWED_HOSTS=api.example.com
export DJANGO_CSRF_TRUSTED_ORIGINS=https://api.example.com
export DJANGO_CORS_ORIGINS=https://example.com

.venv/bin/python manage.py migrate        # создаёт БД и заливает весь контент
.venv/bin/python manage.py collectstatic --noinput
.venv/bin/python manage.py createsuperuser
```

`migrate` на чистой машине сам загружает туры, направления, фотографии и все
переводы из `catalog/seed/`. Доливать ничего не нужно.

Запускать через WSGI (gunicorn/uwsgi), не через `runserver`:

```bash
.venv/bin/gunicorn config.wsgi:application --bind 127.0.0.1:8000 --workers 3
```

При `DJANGO_DEBUG=0` Django перестаёт раздавать файлы сам. Если перед ним стоит
nginx — пусть отдаёт он; если нет (например, только gunicorn под pm2), включите
`DJANGO_SERVE_FILES=1`, иначе все фото отдадут 404, а админка останется без CSS.

nginx:

```nginx
location /media/       { alias /srv/go_travel_back/media/; expires 30d; }
location /static/      { alias /srv/go_travel_back/staticfiles/; expires 30d; }
location /api/ /admin/ { proxy_pass http://127.0.0.1:8000; }
```

Фотографии на страницах браузер берёт **не с бэкенда**: их забирает сервер
Next и отдаёт уже оптимизированными со своего порта. Бэкенд достаточно сделать
доступным для сервера Next — публичный адрес нужен только для `og:image`
(превью ссылок в соцсетях и мессенджерах), поэтому `API_BASE_URL` всё же лучше
указывать публичным.

## 2. Сайт

```bash
cd go_travel
npm ci
export API_BASE_URL=https://api.example.com
npm run build
npm start                     # слушает 3000, PORT= меняет порт
```

Хост бэкенда должен быть разрешён для `next/image` — это делается автоматически
из `API_BASE_URL` в `next.config.ts`, отдельной настройки не требуется.

nginx перед Node:

```nginx
location / { proxy_pass http://127.0.0.1:3000; }
```

## 3. pm2

В репозитории лежит `ecosystem.config.js` — оба сервиса, бэкенд на 8005 и сайт
на 3017. Перед первым запуском поправьте в нём `cwd`, `PUBLIC_API`,
`ALLOWED_HOSTS` и `SITE_ORIGIN`.

```bash
# 1. бэкенд: зависимости, миграции, статика
cd /srv/go_travel_back
.venv/bin/pip install -r requirements-prod.txt      # ставит gunicorn
.venv/bin/python manage.py migrate
.venv/bin/python manage.py collectstatic --noinput

# 2. поднять API — он нужен для сборки сайта
cd /srv/go_travel
set -a; . /srv/go_travel_back/.env; set +a          # DJANGO_SECRET_KEY и прочее
pm2 start ecosystem.config.js --only go-travel-api

# 3. собрать и поднять сайт
npm ci
API_BASE_URL=http://127.0.0.1:8005 npm run build
pm2 start ecosystem.config.js --only go-travel-web

# 4. автозапуск после перезагрузки
pm2 save
pm2 startup
```

Дальше:

```bash
pm2 status
pm2 logs go-travel-api --lines 50
pm2 restart go-travel-web          # после пересборки сайта
```

Секретов в `ecosystem.config.js` нет — он в git. `DJANGO_SECRET_KEY` берётся из
окружения той оболочки, где выполняется `pm2 start`, поэтому строка `set -a; .
.env; set +a` обязательна. Проверить, что ключ доехал:

```bash
pm2 env 0 | grep DJANGO_SECRET_KEY
```

На Windows-сервере gunicorn не работает — замените строку `args` в конфиге на
`-m waitress --listen=0.0.0.0:8005 config.wsgi:application`.

## 4. Проверка после выкладки

```bash
curl -s https://api.example.com/api/tours/?locale=ru | head -c 200
curl -o /dev/null -w "%{http_code}\n" https://example.com/ru/tours
curl -o /dev/null -w "%{http_code}\n" https://example.com/ru/tours/grand-tour-of-kyrgyzstan
```

## Обновление контента

| Что изменили | Что делать |
| --- | --- |
| Тексты, цены, фото, заезды в админке | Ничего. Изменения появятся в течение 60 секунд |
| Добавили **новый** тур или направление | Пересобрать сайт, чтобы страница попала в пререндер (без пересборки она работает, но рендерится по запросу) |
| Правки в `seed.json` | `manage.py seed_demo --sync` — дольёт то, чего нет в базе, не трогая отредактированное |
| Код сайта | `npm run build` + перезапуск |

`seed_demo --reset` удаляет весь контент и заливает заново — заявки и
пользователи не трогаются, но правки в админке пропадут.

## Частые проблемы

**Сборка падает с `ECONNREFUSED`** — бэкенд не поднят или `API_BASE_URL`
указывает не туда.

**Новый тур не открывается по прямой ссылке после деплоя** — сайт собирали до
того, как тур появился в базе. Пересоберите.

**Фото не грузятся** — их забирает сервер Next, а не браузер, поэтому смотреть
надо в логи сайта, а не в консоль браузера. Почти всегда причина одна: при
`DJANGO_DEBUG=0` никто не отдаёт `media/`. Включите `DJANGO_SERVE_FILES=1` или
настройте nginx. Проверить напрямую:
`curl -o /dev/null -w "%{http_code}
" http://127.0.0.1:8005/media/photos/kel-suu-lake.png`

**В соцсетях не видно превью ссылки** — `API_BASE_URL` указан внутренним
адресом: `og:image` ведёт на бэкенд напрямую и должен быть публичным.

**В админке сломана вёрстка** — не выполнен `collectstatic` или nginx не отдаёт
`/static/`.
