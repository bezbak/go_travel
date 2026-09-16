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

При `DJANGO_DEBUG=0` Django перестаёт раздавать файлы сам — `media/` и
`staticfiles/` должен отдавать nginx:

```nginx
location /media/       { alias /srv/go_travel_back/media/; expires 30d; }
location /static/      { alias /srv/go_travel_back/staticfiles/; expires 30d; }
location /api/ /admin/ { proxy_pass http://127.0.0.1:8000; }
```

Фотографии сайт грузит **напрямую с хоста бэкенда**, поэтому `/media/` должен
быть доступен публично, а `API_BASE_URL` — быть публичным адресом.

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

## 3. Проверка после выкладки

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

**Фото не грузятся, в консоли 403/404 на `/media/...`** — nginx не отдаёт
`media/`, либо `API_BASE_URL` — внутренний адрес, недоступный из браузера.

**В админке сломана вёрстка** — не выполнен `collectstatic` или nginx не отдаёт
`/static/`.
