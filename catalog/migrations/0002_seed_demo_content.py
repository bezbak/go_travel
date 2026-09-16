"""
Loads the mock tours, destinations and photos shipped in `catalog/seed/`.

Running it as a migration means a fresh clone has a fully populated admin
right after `migrate`, which is how the site's demo data is expected to
arrive. `manage.py seed_demo --reset` reloads it later.
"""

from django.db import migrations

from catalog import seeding


def load(apps, schema_editor):
    seeding.run(apps=apps)


def unload(apps, schema_editor):
    seeding.clear(apps=apps)


class Migration(migrations.Migration):
    dependencies = [("catalog", "0001_initial")]

    operations = [migrations.RunPython(load, unload)]
