"""
Fills the German and Spanish text added in 0004 on databases that already hold
content. Only empty fields are written, so anything edited in the admin stays.
A fresh clone gets the same result: 0002 seeds the catalog and this migration
adds the two new languages on top of it.
"""

from django.db import migrations

from catalog import seeding


def load(apps, schema_editor):
    seeding.fill_missing_translations(apps=apps)


class Migration(migrations.Migration):
    dependencies = [("catalog", "0004_add_german_spanish")]

    operations = [migrations.RunPython(load, migrations.RunPython.noop)]
