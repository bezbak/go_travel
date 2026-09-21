"""
Admin for the Go Kyrgyzstan content.

Photo thumbnails everywhere carry `data-lightbox` / `data-full`; the bundled
`catalog/js/gallery.js` turns every group sharing a `data-lightbox` value into
one browsable gallery, so route photos open full size with prev/next.
"""

from django.contrib import admin
from django.db.models import Count
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from django.utils.translation import gettext_lazy as _

from .models import (
    Departure,
    Destination,
    DestinationPhoto,
    FaqItem,
    GalleryPhoto,
    Inquiry,
    Photo,
    SiteSettings,
    TeamMember,
    Testimonial,
    Tour,
    TourDay,
    TourNote,
    TourPhoto,
)

admin.site.site_title = "Go Kyrgyzstan"
admin.site.site_header = "Go Kyrgyzstan"
admin.site.index_title = _("Контент")


def thumb(photo, gallery="admin", size=74):
    """A square thumbnail that opens the shared lightbox when clicked."""
    if photo is None or not photo.image:
        return mark_safe('<span class="gk-thumb gk-thumb--empty">&mdash;</span>')

    caption = photo.alt_ru or photo.alt_en or photo.key
    return format_html(
        '<img src="{}" alt="{}" title="{}" class="gk-thumb" loading="lazy"'
        ' style="width:{}px;height:{}px"'
        ' data-lightbox="{}" data-full="{}" data-caption="{}">',
        photo.image.url,
        caption,
        caption,
        size,
        size,
        gallery,
        photo.image.url,
        caption,
    )


class LightboxMedia:
    """Shared assets; Jazzmin's custom_css/js only load on some admin pages."""

    class Media:
        css = {"all": ("catalog/css/admin.css",)}
        js = ("catalog/js/gallery.js",)


# ---------------------------------------------------------------------------
# Photo library
# ---------------------------------------------------------------------------


@admin.register(Photo)
class PhotoAdmin(LightboxMedia, admin.ModelAdmin):
    list_display = ("preview", "key", "alt_ru", "dimensions", "used_in")
    list_display_links = ("preview", "key")
    search_fields = ("key", "alt_en", "alt_ru", "alt_kg", "alt_fr", "alt_de", "alt_es")
    readonly_fields = ("large_preview", "width", "height", "created_at")
    list_per_page = 40

    fieldsets = (
        (_("Фото"), {"fields": ("large_preview", "key", "image", ("width", "height"), "created_at")}),
        (_("Alt-текст"), {"fields": ("alt_en", "alt_ru", "alt_kg", "alt_fr", "alt_de", "alt_es")}),
    )

    @admin.display(description=_("превью"))
    def preview(self, obj):
        return thumb(obj, gallery="photo-library")

    @admin.display(description=_("превью"))
    def large_preview(self, obj):
        if not obj.image:
            return "—"
        return format_html(
            '<img src="{}" class="gk-thumb gk-thumb--large" data-lightbox="photo-detail"'
            ' data-full="{}" data-caption="{}">',
            obj.image.url,
            obj.image.url,
            obj.alt_ru or obj.alt_en or obj.key,
        )

    @admin.display(description=_("размер"))
    def dimensions(self, obj):
        return f"{obj.width}x{obj.height}"

    @admin.display(description=_("используется"))
    def used_in(self, obj):
        parts = []
        for count, label in (
            (obj.tour_heroes.count() + obj.tour_cards.count(), _("обложки туров")),
            (obj.tour_days.count(), _("дни маршрута")),
            (obj.tourphoto_set.count(), _("Фото маршрута")),
            (obj.destination_heroes.count() + obj.destination_cards.count(), _("обложки направлений")),
            (obj.destinationphoto_set.count(), _("галереи направлений")),
        ):
            if count:
                parts.append(f"{label}: {count}")
        return ", ".join(str(p) for p in parts) or "—"


# ---------------------------------------------------------------------------
# Tours
# ---------------------------------------------------------------------------


class TourDayInline(admin.StackedInline):
    model = TourDay
    extra = 0
    ordering = ("number",)
    autocomplete_fields = ("photo",)
    readonly_fields = ("day_preview",)
    fields = (
        ("number", "photo", "day_preview"),
        ("title_en", "title_ru"),
        ("title_kg", "title_fr"),
        ("title_de", "title_es"),
        ("description_en", "description_ru"),
        ("description_kg", "description_fr"),
        ("description_de", "description_es"),
    )
    verbose_name = _("день маршрута")
    verbose_name_plural = _("Маршрут по дням — на сайте это карточки дней")

    @admin.display(description=_("превью"))
    def day_preview(self, obj):
        return thumb(getattr(obj, "photo", None), gallery="tour-days")


class TourPhotoInline(admin.TabularInline):
    """Route photos. The preview column is the gallery the client asked for."""

    model = TourPhoto
    extra = 1
    ordering = ("order",)
    autocomplete_fields = ("photo",)
    readonly_fields = ("photo_preview",)
    fields = ("photo_preview", "photo", "order")
    verbose_name = _("фото маршрута")
    verbose_name_plural = _("Фото маршрута — нажмите на миниатюру, чтобы открыть галерею")

    @admin.display(description=_("превью"))
    def photo_preview(self, obj):
        return thumb(getattr(obj, "photo", None), gallery="tour-route")


class TourNoteInline(admin.StackedInline):
    model = TourNote
    extra = 0
    ordering = ("order",)
    fields = (
        "order",
        ("title_en", "title_ru"),
        ("title_kg", "title_fr"),
        ("title_de", "title_es"),
        ("description_en", "description_ru"),
        ("description_kg", "description_fr"),
        ("description_de", "description_es"),
    )
    verbose_name_plural = _("Полезно знать — аккордеон под маршрутом")


class DepartureInline(admin.TabularInline):
    model = Departure
    extra = 0
    ordering = ("date",)
    fields = ("date", "seats_left", "price_eur")


@admin.register(Tour)
class TourAdmin(LightboxMedia, admin.ModelAdmin):
    list_display = (
        "card_preview",
        "name_ru",
        "slug",
        "price_eur",
        "day_count",
        "difficulty",
        "style",
        "featured",
        "is_published",
    )
    list_display_links = ("card_preview", "name_ru")
    list_editable = ("featured", "is_published")
    list_filter = ("is_published", "featured", "difficulty", "style", "destinations")
    search_fields = ("slug", "name_en", "name_ru", "name_kg", "name_fr", "name_de", "name_es")
    prepopulated_fields = {"slug": ("name_en",)}
    filter_horizontal = ("destinations",)
    autocomplete_fields = ("hero_photo", "card_photo")
    readonly_fields = ("cover_preview", "route_gallery")
    inlines = (TourDayInline, TourPhotoInline, TourNoteInline, DepartureInline)
    save_on_top = True
    list_per_page = 30

    fieldsets = (
        (
            _("Основное"),
            {
                "fields": (
                    ("slug", "order"),
                    ("is_published", "featured"),
                    "destinations",
                    ("difficulty", "style"),
                    ("group_size_max", "seasons"),
                )
            },
        ),
        (
            _("Цена и рейтинг"),
            {"fields": (("price_eur", "old_price_eur"), ("rating", "review_count"))},
        ),
        (
            _("Фотографии"),
            {
                "fields": ("cover_preview", ("hero_photo", "card_photo"), "route_gallery"),
                "description": _("Фото маршрута добавляются в блоке «Фото маршрута» ниже; нажмите на любую миниатюру, чтобы открыть галерею."),
            },
        ),
        (_("Название"), {"fields": ("name_en", "name_ru", "name_kg", "name_fr", "name_de", "name_es")}),
        (_("Подзаголовок"), {"fields": ("tagline_en", "tagline_ru", "tagline_kg", "tagline_fr", "tagline_de", "tagline_es")}),
        (_("Краткое описание"), {"fields": ("summary_en", "summary_ru", "summary_kg", "summary_fr", "summary_de", "summary_es")}),
        (_("Описание"), {"fields": ("overview_en", "overview_ru", "overview_kg", "overview_fr", "overview_de", "overview_es")}),
        (
            _("Изюминки"),
            {"fields": ("highlights_en", "highlights_ru", "highlights_kg", "highlights_fr", "highlights_de", "highlights_es")},
        ),
        (_("Входит в стоимость"), {"fields": ("included_en", "included_ru", "included_kg", "included_fr", "included_de", "included_es")}),
        (
            _("Не входит в стоимость"),
            {"fields": ("excluded_en", "excluded_ru", "excluded_kg", "excluded_fr", "excluded_de", "excluded_es")},
        ),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(_day_count=Count("days", distinct=True))

    @admin.display(description=_("обложка"))
    def card_preview(self, obj):
        return thumb(obj.card_photo, gallery="tour-list", size=64)

    @admin.display(description=_("дней"), ordering="_day_count")
    def day_count(self, obj):
        return obj._day_count

    @admin.display(description=_("обложки"))
    def cover_preview(self, obj):
        if not obj.pk:
            return _("Сохраните тур, чтобы увидеть здесь фото.")
        return format_html(
            '<div class="gk-gallery">{}{}</div>',
            thumb(obj.hero_photo, gallery="tour-covers", size=140),
            thumb(obj.card_photo, gallery="tour-covers", size=140),
        )

    @admin.display(description=_("Галерея маршрута"))
    def route_gallery(self, obj):
        if not obj.pk:
            return _("Сначала сохраните тур, затем добавьте фото маршрута ниже.")

        items = [tp.photo for tp in obj.gallery.select_related("photo")]
        if not items:
            return format_html(
                '<p class="gk-empty">{}</p>',
                _("Фото маршрута пока нет — добавьте их в блоке ниже."),
            )

        return format_html(
            '<div class="gk-gallery">{}</div>',
            mark_safe("".join(str(thumb(photo, gallery="tour-route", size=120)) for photo in items)),
        )


# ---------------------------------------------------------------------------
# Destinations
# ---------------------------------------------------------------------------


class DestinationPhotoInline(admin.TabularInline):
    model = DestinationPhoto
    extra = 1
    ordering = ("order",)
    autocomplete_fields = ("photo",)
    readonly_fields = ("photo_preview",)
    fields = ("photo_preview", "photo", "order")
    verbose_name_plural = _("Галерея — нажмите на миниатюру, чтобы открыть её целиком")

    @admin.display(description=_("превью"))
    def photo_preview(self, obj):
        return thumb(getattr(obj, "photo", None), gallery="destination-gallery")


@admin.register(Destination)
class DestinationAdmin(LightboxMedia, admin.ModelAdmin):
    list_display = (
        "card_preview",
        "name_ru",
        "slug",
        "altitude_m",
        "drive_hours",
        "tour_count",
        "is_published",
    )
    list_display_links = ("card_preview", "name_ru")
    list_editable = ("is_published",)
    list_filter = ("is_published",)
    search_fields = ("slug", "name_en", "name_ru", "name_kg", "name_fr", "name_de", "name_es")
    prepopulated_fields = {"slug": ("name_en",)}
    autocomplete_fields = ("hero_photo", "card_photo")
    readonly_fields = ("cover_preview", "gallery_preview")
    inlines = (DestinationPhotoInline,)
    save_on_top = True

    fieldsets = (
        (_("Основное"), {"fields": (("slug", "order"), "is_published")}),
        (
            _("Характеристики"),
            {"fields": (("altitude_m", "drive_hours"), "best_months")},
        ),
        (_("Фотографии"), {"fields": ("cover_preview", ("hero_photo", "card_photo"), "gallery_preview")}),
        (_("Название"), {"fields": ("name_en", "name_ru", "name_kg", "name_fr", "name_de", "name_es")}),
        (_("Краткое описание"), {"fields": ("summary_en", "summary_ru", "summary_kg", "summary_fr", "summary_de", "summary_es")}),
        (
            _("Лучшее время"),
            {"fields": ("best_time_en", "best_time_ru", "best_time_kg", "best_time_fr", "best_time_de", "best_time_es")},
        ),
        (_("Текст страницы"), {"fields": ("body_en", "body_ru", "body_kg", "body_fr", "body_de", "body_es")}),
        (
            _("Изюминки"),
            {"fields": ("highlights_en", "highlights_ru", "highlights_kg", "highlights_fr", "highlights_de", "highlights_es")},
        ),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(_tour_count=Count("tours", distinct=True))

    @admin.display(description=_("обложка"))
    def card_preview(self, obj):
        return thumb(obj.card_photo, gallery="destination-list", size=64)

    @admin.display(description=_("туры"), ordering="_tour_count")
    def tour_count(self, obj):
        return obj._tour_count

    @admin.display(description=_("обложки"))
    def cover_preview(self, obj):
        if not obj.pk:
            return _("Сохраните направление, чтобы увидеть здесь фото.")
        return format_html(
            '<div class="gk-gallery">{}{}</div>',
            thumb(obj.hero_photo, gallery="destination-covers", size=140),
            thumb(obj.card_photo, gallery="destination-covers", size=140),
        )

    @admin.display(description=_("галерея"))
    def gallery_preview(self, obj):
        if not obj.pk:
            return _("Сначала сохраните направление, затем добавьте фото галереи ниже.")

        items = [dp.photo for dp in obj.gallery.select_related("photo")]
        if not items:
            return format_html('<p class="gk-empty">{}</p>', _("Фотографий в галерее пока нет."))
        return format_html(
            '<div class="gk-gallery">{}</div>',
            mark_safe(
                "".join(str(thumb(photo, gallery="destination-gallery", size=120)) for photo in items)
            ),
        )


# ---------------------------------------------------------------------------
# Everything else
# ---------------------------------------------------------------------------


@admin.register(GalleryPhoto)
class GalleryPhotoAdmin(LightboxMedia, admin.ModelAdmin):
    list_display = ("preview", "photo", "order", "is_published")
    list_display_links = ("preview", "photo")
    list_editable = ("order", "is_published")
    autocomplete_fields = ("photo",)

    @admin.display(description=_("превью"))
    def preview(self, obj):
        return thumb(obj.photo, gallery="home-gallery")


@admin.register(TeamMember)
class TeamMemberAdmin(LightboxMedia, admin.ModelAdmin):
    list_display = ("preview", "name", "role_ru", "order", "is_published")
    list_display_links = ("preview", "name")
    list_editable = ("order", "is_published")
    search_fields = ("name", "key", "role_en")
    autocomplete_fields = ("photo",)
    prepopulated_fields = {"key": ("name",)}

    fieldsets = (
        (_("Основное"), {"fields": (("key", "order"), "is_published", "name", "photo")}),
        (_("Должность"), {"fields": ("role_en", "role_ru", "role_kg", "role_fr", "role_de", "role_es")}),
        (_("О сотруднике"), {"fields": ("bio_en", "bio_ru", "bio_kg", "bio_fr", "bio_de", "bio_es")}),
    )

    @admin.display(description=_("фото"))
    def preview(self, obj):
        return thumb(obj.photo, gallery="team", size=56)


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ("name", "country_ru", "tour", "rating", "order", "is_published")
    list_editable = ("order", "is_published")
    list_filter = ("rating", "is_published", "tour")
    search_fields = ("name", "key", "quote_en", "quote_ru")
    autocomplete_fields = ("tour",)
    prepopulated_fields = {"key": ("name",)}

    fieldsets = (
        (
            _("Основное"),
            {"fields": (("key", "order"), "is_published", "name", ("tour", "rating"))},
        ),
        (_("Страна"), {"fields": ("country_en", "country_ru", "country_kg", "country_fr", "country_de", "country_es")}),
        (_("Отзыв"), {"fields": ("quote_en", "quote_ru", "quote_kg", "quote_fr", "quote_de", "quote_es")}),
    )


@admin.register(FaqItem)
class FaqItemAdmin(admin.ModelAdmin):
    list_display = ("question_ru", "key", "order", "is_published")
    list_display_links = ("question_ru",)
    list_editable = ("order", "is_published")
    list_filter = ("is_published",)
    search_fields = ("key", "question_en", "question_ru", "answer_en", "answer_ru")

    fieldsets = (
        (_("Основное"), {"fields": (("key", "order"), "is_published")}),
        (
            _("Вопрос"),
            {"fields": ("question_en", "question_ru", "question_kg", "question_fr", "question_de", "question_es")},
        ),
        (_("Ответ"), {"fields": ("answer_en", "answer_ru", "answer_kg", "answer_fr", "answer_de", "answer_es")}),
    )


@admin.register(SiteSettings)
class SiteSettingsAdmin(LightboxMedia, admin.ModelAdmin):
    autocomplete_fields = ("hero_photo", "feature_photo")
    readonly_fields = ("home_photo_preview",)

    fieldsets = (
        (_("Контакты"), {"fields": (("phone", "phone_href"), ("whatsapp", "whatsapp_href"), "email")}),
        (_("Соцсети"), {"fields": ("instagram_href",)}),
        (_("Офис"), {"fields": ("address_lines", "map_query")}),
        (
            _("Фото на главной"),
            {"fields": ("home_photo_preview", ("hero_photo", "feature_photo"))},
        ),
        (
            _("Цифры компании"),
            {"fields": (("years_value", "travellers_value"), ("tours_value", "rating_value"))},
        ),
    )

    @admin.display(description=_("превью"))
    def home_photo_preview(self, obj):
        return format_html(
            '<div class="gk-gallery">{}{}</div>',
            thumb(obj.hero_photo, gallery="home-photos", size=140),
            thumb(obj.feature_photo, gallery="home-photos", size=140),
        )

    def has_add_permission(self, request):
        """One row only — the singleton is created by the seed migration."""
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ("created_at", "name", "email", "phone", "tour", "people", "sent_to_crm")
    list_filter = ("sent_to_crm", "locale", "tour", "created_at")
    search_fields = ("name", "email", "phone", "message")
    date_hierarchy = "created_at"
    readonly_fields = (
        "created_at",
        "name",
        "email",
        "phone",
        "tour",
        "people",
        "start_date",
        "message",
        "locale",
        "page",
    )

    def has_add_permission(self, request):
        """Enquiries only arrive from the site form."""
        return False
