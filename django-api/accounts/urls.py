from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from . import views

urlpatterns = [
    path("register/", views.RegisterView.as_view(), name="register"),
    path("login/", views.LoginView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("logout/", views.LogoutView.as_view(), name="logout"),
    path("me/", views.MeView.as_view(), name="me"),
    path("password/reset/", views.PasswordResetRequestView.as_view(), name="password_reset"),
    path("password/reset/confirm/", views.PasswordResetConfirmView.as_view(), name="password_reset_confirm"),
    path("google/", views.GoogleLoginView.as_view(), name="google_login"),
]
