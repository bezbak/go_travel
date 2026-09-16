import os
import re

from django.conf import settings
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic import RedirectView
from django.views.static import serve

urlpatterns = [
    path("", RedirectView.as_view(url="/admin/", permanent=False)),
    path("admin/", admin.site.urls),
    path("api/", include("catalog.urls")),
]


def _file_routes():
    """
    Routes for `media/` and `staticfiles/`.

    `django.conf.urls.static.static()` is a no-op once DEBUG is off, which is
    correct when nginx sits in front. On a deployment without a web server —
    gunicorn behind pm2, say — nothing would serve the photos at all, so
    DJANGO_SERVE_FILES=1 turns these routes back on. nginx is still faster and
    should be preferred wherever it is available.
    """
    routes = []
    for url, root in (
        (settings.MEDIA_URL, settings.MEDIA_ROOT),
        (settings.STATIC_URL, settings.STATIC_ROOT),
    ):
        prefix = re.escape(str(url).lstrip("/"))
        routes.append(
            re_path(rf"^{prefix}(?P<path>.*)$", serve, {"document_root": root})
        )
    return routes


if settings.DEBUG or os.environ.get("DJANGO_SERVE_FILES") == "1":
    urlpatterns += _file_routes()
