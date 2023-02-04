from django.urls import path
from api.views import users_views as views

urlpatterns = [
    path('', views.UserListCreateAPIViw.as_view()),
    path('<int:pk>/', views.UserDetailAPIViw.as_view()),
    path('update/<int:pk>/', views.UserUpdateAPIViw.as_view()),
    path('delete/<int:pk>/', views.UserDeleteAPIViw.as_view()),
]