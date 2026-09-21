"""
Loads the mock content shipped with the project.

`catalog/seed/seed.json` and `catalog/seed/images/` hold the exact tours,
destinations, photos and translations the Next.js site ships with, so a fresh
clone has a populated admin after `migrate` alone.

Both the data migration and `manage.py seed_demo` call `run()`; the migration
passes the historical `apps` registry so it stays valid as models evolve.
"""

import datetime
import json
from pathlib import Path

from django.core.files import File

SEED_DIR = Path(__file__).resolve().parent / "seed"
SEED_JSON = SEED_DIR / "seed.json"
SEED_IMAGES = SEED_DIR / "images"

LOCALES = ("en", "ru", "kg", "fr", "de", "es")

# Model name -> the field this seed treats as its natural key.
SEEDED_MODELS = (
    "Departure",
    "TourPhoto",
    "TourNote",
    "TourDay",
    "DestinationPhoto",
    "GalleryPhoto",
    "Testimonial",
    "TeamMember",
    "FaqItem",
    "Tour",
    "Destination",
    "Photo",
    "SiteSettings",
)


def load_seed():
    with SEED_JSON.open(encoding="utf-8") as handle:
        return json.load(handle)


def _set_translations(obj, field, values, joiner="\n"):
    """Copy one translated field across all four locales onto `obj`."""
    for locale in LOCALES:
        value = values.get(locale, values.get("en"))
        if isinstance(value, list):
            value = joiner.join(value)
        setattr(obj, f"{field}_{locale}", value or "")


def _resolve(apps, name):
    if apps is not None:
        return apps.get_model("catalog", name)
    from django.apps import apps as global_apps

    return global_apps.get_model("catalog", name)


def clear(apps=None):
    """Remove seeded rows; ordered so foreign keys never block a delete."""
    for name in SEEDED_MODELS:
        _resolve(apps, name).objects.all().delete()


def create_photo(Photo, entry):
    """One row of the shared photo library, with its file copied into media/."""
    photo = Photo(key=entry["key"])
    _set_translations(photo, "alt", entry["alt"])

    source = SEED_IMAGES / Path(entry["src"]).name
    if not source.exists():
        raise FileNotFoundError(f"Seed image missing: {source}")

    with source.open("rb") as handle:
        photo.image.save(source.name, File(handle), save=False)
    photo.save()
    return photo


def create_destination(Destination, DestinationPhoto, entry, photos):
    destination = Destination(
        slug=entry["slug"],
        order=entry["order"],
        altitude_m=entry["altitude_m"],
        drive_hours=entry["drive_hours"],
        best_months=entry["best_months"],
        hero_photo=photos[entry["hero"]],
        card_photo=photos[entry["card"]],
    )
    for field in ("name", "summary", "best_time", "body", "highlights"):
        _set_translations(destination, field, entry[field])
    destination.save()

    for order, key in enumerate(entry["gallery"]):
        DestinationPhoto.objects.create(
            destination=destination, photo=photos[key], order=order
        )
    return destination


def create_tour(models, entry, photos, destinations):
    """
    `models` carries the five classes a tour needs. They are passed in rather
    than imported because the data migrations hand over historical versions.
    """
    Tour, TourDay, TourPhoto, TourNote, Departure = models

    tour = Tour(
        slug=entry["slug"],
        order=entry["order"],
        featured=entry["featured"],
        group_size_max=entry["group_size_max"],
        difficulty=entry["difficulty"],
        style=entry["style"],
        seasons=entry["seasons"],
        price_eur=entry["price_eur"],
        old_price_eur=entry["old_price_eur"],
        rating=entry["rating"],
        review_count=entry["review_count"],
        hero_photo=photos[entry["hero"]],
        card_photo=photos[entry["card"]],
    )
    for field in (
        "name",
        "tagline",
        "summary",
        "overview",
        "highlights",
        "included",
        "excluded",
    ):
        _set_translations(tour, field, entry[field])
    tour.save()
    tour.destinations.set(destinations[slug] for slug in entry["destinations"])

    for day in entry["days"]:
        record = TourDay(tour=tour, number=day["number"], photo=photos[day["photo"]])
        _set_translations(record, "title", day["title"])
        _set_translations(record, "description", day["description"])
        record.save()

    for order, key in enumerate(entry["gallery"]):
        TourPhoto.objects.create(tour=tour, photo=photos[key], order=order)

    for order, note in enumerate(entry["notes"]["en"]):
        record = TourNote(tour=tour, order=order)
        _set_translations(
            record, "title", {loc: entry["notes"][loc][order]["title"] for loc in LOCALES}
        )
        _set_translations(
            record,
            "description",
            {loc: entry["notes"][loc][order]["description"] for loc in LOCALES},
        )
        record.save()

    for departure in entry["departures"]:
        Departure.objects.create(
            tour=tour,
            date=datetime.date.fromisoformat(departure["date"]),
            seats_left=departure["seats_left"],
            price_eur=departure["price_eur"],
        )
    return tour


def add_missing(apps=None, stdout=None):
    """
    Create the seed photos, destinations and tours that are not in the database
    yet, and leave everything already there untouched.

    `run()` only works on an empty catalog, so this is what later migrations use
    to ship new content to installations that were seeded by an earlier one. On
    a fresh clone the first migration has already loaded the same file, so this
    finds nothing to do.
    """

    def log(message):
        if stdout is not None:
            stdout.write(message)

    data = load_seed()

    Photo = _resolve(apps, "Photo")
    Destination = _resolve(apps, "Destination")
    DestinationPhoto = _resolve(apps, "DestinationPhoto")
    tour_models = tuple(
        _resolve(apps, name)
        for name in ("Tour", "TourDay", "TourPhoto", "TourNote", "Departure")
    )
    Tour = tour_models[0]

    photos = {photo.key: photo for photo in Photo.objects.all()}
    added_photos = 0
    for entry in data["images"]:
        if entry["key"] not in photos:
            photos[entry["key"]] = create_photo(Photo, entry)
            added_photos += 1

    destinations = {item.slug: item for item in Destination.objects.all()}
    added_destinations = []
    for entry in data["destinations"]:
        if entry["slug"] not in destinations:
            destinations[entry["slug"]] = create_destination(
                Destination, DestinationPhoto, entry, photos
            )
            added_destinations.append(entry["slug"])

    existing_tours = set(Tour.objects.values_list("slug", flat=True))
    added_tours = []
    for entry in data["tours"]:
        if entry["slug"] not in existing_tours:
            create_tour(tour_models, entry, photos, destinations)
            added_tours.append(entry["slug"])

    log(
        f"added {added_photos} photos, "
        f"{len(added_destinations)} destinations {added_destinations}, "
        f"{len(added_tours)} tours {added_tours}"
    )
    return {
        "photos": added_photos,
        "destinations": added_destinations,
        "tours": added_tours,
    }


def apply_tour_order(apps=None, stdout=None):
    """
    Push the `order` and `featured` values from `seed.json` onto the tours that
    already exist, so the shipped content keeps the running order its author
    intended after new tours are inserted in the middle of it.
    """

    Tour = _resolve(apps, "Tour")
    updated = 0

    for entry in load_seed()["tours"]:
        changed = Tour.objects.filter(slug=entry["slug"]).exclude(
            order=entry["order"], featured=entry["featured"]
        ).update(order=entry["order"], featured=entry["featured"])
        updated += changed

    if stdout is not None:
        stdout.write(f"re-ordered {updated} tours")
    return updated


def _join(value):
    return "\n".join(value) if isinstance(value, list) else (value or "")


def _fill_empty(obj, field, values):
    """Set `field_<locale>` from `values` wherever the stored text is empty."""
    changed = []
    for locale in LOCALES:
        attr = f"{field}_{locale}"
        text = _join(values.get(locale))
        if text and not getattr(obj, attr, ""):
            setattr(obj, attr, text)
            changed.append(attr)
    return changed


def fill_missing_translations(apps=None, stdout=None):
    """
    Copy seed translations into rows whose text for a locale is still empty.

    This is how a locale added after the first deployment (German and Spanish
    were) reaches an existing database: rows are matched to `seed.json` by their
    slug or key, and only empty fields are written, so anything an editor has
    typed or changed in the admin is left alone.
    """
    data = load_seed()
    filled = 0

    def save(obj, changed):
        nonlocal filled
        if changed:
            obj.save(update_fields=changed)
            filled += len(changed)

    Photo = _resolve(apps, "Photo")
    for entry in data["images"]:
        obj = Photo.objects.filter(key=entry["key"]).first()
        if obj:
            save(obj, _fill_empty(obj, "alt", entry["alt"]))

    Destination = _resolve(apps, "Destination")
    for entry in data["destinations"]:
        obj = Destination.objects.filter(slug=entry["slug"]).first()
        if obj:
            changed = []
            for field in ("name", "summary", "best_time", "body", "highlights"):
                changed += _fill_empty(obj, field, entry[field])
            save(obj, changed)

    Tour = _resolve(apps, "Tour")
    TourDay = _resolve(apps, "TourDay")
    TourNote = _resolve(apps, "TourNote")
    for entry in data["tours"]:
        tour = Tour.objects.filter(slug=entry["slug"]).first()
        if not tour:
            continue
        changed = []
        for field in ("name", "tagline", "summary", "overview", "highlights", "included", "excluded"):
            changed += _fill_empty(tour, field, entry[field])
        save(tour, changed)

        for day in entry["days"]:
            obj = TourDay.objects.filter(tour=tour, number=day["number"]).first()
            if obj:
                changed = _fill_empty(obj, "title", day["title"])
                changed += _fill_empty(obj, "description", day["description"])
                save(obj, changed)

        for order, note in enumerate(entry["notes"]["en"]):
            obj = TourNote.objects.filter(tour=tour, order=order).first()
            if obj:
                titles = {loc: entry["notes"][loc][order]["title"] for loc in LOCALES}
                texts = {loc: entry["notes"][loc][order]["description"] for loc in LOCALES}
                changed = _fill_empty(obj, "title", titles)
                changed += _fill_empty(obj, "description", texts)
                save(obj, changed)

    for model_name, key_field, fields, section in (
        ("TeamMember", "key", ("role", "bio"), "team"),
        ("Testimonial", "key", ("country", "quote"), "testimonials"),
        ("FaqItem", "key", ("question", "answer"), "faq"),
    ):
        Model = _resolve(apps, model_name)
        for entry in data[section]:
            obj = Model.objects.filter(**{key_field: entry[key_field]}).first()
            if obj:
                changed = []
                for field in fields:
                    changed += _fill_empty(obj, field, entry[field])
                save(obj, changed)

    if stdout is not None:
        stdout.write(f"filled {filled} empty translation fields")
    return filled


def run(apps=None, stdout=None):
    """Create every seed object. Safe to call once on an empty catalog."""

    def log(message):
        if stdout is not None:
            stdout.write(message)

    data = load_seed()

    Photo = _resolve(apps, "Photo")
    Destination = _resolve(apps, "Destination")
    DestinationPhoto = _resolve(apps, "DestinationPhoto")
    Tour = _resolve(apps, "Tour")
    TourDay = _resolve(apps, "TourDay")
    TourPhoto = _resolve(apps, "TourPhoto")
    TourNote = _resolve(apps, "TourNote")
    Departure = _resolve(apps, "Departure")
    TeamMember = _resolve(apps, "TeamMember")
    Testimonial = _resolve(apps, "Testimonial")
    FaqItem = _resolve(apps, "FaqItem")
    GalleryPhoto = _resolve(apps, "GalleryPhoto")
    SiteSettings = _resolve(apps, "SiteSettings")

    # --- photo library ----------------------------------------------------
    photos = {entry["key"]: create_photo(Photo, entry) for entry in data["images"]}
    log(f"photos: {len(photos)}")

    # --- destinations -----------------------------------------------------
    destinations = {
        entry["slug"]: create_destination(
            Destination, DestinationPhoto, entry, photos
        )
        for entry in data["destinations"]
    }
    log(f"destinations: {len(destinations)}")

    # --- tours ------------------------------------------------------------
    tour_models = (Tour, TourDay, TourPhoto, TourNote, Departure)
    tours = {
        entry["slug"]: create_tour(tour_models, entry, photos, destinations)
        for entry in data["tours"]
    }
    log(f"tours: {len(tours)}")

    # --- home gallery -----------------------------------------------------
    src_to_key = {entry["src"]: entry["key"] for entry in data["images"]}
    for order, src in enumerate(data["gallery"]):
        GalleryPhoto.objects.create(photo=photos[src_to_key[src]], order=order)

    # --- team, testimonials, FAQ -----------------------------------------
    for entry in data["team"]:
        member = TeamMember(
            key=entry["key"], order=entry["order"], name=entry["name"], photo=photos[entry["photo"]]
        )
        _set_translations(member, "role", entry["role"])
        _set_translations(member, "bio", entry["bio"])
        member.save()

    for entry in data["testimonials"]:
        testimonial = Testimonial(
            key=entry["key"],
            order=entry["order"],
            name=entry["name"],
            tour=tours.get(entry["tour"]),
            rating=entry["rating"],
        )
        _set_translations(testimonial, "country", entry["country"])
        _set_translations(testimonial, "quote", entry["quote"])
        testimonial.save()

    for entry in data["faq"]:
        item = FaqItem(key=entry["key"], order=entry["order"])
        _set_translations(item, "question", entry["question"])
        _set_translations(item, "answer", entry["answer"])
        item.save()

    # --- site settings ----------------------------------------------------
    contact = data["contact"]
    stats = {row["key"]: row["value"] for row in data["stats"]}
    social = {row["key"]: row["href"] for row in data["social"]}

    SiteSettings.objects.create(
        pk=1,
        hero_photo=photos[src_to_key[data["hero_image"]]],
        feature_photo=photos[src_to_key[data["feature_image"]]],
        phone=contact["phone"],
        phone_href=contact["phoneHref"],
        whatsapp=contact["whatsapp"],
        whatsapp_href=contact["whatsappHref"],
        instagram_href=social.get("instagram", ""),
        email=contact["email"],
        address_lines="\n".join(contact["addressLines"]),
        map_query=contact["mapQuery"],
        years_value=stats["years"],
        travellers_value=stats["travellers"],
        tours_value=stats["tours"],
        rating_value=stats["rating"],
    )
    log("team, testimonials, FAQ and site settings created")
