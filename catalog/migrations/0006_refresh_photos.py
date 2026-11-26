"""
Ships the owner's own photographs to catalogs seeded before they were added.

The seed images were swapped for the owner's photos (twelve files replaced
under the same name, sixteen new ones) and the galleries extended to use them.
A fresh clone gets all of that from migration 0002, but an existing database
kept the old files: `add_missing()` only creates rows, never updates them.

`PREVIOUS` records what the earlier seed shipped. A photo file is replaced only
while it is still byte-for-byte the old seed image, and a hero or gallery is
only re-pointed while it still holds the old seed value, so photos uploaded and
galleries rearranged in the admin are left alone. On a fresh clone nothing
matches and this migration does nothing.
"""

from django.db import migrations

from catalog import seeding

PREVIOUS = {
    # sha256 of each seed image as shipped before the swap
    "files": {
        "heroYurts": "fe02b73b830472aa2ecfa7645ecfeddc5e80ee2833a182695deeb2743778afe5",
        "yurtsSunset": "fe3aed45edc3326f17cf8963fd66148ad7c4dbb5918996f3b3c85e66bb8b5c0a",
        "alpineLake": "61ec95c22acf7d8997bc9016c541e61627e595ed47a3afbc507afe261bfd9b8b",
        "kelSuu": "e61df9195941d736c670376db2e4e14e77410e9e0c4d831d3d05d02bb3bceb80",
        "songKol": "c865dc572e48a77cdba9eee41fea8139639c7ff9fbdd8f511f8685ef9e64391d",
        "kyzartHorses": "b52b25376c70c43d37209cac28fee573aa342bf52d52a94a332f6e0d20c05ec9",
        "kilemche": "1ac94761484738df03e77fc475620a85e9fea471f149b031e07bd35d743ef1a7",
        "jetiOguz": "656f0c779b09f5d3f656c096e8011632cc010b45130f949586e391b7e7d0de0d",
        "skazkaCanyon": "8bba399030bcc5d2567d1336ae51ad2dc6f7b236b9cc529c3484b93b3a3baf5f",
        "altynArashan": "ff3bb160bfb124129e3e27f4c63e4a862d1307eb3b96d87c8ee0de0549230994",
        "barskoonWaterfall": "8fd9389b959dd3126de1cc65638e8c3a842fcdf724cceea61e27aa549f17192f",
        "eagleHunterHorseback": "015cd31122095e7b4b4a3184f461b403b5c7c9f22da6a0454d6a2080681d37ad",
    },
    "site_hero": "heroYurts",
    "tours": {
        "grand-tour-of-kyrgyzstan": {
            "gallery": ["kelSuu", "issykKul", "songKol", "alpineLake", "altynArashan"],
        },
        "heart-of-kyrgyzstan": {
            "gallery": ["yurtsSunset", "kyzartHorses", "alpineLake", "yurtNight", "heroYurts"],
        },
        "song-kol-nomad-life": {
            "hero": "songKol",
            "gallery": ["songKol", "yurtNight", "kyzartHorses", "yurtsSunset", "kilemche"],
        },
        "kel-suu-expedition": {
            "gallery": ["kelSuu", "alpineLake", "yurtNight", "kilemche", "heroYurts"],
        },
        "song-kol-horseback": {
            "gallery": ["kyzartHorses", "kilemche", "songKol", "yurtsSunset", "yurtNight"],
        },
        "issyk-kul-and-jeti-oguz": {
            "gallery": [
                "issykKul",
                "skazkaCanyon",
                "jetiOguz",
                "barskoonWaterfall",
                "bishkekSunset",
            ],
        },
        "winter-eagle-hunters": {
            "gallery": [
                "eagleHunter",
                "eagleHunterHorseback",
                "issykKul",
                "alpineLake",
                "bishkekSunset",
            ],
        },
    },
    "destinations": {
        "song-kol": {
            "hero": "songKol",
            "gallery": ["songKol", "yurtsSunset", "yurtNight", "kyzartHorses"],
        },
        "kel-suu": {"gallery": ["kelSuu", "alpineLake", "kilemche", "heroYurts"]},
        "issyk-kul": {
            "gallery": ["issykKul", "skazkaCanyon", "bishkekSunset", "kyzartHorses"],
        },
        "jeti-oguz": {
            "gallery": ["jetiOguz", "skazkaCanyon", "kilemche", "altynArashan"],
        },
        "ala-kul-and-altyn-arashan": {
            "gallery": ["alpineLake", "kilemche", "altynArashan", "yurtNight"],
        },
    },
}


def load(apps, schema_editor):
    seeding.refresh_photos(apps=apps, previous=PREVIOUS)


class Migration(migrations.Migration):
    dependencies = [("catalog", "0005_fill_german_spanish")]

    operations = [migrations.RunPython(load, migrations.RunPython.noop)]
