from django.urls import path

from . import api

app_name = "catalog"

urlpatterns = [
    path("tours/", api.tour_list, name="tour-list"),
    path("tours/<slug:slug>/", api.tour_detail, name="tour-detail"),
    path("destinations/", api.destination_list, name="destination-list"),
    path("destinations/<slug:slug>/", api.destination_detail, name="destination-detail"),
    path("photos/", api.photo_library, name="photo-library"),
    path("site/", api.site_content, name="site-content"),
    path("inquiries/", api.create_inquiry, name="inquiry-create"),
]
