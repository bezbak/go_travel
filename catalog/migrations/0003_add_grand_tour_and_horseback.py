"""
Adds the Grand Tour and the Song-Kol horseback tour, plus the Ala-Kul and
Altyn-Arashan region they need, to catalogs seeded before those existed.

`catalog/seed/seed.json` is the source of truth and already carries them, so a
fresh clone gets everything from migration 0002 and this one finds nothing to
add. On a database seeded by the earlier file it creates exactly the rows that
are missing and leaves edited content alone.

The re-order afterwards is what keeps the home page at three featured cards:
the Grand Tour moves to the front of the list and `kel-suu-expedition` stops
being featured, both of which are editable in the admin afterwards.
"""

from django.db import migrations

from catalog import seeding

ADDED_TOURS = ("grand-tour-of-kyrgyzstan", "song-kol-horseback")
ADDED_DESTINATIONS = ("ala-kul-and-altyn-arashan",)


def load(apps, schema_editor):
    seeding.add_missing(apps=apps)
    seeding.apply_tour_order(apps=apps)


def unload(apps, schema_editor):
    """Remove only what this migration introduced; the 0002 content stays."""
    apps.get_model("catalog", "Tour").objects.filter(slug__in=ADDED_TOURS).delete()
    apps.get_model("catalog", "Destination").objects.filter(
        slug__in=ADDED_DESTINATIONS
    ).delete()


class Migration(migrations.Migration):
    dependencies = [("catalog", "0002_seed_demo_content")]

    operations = [migrations.RunPython(load, unload)]
