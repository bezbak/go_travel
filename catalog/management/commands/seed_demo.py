"""Load or refresh the bundled content. `migrate` already does this once."""

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from catalog import seeding
from catalog.models import Photo, Tour


class Command(BaseCommand):
    help = "Load the tours, destinations and photos the site ships with."

    def add_arguments(self, parser):
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Delete existing catalog content first (enquiries are kept).",
        )
        parser.add_argument(
            "--sync",
            action="store_true",
            help=(
                "Add tours, destinations and photos from seed.json that are not "
                "in the database yet, and leave edited content alone."
            ),
        )

        parser.add_argument(
            "--translations",
            action="store_true",
            help=(
                "Fill fields that are still empty for any language from seed.json "
                "(existing text is never overwritten)."
            ),
        )

    @transaction.atomic
    def handle(self, *args, **options):
        if options["translations"]:
            seeding.fill_missing_translations(stdout=self.stdout)
            self.stdout.write(self.style.SUCCESS("Translations filled."))
            return

        if options["sync"]:
            if options["reset"]:
                raise CommandError("--sync and --reset do the opposite; pick one.")

            seeding.add_missing(stdout=self.stdout)
            seeding.apply_tour_order(stdout=self.stdout)
            self.stdout.write(self.style.SUCCESS("Seed content synced."))
            return

        if options["reset"]:
            seeding.clear()
            self.stdout.write(self.style.WARNING("Existing catalog content removed."))
        elif Tour.objects.exists() or Photo.objects.exists():
            self.stdout.write(
                self.style.NOTICE(
                    "Catalog already has content; nothing loaded. Use --reset to replace it."
                )
            )
            return

        seeding.run(stdout=self.stdout)
        self.stdout.write(self.style.SUCCESS("Demo content loaded."))
