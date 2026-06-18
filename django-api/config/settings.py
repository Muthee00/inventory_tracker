import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = os.environ.get("SECRET_KEY")
DEBUG = os.environ.get('DEBUG', '0') == '1'
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(',')
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "django_filters",
    "corsheaders",
    "inventory",
    "accounts",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"

CORS_ALLOW_ALL_ORIGINS = True

# if DEBUG:
#     DATABASES = {
#         "default": {
#             "ENGINE": "django.db.backends.sqlite3",
#             "NAME": BASE_DIR / "db.sqlite3",
#         }
#     }
# else:
#     DATABASES = {
#         "default": {
#             "ENGINE": "django.db.backends.mysql",
#             "NAME": os.getenv("DB_NAME", "inventrack"),
#             "USER": os.getenv("DB_USER", "root"),
#             "PASSWORD": os.getenv("DB_PASSWORD", ""),
#             "HOST": os.getenv("DB_HOST", "127.0.0.1"),
#             "PORT": os.getenv("DB_PORT", "3306"),
#             "OPTIONS": {
#                 "charset": "utf8mb4",
#                 "init_command": "SET sql_mode='STRICT_TRANS_TABLES'",
#             },
#         }
#     }

# if DEBUG:
#     DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.mysql',
#         'NAME': 'inventory_db',
#         'USER': 'root',
#         'PASSWORD': 'soft2025',
#         'HOST': 'localhost',
#         'PORT': '3306',
#     }
# }
# else:
#    DATABASES = {
#     "default": {
#         "ENGINE": "django.db.backends.mysql",
#         "NAME": "inventory_db",
#         "USER": "myappuser",
#         "PASSWORD": "StrongPassword",
#         "HOST": "mysql",   
#         "PORT": "3306",
#     }
# }

if DEBUG:
    DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": "inventory_db",
        "USER": "myappuser",
        "PASSWORD": "StrongPassword",
        "HOST": "mysql",   
        "PORT": "3306",
    }
    }	



REST_FRAMEWORK = {
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],
}

from datetime import timedelta
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=12),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=14),
    "AUTH_HEADER_TYPES": ("Bearer",),
}


# Frontend URL used in password reset links
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:8080")

# Google OAuth client id (used to verify ID tokens from the React app)
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")

# Email — console backend for dev. Configure SMTP for production.
EMAIL_BACKEND = os.getenv("EMAIL_BACKEND", "django.core.mail.backends.console.EmailBackend")
DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL", "no-reply@inventrack.local")

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True
STATIC_URL = "static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
