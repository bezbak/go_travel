"""
Content models for the Go Kyrgyzstan site.

Every visitor-facing string exists once per locale as a plain field
(`name_en`, `name_ru`, ...) rather than in a separate translation table: the
site only ships four languages and editors work on all of them at once, so
side-by-side fields in one form beat a tabbed inline.
"""

from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils.translation import gettext_lazy as _

LOCALES = ("en", "ru", "kg", "fr")


class TranslatedMixin(models.Model):
    """Adds `obj.translated("name", "ru")` with a fallback to English."""

    class Meta:
        abstract = True

    def translated(self, field, locale="en"):
        return getattr(self, f"{field}_{locale}", "") or getattr(self, f"{field}_en", "")


class Photo(TranslatedMixin):
    """
    Shared image library. Tours, destinations and the gallery all point here,
    so alt text is written once per photo instead of once per usage.
    """

    key = models.SlugField(
        _("ключ"),
        max_length=60,
        unique=True,
        help_text=_("Постоянный идентификатор из демо-данных, например 'songKol'."),
    )
    image = models.ImageField(
        _("файл"), upload_to="photos/", width_field="width", height_field="height"
    )
    width = models.PositiveIntegerField(_("ширина"), editable=False, default=0)
    height = models.PositiveIntegerField(_("высота"), editable=False, default=0)

    alt_en = models.CharField(_("alt-текст (англ.)"), max_length=300, blank=True)
    alt_ru = models.CharField(_("alt-текст (рус.)"), max_length=300, blank=True)
    alt_kg = models.CharField(_("alt-текст (кырг.)"), max_length=300, blank=True)
    alt_fr = models.CharField(_("alt-текст (фр.)"), max_length=300, blank=True)

    created_at = models.DateTimeField(_("добавлено"), auto_now_add=True)

    class Meta:
        verbose_name = _("фото")
        verbose_name_plural = _("Фотобиблиотека")
        ordering = ("key",)

    def __str__(self):
        return self.alt_en or self.key


class Destination(TranslatedMixin):
    slug = models.SlugField(_("URL-имя (slug)"), max_length=80, unique=True)
    order = models.PositiveIntegerField(_("порядок"), default=0)
    is_published = models.BooleanField(_("опубликовано"), default=True)

    altitude_m = models.PositiveIntegerField(_("высота, м"))
    drive_hours = models.PositiveIntegerField(_("дорога из Бишкека, часов"))
    best_months = models.CharField(
        _("лучшие месяцы"),
        max_length=20,
        help_text=_("Диапазон вида '06-09'; на сайте показывается поле «лучшее время»."),
    )

    hero_photo = models.ForeignKey(
        Photo,
        verbose_name=_("фото шапки"),
        on_delete=models.PROTECT,
        related_name="destination_heroes",
    )
    card_photo = models.ForeignKey(
        Photo,
        verbose_name=_("фото карточки"),
        on_delete=models.PROTECT,
        related_name="destination_cards",
    )

    name_en = models.CharField(_("название (англ.)"), max_length=200)
    name_ru = models.CharField(_("название (рус.)"), max_length=200)
    name_kg = models.CharField(_("название (кырг.)"), max_length=200)
    name_fr = models.CharField(_("название (фр.)"), max_length=200)

    summary_en = models.TextField(_("краткое описание (англ.)"))
    summary_ru = models.TextField(_("краткое описание (рус.)"))
    summary_kg = models.TextField(_("краткое описание (кырг.)"))
    summary_fr = models.TextField(_("краткое описание (фр.)"))

    best_time_en = models.CharField(_("лучшее время (англ.)"), max_length=200)
    best_time_ru = models.CharField(_("лучшее время (рус.)"), max_length=200)
    best_time_kg = models.CharField(_("лучшее время (кырг.)"), max_length=200)
    best_time_fr = models.CharField(_("лучшее время (фр.)"), max_length=200)

    body_en = models.TextField(_("текст (англ.)"), help_text=_("Один абзац на строку."))
    body_ru = models.TextField(_("текст (рус.)"), help_text=_("Один абзац на строку."))
    body_kg = models.TextField(_("текст (кырг.)"), help_text=_("Один абзац на строку."))
    body_fr = models.TextField(_("текст (фр.)"), help_text=_("Один абзац на строку."))

    highlights_en = models.TextField(
        _("изюминки (англ.)"), blank=True, help_text=_("Один пункт на строку.")
    )
    highlights_ru = models.TextField(
        _("изюминки (рус.)"), blank=True, help_text=_("Один пункт на строку.")
    )
    highlights_kg = models.TextField(
        _("изюминки (кырг.)"), blank=True, help_text=_("Один пункт на строку.")
    )
    highlights_fr = models.TextField(
        _("изюминки (фр.)"), blank=True, help_text=_("Один пункт на строку.")
    )

    class Meta:
        verbose_name = _("направление")
        verbose_name_plural = _("Направления")
        ordering = ("order", "slug")

    def __str__(self):
        return self.name_en or self.slug


class DestinationPhoto(models.Model):
    """Ordered gallery for a destination."""

    destination = models.ForeignKey(
        Destination,
        verbose_name=_("направление"),
        on_delete=models.CASCADE,
        related_name="gallery",
    )
    photo = models.ForeignKey(Photo, verbose_name=_("фото"), on_delete=models.CASCADE)
    order = models.PositiveIntegerField(_("порядок"), default=0)

    class Meta:
        verbose_name = _("фото галереи")
        verbose_name_plural = _("галерея")
        ordering = ("order", "id")
        constraints = [
            models.UniqueConstraint(
                fields=("destination", "photo"), name="unique_destination_photo"
            )
        ]

    def __str__(self):
        return f"{self.destination} - {self.photo}"


class Tour(TranslatedMixin):
    class Difficulty(models.TextChoices):
        EASY = "easy", _("Лёгкий")
        MODERATE = "moderate", _("Средний")
        CHALLENGING = "challenging", _("Сложный")

    class Style(models.TextChoices):
        GROUP = "group", _("Малая группа")
        PRIVATE = "private", _("Индивидуальный")
        EXPEDITION = "expedition", _("Экспедиция")

    slug = models.SlugField(_("URL-имя (slug)"), max_length=80, unique=True)
    order = models.PositiveIntegerField(_("порядок"), default=0)
    is_published = models.BooleanField(_("опубликовано"), default=True)
    featured = models.BooleanField(
        _("на главной"),
        default=False,
        help_text=_("Показывать в блоке «Наши любимые туры» на главной."),
    )

    destinations = models.ManyToManyField(
        Destination,
        verbose_name=_("Направления"),
        related_name="tours",
        help_text=_("Первое считается основным регионом."),
    )
    group_size_max = models.PositiveIntegerField(_("макс. размер группы"), default=12)
    difficulty = models.CharField(
        _("сложность"),
        max_length=20,
        choices=Difficulty.choices,
        default=Difficulty.MODERATE,
    )
    style = models.CharField(
        _("формат"), max_length=20, choices=Style.choices, default=Style.GROUP
    )
    seasons = models.JSONField(
        _("сезоны"),
        default=list,
        help_text=_("Список из: spring, summer, autumn, winter."),
    )

    price_eur = models.PositiveIntegerField(_("цена, EUR"))
    old_price_eur = models.PositiveIntegerField(
        _("старая цена, EUR"),
        null=True,
        blank=True,
        help_text=_("Заполните, чтобы показать зачёркнутую цену и бейдж «Спецпредложение»."),
    )
    rating = models.DecimalField(
        _("рейтинг"),
        max_digits=2,
        decimal_places=1,
        default=5,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
    )
    review_count = models.PositiveIntegerField(_("количество отзывов"), default=0)

    hero_photo = models.ForeignKey(
        Photo,
        verbose_name=_("фото шапки"),
        on_delete=models.PROTECT,
        related_name="tour_heroes",
    )
    card_photo = models.ForeignKey(
        Photo,
        verbose_name=_("фото карточки"),
        on_delete=models.PROTECT,
        related_name="tour_cards",
    )

    name_en = models.CharField(_("название (англ.)"), max_length=200)
    name_ru = models.CharField(_("название (рус.)"), max_length=200)
    name_kg = models.CharField(_("название (кырг.)"), max_length=200)
    name_fr = models.CharField(_("название (фр.)"), max_length=200)

    tagline_en = models.TextField(_("подзаголовок (англ.)"))
    tagline_ru = models.TextField(_("подзаголовок (рус.)"))
    tagline_kg = models.TextField(_("подзаголовок (кырг.)"))
    tagline_fr = models.TextField(_("подзаголовок (фр.)"))

    summary_en = models.TextField(_("краткое описание (англ.)"))
    summary_ru = models.TextField(_("краткое описание (рус.)"))
    summary_kg = models.TextField(_("краткое описание (кырг.)"))
    summary_fr = models.TextField(_("краткое описание (фр.)"))

    overview_en = models.TextField(_("описание (англ.)"), help_text=_("Один абзац на строку."))
    overview_ru = models.TextField(_("описание (рус.)"), help_text=_("Один абзац на строку."))
    overview_kg = models.TextField(_("описание (кырг.)"), help_text=_("Один абзац на строку."))
    overview_fr = models.TextField(_("описание (фр.)"), help_text=_("Один абзац на строку."))

    highlights_en = models.TextField(_("изюминки (англ.)"), help_text=_("Один пункт на строку."))
    highlights_ru = models.TextField(_("изюминки (рус.)"), help_text=_("Один пункт на строку."))
    highlights_kg = models.TextField(_("изюминки (кырг.)"), help_text=_("Один пункт на строку."))
    highlights_fr = models.TextField(_("изюминки (фр.)"), help_text=_("Один пункт на строку."))

    included_en = models.TextField(_("входит в стоимость (англ.)"), help_text=_("Один пункт на строку."))
    included_ru = models.TextField(_("входит в стоимость (рус.)"), help_text=_("Один пункт на строку."))
    included_kg = models.TextField(_("входит в стоимость (кырг.)"), help_text=_("Один пункт на строку."))
    included_fr = models.TextField(_("входит в стоимость (фр.)"), help_text=_("Один пункт на строку."))

    excluded_en = models.TextField(_("не входит (англ.)"), help_text=_("Один пункт на строку."))
    excluded_ru = models.TextField(_("не входит (рус.)"), help_text=_("Один пункт на строку."))
    excluded_kg = models.TextField(_("не входит (кырг.)"), help_text=_("Один пункт на строку."))
    excluded_fr = models.TextField(_("не входит (фр.)"), help_text=_("Один пункт на строку."))

    class Meta:
        verbose_name = _("тур")
        verbose_name_plural = _("туры")
        ordering = ("order", "slug")

    def __str__(self):
        return self.name_en or self.slug

    @property
    def duration_days(self):
        """The itinerary defines the length, exactly as on the site."""
        return self.days.count()


class TourDay(TranslatedMixin):
    """One itinerary day. Its photo is what the site shows in the day card."""

    tour = models.ForeignKey(
        Tour, verbose_name=_("тур"), on_delete=models.CASCADE, related_name="days"
    )
    number = models.PositiveIntegerField(_("день"))
    photo = models.ForeignKey(
        Photo, verbose_name=_("фото"), on_delete=models.PROTECT, related_name="tour_days"
    )

    title_en = models.CharField(_("заголовок (англ.)"), max_length=200)
    title_ru = models.CharField(_("заголовок (рус.)"), max_length=200)
    title_kg = models.CharField(_("заголовок (кырг.)"), max_length=200)
    title_fr = models.CharField(_("заголовок (фр.)"), max_length=200)

    description_en = models.TextField(_("текст (англ.)"))
    description_ru = models.TextField(_("текст (рус.)"))
    description_kg = models.TextField(_("текст (кырг.)"))
    description_fr = models.TextField(_("текст (фр.)"))

    class Meta:
        verbose_name = _("день маршрута")
        verbose_name_plural = _("Маршрут по дням")
        ordering = ("number",)
        constraints = [
            models.UniqueConstraint(fields=("tour", "number"), name="unique_tour_day_number")
        ]

    def __str__(self):
        return f"{self.tour} - {self.number}"


class TourNote(TranslatedMixin):
    """A 'good to know' entry — the accordion under the tour itinerary."""

    tour = models.ForeignKey(
        Tour, verbose_name=_("тур"), on_delete=models.CASCADE, related_name="notes"
    )
    order = models.PositiveIntegerField(_("порядок"), default=0)

    title_en = models.CharField(_("заголовок (англ.)"), max_length=200)
    title_ru = models.CharField(_("заголовок (рус.)"), max_length=200)
    title_kg = models.CharField(_("заголовок (кырг.)"), max_length=200)
    title_fr = models.CharField(_("заголовок (фр.)"), max_length=200)

    description_en = models.TextField(_("текст (англ.)"))
    description_ru = models.TextField(_("текст (рус.)"))
    description_kg = models.TextField(_("текст (кырг.)"))
    description_fr = models.TextField(_("текст (фр.)"))

    class Meta:
        verbose_name = _("Полезно знать")
        verbose_name_plural = _("Полезно знать")
        ordering = ("order", "id")

    def __str__(self):
        return self.title_en


class TourPhoto(models.Model):
    """Route photos, shown on the site (and in this admin) as a gallery."""

    tour = models.ForeignKey(
        Tour, verbose_name=_("тур"), on_delete=models.CASCADE, related_name="gallery"
    )
    photo = models.ForeignKey(Photo, verbose_name=_("фото"), on_delete=models.CASCADE)
    order = models.PositiveIntegerField(_("порядок"), default=0)

    class Meta:
        verbose_name = _("фото маршрута")
        verbose_name_plural = _("Фото маршрута")
        ordering = ("order", "id")
        constraints = [models.UniqueConstraint(fields=("tour", "photo"), name="unique_tour_photo")]

    def __str__(self):
        return f"{self.tour} - {self.photo}"


class Departure(models.Model):
    tour = models.ForeignKey(
        Tour, verbose_name=_("тур"), on_delete=models.CASCADE, related_name="departures"
    )
    date = models.DateField(_("дата"))
    seats_left = models.PositiveIntegerField(_("осталось мест"), default=0)
    price_eur = models.PositiveIntegerField(_("цена, EUR"))

    class Meta:
        verbose_name = _("заезд")
        verbose_name_plural = _("Заезды")
        ordering = ("date",)
        constraints = [
            models.UniqueConstraint(fields=("tour", "date"), name="unique_tour_departure")
        ]

    def __str__(self):
        return f"{self.tour} - {self.date}"


class TeamMember(TranslatedMixin):
    key = models.SlugField(_("ключ"), max_length=60, unique=True)
    order = models.PositiveIntegerField(_("порядок"), default=0)
    is_published = models.BooleanField(_("опубликовано"), default=True)
    name = models.CharField(_("имя"), max_length=120, help_text=_("Показывается без перевода."))
    photo = models.ForeignKey(
        Photo, verbose_name=_("фото"), on_delete=models.PROTECT, related_name="team_members"
    )

    role_en = models.CharField(_("должность (англ.)"), max_length=200)
    role_ru = models.CharField(_("должность (рус.)"), max_length=200)
    role_kg = models.CharField(_("должность (кырг.)"), max_length=200)
    role_fr = models.CharField(_("должность (фр.)"), max_length=200)

    bio_en = models.TextField(_("о сотруднике (англ.)"))
    bio_ru = models.TextField(_("о сотруднике (рус.)"))
    bio_kg = models.TextField(_("о сотруднике (кырг.)"))
    bio_fr = models.TextField(_("о сотруднике (фр.)"))

    class Meta:
        verbose_name = _("сотрудник")
        verbose_name_plural = _("Команда")
        ordering = ("order", "name")

    def __str__(self):
        return self.name


class Testimonial(TranslatedMixin):
    key = models.SlugField(_("ключ"), max_length=60, unique=True)
    order = models.PositiveIntegerField(_("порядок"), default=0)
    is_published = models.BooleanField(_("опубликовано"), default=True)
    name = models.CharField(_("имя гостя"), max_length=120)
    tour = models.ForeignKey(
        Tour,
        verbose_name=_("тур"),
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="testimonials",
    )
    rating = models.PositiveSmallIntegerField(
        _("рейтинг"), default=5, validators=[MinValueValidator(1), MaxValueValidator(5)]
    )

    country_en = models.CharField(_("страна (англ.)"), max_length=120)
    country_ru = models.CharField(_("страна (рус.)"), max_length=120)
    country_kg = models.CharField(_("страна (кырг.)"), max_length=120)
    country_fr = models.CharField(_("страна (фр.)"), max_length=120)

    quote_en = models.TextField(_("отзыв (англ.)"))
    quote_ru = models.TextField(_("отзыв (рус.)"))
    quote_kg = models.TextField(_("отзыв (кырг.)"))
    quote_fr = models.TextField(_("отзыв (фр.)"))

    class Meta:
        verbose_name = _("отзыв")
        verbose_name_plural = _("Отзывы")
        ordering = ("order", "id")

    def __str__(self):
        return f"{self.name} ({self.rating}/5)"


class FaqItem(TranslatedMixin):
    key = models.SlugField(_("ключ"), max_length=60, unique=True)
    order = models.PositiveIntegerField(_("порядок"), default=0)
    is_published = models.BooleanField(_("опубликовано"), default=True)

    question_en = models.CharField(_("вопрос (англ.)"), max_length=300)
    question_ru = models.CharField(_("вопрос (рус.)"), max_length=300)
    question_kg = models.CharField(_("вопрос (кырг.)"), max_length=300)
    question_fr = models.CharField(_("вопрос (фр.)"), max_length=300)

    answer_en = models.TextField(_("ответ (англ.)"))
    answer_ru = models.TextField(_("ответ (рус.)"))
    answer_kg = models.TextField(_("ответ (кырг.)"))
    answer_fr = models.TextField(_("ответ (фр.)"))

    class Meta:
        verbose_name = _("вопрос")
        verbose_name_plural = _("Вопросы и ответы")
        ordering = ("order", "id")

    def __str__(self):
        return self.question_en


class GalleryPhoto(models.Model):
    """The home-page photo strip."""

    photo = models.OneToOneField(
        Photo, verbose_name=_("фото"), on_delete=models.CASCADE, related_name="home_gallery"
    )
    order = models.PositiveIntegerField(_("порядок"), default=0)
    is_published = models.BooleanField(_("опубликовано"), default=True)

    class Meta:
        verbose_name = _("фото на главной")
        verbose_name_plural = _("Галерея на главной")
        ordering = ("order", "id")

    def __str__(self):
        return str(self.photo)


class SiteSettings(models.Model):
    """Singleton: contact details and social links shown in header and footer."""

    phone = models.CharField(_("телефон"), max_length=40)
    phone_href = models.CharField(_("ссылка для телефона"), max_length=60)
    whatsapp = models.CharField(_("WhatsApp"), max_length=40)
    whatsapp_href = models.URLField(_("ссылка WhatsApp"), max_length=300)
    instagram_href = models.URLField(_("ссылка Instagram"), max_length=300, blank=True)
    email = models.EmailField(_("e-mail"))
    address_lines = models.TextField(_("адрес"), help_text=_("По одной строке адреса."))
    map_query = models.CharField(_("запрос для карты"), max_length=300)

    hero_photo = models.ForeignKey(
        "Photo",
        verbose_name=_("фото на первом экране"),
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="home_heroes",
    )
    feature_photo = models.ForeignKey(
        "Photo",
        verbose_name=_("фото в блоке «Почему мы»"),
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="home_features",
    )

    years_value = models.CharField(_("лет на рынке"), max_length=20, default="12")
    travellers_value = models.CharField(_("путешественников"), max_length=20, default="7 400+")
    tours_value = models.CharField(_("туры"), max_length=20, default="24")
    rating_value = models.CharField(_("рейтинг"), max_length=20, default="4.9/5")

    class Meta:
        verbose_name = _("Настройки сайта")
        verbose_name_plural = _("Настройки сайта")

    def __str__(self):
        return "Site settings"

    def save(self, *args, **kwargs):
        """Keep exactly one row so the admin always edits the same record."""
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        """The singleton is never removed."""
        return 0, {}


class Inquiry(models.Model):
    """Enquiries captured from the site form; amoCRM stays the system of record."""

    created_at = models.DateTimeField(_("получена"), auto_now_add=True)
    name = models.CharField(_("имя"), max_length=200)
    email = models.EmailField(_("e-mail"))
    phone = models.CharField(_("телефон"), max_length=60, blank=True)
    tour = models.ForeignKey(
        Tour,
        verbose_name=_("тур"),
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="inquiries",
    )
    people = models.CharField(_("путешественников"), max_length=10, blank=True)
    start_date = models.DateField(_("желаемая дата"), null=True, blank=True)
    message = models.TextField(_("сообщение"))
    locale = models.CharField(_("язык сайта"), max_length=5, blank=True)
    page = models.URLField(_("страница"), max_length=500, blank=True)
    sent_to_crm = models.BooleanField(_("отправлено в amoCRM"), default=False)

    class Meta:
        verbose_name = _("заявка")
        verbose_name_plural = _("Заявки")
        ordering = ("-created_at",)

    def __str__(self):
        return f"{self.name} ({self.created_at:%Y-%m-%d})"
