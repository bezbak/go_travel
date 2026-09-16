"""
Django settings for the Go Kyrgyzstan backend.

Values that differ per environment are read from the process environment with
development-friendly defaults, so `python manage.py runserver` works from a
fresh clone with no .env file.
"""

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent


def env_list(name, default):
    raw = os.environ.get(name)
    return [item.strip() for item in raw.split(",") if item.strip()] if raw else default


SECRET_KEY = os.environ.get(
    "DJANGO_SECRET_KEY",
    "django-insecure-yz-it11c2dot(9s6%h+sa91)ah**%wc69cki7k#p%&oihzi7n%",
)

DEBUG = os.environ.get("DJANGO_DEBUG", "1") == "1"

ALLOWED_HOSTS = env_list("DJANGO_ALLOWED_HOSTS", ["back.go-kyrgyzstan.com","127.0.0.1","go-kyrgyzstan.com"])

INSTALLED_APPS = [
    # Must precede django.contrib.admin so Jazzmin can override its templates.
    "jazzmin",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "catalog",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.locale.LocaleMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = os.environ.get("DJANGO_LANGUAGE_CODE", "ru")
TIME_ZONE = "Asia/Bishkek"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_DIRS = [BASE_DIR / "static"]

MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

LOGIN_URL = "/admin/login/"
LOGIN_REDIRECT_URL = "/admin/"
LOGOUT_REDIRECT_URL = "/admin/login/"

# The Next.js site runs on 3000 in development.
CORS_ALLOWED_ORIGINS = env_list(
    "DJANGO_CORS_ORIGINS", ["http://localhost:3000", "http://127.0.0.1:3000"]
)

CSRF_TRUSTED_ORIGINS = env_list("DJANGO_CSRF_TRUSTED_ORIGINS", [])

REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.AllowAny"],
    "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],
}

MAILERS = {
    "default": {"BACKEND": "django.core.mail.backends.console.EmailBackend"},
}

# --------------------------------------------------------------------------
# Jazzmin admin
# --------------------------------------------------------------------------

JAZZMIN_SETTINGS = {
    "site_title": "Go Kyrgyzstan",
    "site_header": "Go Kyrgyzstan",
    "site_brand": "Go Kyrgyzstan",
    "site_logo": "catalog/img/logo.svg",
    "login_logo": "catalog/img/logo.svg",
    "site_logo_classes": "img-circle elevation-0",
    "site_icon": "catalog/img/favicon.svg",
    "welcome_sign": "Go Kyrgyzstan — панель управления",
    "copyright": "Go Kyrgyzstan",
    "search_model": ["catalog.Tour", "catalog.Destination", "catalog.Photo"],
    "user_avatar": None,
    "topmenu_links": [
        {"name": "Панель", "url": "admin:index", "permissions": ["auth.view_user"]},
        {"name": "Открыть сайт", "url": "http://localhost:3000", "new_window": True},
        {"model": "auth.User"},
    ],
    "usermenu_links": [{"model": "auth.user"}],
    "show_sidebar": True,
    "navigation_expanded": True,
    "hide_apps": [],
    "hide_models": [],
    "order_with_respect_to": [
        "catalog",
        "catalog.Tour",
        "catalog.Destination",
        "catalog.Photo",
        "catalog.GalleryPhoto",
        "catalog.Testimonial",
        "catalog.TeamMember",
        "catalog.FaqItem",
        "catalog.Inquiry",
        "catalog.SiteSettings",
        "auth",
    ],
    "icons": {
        "auth": "fas fa-users-cog",
        "auth.user": "fas fa-user",
        "auth.Group": "fas fa-users",
        "catalog.Tour": "fas fa-route",
        "catalog.Destination": "fas fa-mountain-sun",
        "catalog.Photo": "fas fa-images",
        "catalog.GalleryPhoto": "fas fa-panorama",
        "catalog.Testimonial": "fas fa-quote-left",
        "catalog.TeamMember": "fas fa-user-tie",
        "catalog.FaqItem": "fas fa-circle-question",
        "catalog.Inquiry": "fas fa-envelope-open-text",
        "catalog.SiteSettings": "fas fa-sliders",
    },
    "default_icon_parents": "fas fa-chevron-circle-right",
    "default_icon_children": "fas fa-circle",
    "related_modal_active": True,
    "custom_css": "catalog/css/admin.css",
    "custom_js": "catalog/js/gallery.js",
    "use_google_fonts_cdn": True,
    "show_ui_builder": False,
    "changeform_format": "horizontal_tabs",
    "changeform_format_overrides": {
        "catalog.SiteSettings": "vertical_tabs",
        "auth.user": "collapsible",
        "auth.group": "vertical_tabs",
    },
    "language_chooser": False,
}

JAZZMIN_UI_TWEAKS = {
    "navbar_small_text": False,
    "footer_small_text": False,
    "body_small_text": False,
    "brand_small_text": False,
    "brand_colour": "navbar-white",
    "accent": "accent-olive",
    "navbar": "navbar-white navbar-light",
    "no_navbar_border": True,
    "navbar_fixed": True,
    "layout_boxed": False,
    "footer_fixed": False,
    "sidebar_fixed": True,
    "sidebar": "sidebar-dark-olive",
    "sidebar_nav_small_text": False,
    "sidebar_disable_expand": False,
    "sidebar_nav_child_indent": True,
    "sidebar_nav_compact_style": False,
    "sidebar_nav_legacy_style": False,
    "sidebar_nav_flat_style": False,
    "theme": "flatly",
    "default_theme_mode": "light",
    "button_classes": {
        "primary": "btn-primary",
        "secondary": "btn-secondary",
        "info": "btn-info",
        "warning": "btn-warning",
        "danger": "btn-danger",
        "success": "btn-success",
    },
    "actions_sticky_top": True,
}
