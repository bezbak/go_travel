"""
Read-only JSON for the Next.js site, plus the enquiry endpoint.

Content is returned in one locale at a time (`?locale=ru`), shaped like the
`src/data/*.ts` modules the site already consumes, so the frontend can switch
to the API without reshaping its components.
"""

from django.http import Http404
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import (
    Destination,
    FaqItem,
    GalleryPhoto,
    Inquiry,
    Photo,
    SiteSettings,
    TeamMember,
    Testimonial,
    Tour,
)

LOCALES = ("en", "ru", "kg", "fr")


def pick_locale(request):
    locale = request.GET.get("locale", "en")
    return locale if locale in LOCALES else "en"


def lines(value):
    """Textareas store one item per line; the site wants a list."""
    return [line.strip() for line in (value or "").splitlines() if line.strip()]


def photo_payload(photo, locale):
    if photo is None or not photo.image:
        return None
    return {
        "src": photo.image.url,
        "width": photo.width,
        "height": photo.height,
        "alt": photo.translated("alt", locale),
    }


def destination_payload(destination, locale, *, full=False):
    payload = {
        "slug": destination.slug,
        "name": destination.translated("name", locale),
        "summary": destination.translated("summary", locale),
        "altitudeM": destination.altitude_m,
        "driveHours": destination.drive_hours,
        "bestMonths": destination.best_months,
        "bestTime": destination.translated("best_time", locale),
        "tourCount": destination.tours.filter(is_published=True).count(),
        "cardImage": photo_payload(destination.card_photo, locale),
    }
    if full:
        payload |= {
            "heroImage": photo_payload(destination.hero_photo, locale),
            "body": lines(destination.translated("body", locale)),
            "highlights": lines(destination.translated("highlights", locale)),
            "gallery": [
                photo_payload(item.photo, locale)
                for item in destination.gallery.select_related("photo")
            ],
        }
    return payload


def tour_payload(tour, locale, *, full=False):
    payload = {
        "slug": tour.slug,
        "featured": tour.featured,
        "name": tour.translated("name", locale),
        "tagline": tour.translated("tagline", locale),
        "summary": tour.translated("summary", locale),
        "destinations": [
            {"slug": d.slug, "name": d.translated("name", locale)}
            for d in tour.destinations.all()
        ],
        "groupSizeMax": tour.group_size_max,
        "difficulty": tour.difficulty,
        "style": tour.style,
        "seasons": tour.seasons,
        "priceEur": tour.price_eur,
        "oldPriceEur": tour.old_price_eur,
        "rating": float(tour.rating),
        "reviewCount": tour.review_count,
        "days": tour.days.count(),
        "cardImage": photo_payload(tour.card_photo, locale),
    }
    if full:
        payload |= {
            "heroImage": photo_payload(tour.hero_photo, locale),
            "overview": lines(tour.translated("overview", locale)),
            "highlights": lines(tour.translated("highlights", locale)),
            "included": lines(tour.translated("included", locale)),
            "excluded": lines(tour.translated("excluded", locale)),
            "notes": [
                {
                    "title": note.translated("title", locale),
                    "description": note.translated("description", locale),
                }
                for note in tour.notes.all()
            ],
            "itinerary": [
                {
                    "number": day.number,
                    "title": day.translated("title", locale),
                    "description": day.translated("description", locale),
                    "image": photo_payload(day.photo, locale),
                }
                for day in tour.days.select_related("photo")
            ],
            "gallery": [
                photo_payload(item.photo, locale)
                for item in tour.gallery.select_related("photo")
            ],
            "departures": [
                {
                    "date": departure.date.isoformat(),
                    "seatsLeft": departure.seats_left,
                    "priceEur": departure.price_eur,
                }
                for departure in tour.departures.all()
            ],
        }
    return payload


@api_view(["GET"])
def tour_list(request):
    locale = pick_locale(request)
    queryset = (
        Tour.objects.filter(is_published=True)
        .prefetch_related("destinations", "days")
        .select_related("card_photo")
    )
    if request.GET.get("featured") == "1":
        queryset = queryset.filter(featured=True)
    return Response([tour_payload(tour, locale) for tour in queryset])


@api_view(["GET"])
def tour_detail(request, slug):
    locale = pick_locale(request)
    try:
        tour = (
            Tour.objects.filter(is_published=True)
            .prefetch_related(
                "destinations", "days__photo", "gallery__photo", "departures", "notes"
            )
            .select_related("hero_photo", "card_photo")
            .get(slug=slug)
        )
    except Tour.DoesNotExist:
        raise Http404
    return Response(tour_payload(tour, locale, full=True))


@api_view(["GET"])
def destination_list(request):
    locale = pick_locale(request)
    queryset = (
        Destination.objects.filter(is_published=True)
        .select_related("card_photo")
        .prefetch_related("tours")
    )
    return Response([destination_payload(item, locale) for item in queryset])


@api_view(["GET"])
def destination_detail(request, slug):
    locale = pick_locale(request)
    try:
        destination = (
            Destination.objects.filter(is_published=True)
            .prefetch_related("gallery__photo")
            .select_related("hero_photo", "card_photo")
            .get(slug=slug)
        )
    except Destination.DoesNotExist:
        raise Http404
    return Response(destination_payload(destination, locale, full=True))


@api_view(["GET"])
def photo_library(request):
    """The whole photo library keyed by `key`, for page heroes and decoration."""
    locale = pick_locale(request)
    return Response(
        {photo.key: photo_payload(photo, locale) for photo in Photo.objects.all()}
    )


@api_view(["GET"])
def site_content(request):
    """Everything the site needs outside tours and destinations."""
    locale = pick_locale(request)
    settings_row = SiteSettings.objects.first()

    return Response(
        {
            "contact": {
                "phone": settings_row.phone,
                "phoneHref": settings_row.phone_href,
                "whatsapp": settings_row.whatsapp,
                "whatsappHref": settings_row.whatsapp_href,
                "instagramHref": settings_row.instagram_href,
                "email": settings_row.email,
                "addressLines": lines(settings_row.address_lines),
                "mapQuery": settings_row.map_query,
            }
            if settings_row
            else None,
            "heroImage": photo_payload(settings_row.hero_photo, locale) if settings_row else None,
            "featureImage": photo_payload(settings_row.feature_photo, locale)
            if settings_row
            else None,
            "stats": {
                "years": settings_row.years_value,
                "travellers": settings_row.travellers_value,
                "tours": settings_row.tours_value,
                "rating": settings_row.rating_value,
            }
            if settings_row
            else None,
            "gallery": [
                photo_payload(item.photo, locale)
                for item in GalleryPhoto.objects.filter(is_published=True).select_related("photo")
            ],
            "team": [
                {
                    "key": member.key,
                    "name": member.name,
                    "role": member.translated("role", locale),
                    "bio": member.translated("bio", locale),
                    "image": photo_payload(member.photo, locale),
                }
                for member in TeamMember.objects.filter(is_published=True).select_related("photo")
            ],
            "testimonials": [
                {
                    "key": item.key,
                    "name": item.name,
                    "country": item.translated("country", locale),
                    "tourSlug": item.tour.slug if item.tour else None,
                    "rating": item.rating,
                    "quote": item.translated("quote", locale),
                }
                for item in Testimonial.objects.filter(is_published=True).select_related("tour")
            ],
            "faq": [
                {
                    "key": item.key,
                    "question": item.translated("question", locale),
                    "answer": item.translated("answer", locale),
                }
                for item in FaqItem.objects.filter(is_published=True)
            ],
        }
    )


@api_view(["POST"])
def create_inquiry(request):
    """
    Stores an enquiry so it is visible in the admin. amoCRM remains the system
    of record — the site posts there through its own route.
    """
    data = request.data
    tour = Tour.objects.filter(slug=data.get("tour", "")).first()
    start_date = data.get("date") or None

    inquiry = Inquiry.objects.create(
        name=(data.get("name") or "")[:200],
        email=(data.get("email") or "")[:254],
        phone=(data.get("phone") or "")[:60],
        tour=tour,
        people=(data.get("people") or "")[:10],
        start_date=start_date,
        message=data.get("message") or "",
        locale=(data.get("locale") or "")[:5],
        page=(data.get("page") or "")[:500],
        sent_to_crm=bool(data.get("sentToCrm")),
    )
    return Response({"ok": True, "id": inquiry.pk}, status=201)
