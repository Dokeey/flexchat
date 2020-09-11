from django.urls import path

from . import views

urlpatterns = [
    path('match/<int:pk>/', views.ChatMatchView.as_view(), name='match'),
]