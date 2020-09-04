from django.urls import path

from . import views

urlpatterns = [
    path('match/<int:pk>/', views.ChatMatchView.as_view(), name='match'),
    path('group/<int:pk>/', views.GetGroupNameAndWaitersCountView.as_view(), name='group'),
    path('users_count/', views.GetAllUsersCountView.as_view(), name='users_count'),
]