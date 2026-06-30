import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = os.environ.get("SECRET_KEY")
DEBUG = os.getenv("DEBUG", "False").lower() == "true"
ALLOWED_HOSTS = [
    "localhost",
    "127.0.0.1",
    "backend",
    "inventory-app-backend-1",
    "213.199.60.37",
    "www.hilift.xyz",
    "inventory-app-nginx-1"
]

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

if DEBUG:
    CORS_ALLOW_ALL_ORIGINS = True
else:
    CORS_ALLOWED_ORIGINS = [
        "http://213.199.60.37",
        "https://www.hilift.xyz",
        "https://hilift.xyz",
    ]

Run cd django-api
Creating test database for alias 'default'...
/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/db/backends/postgresql/base.py:513: RuntimeWarning: Normally Django will use a connection to the 'postgres' database to avoid running initialization queries against the production database when it's not needed (for example, when running tests). Django was unable to create a connection to the 'postgres' database and will use the first PostgreSQL database instead.
 warnings.warn(
Traceback (most recent call last):
Found 3 test(s).
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/db/backends/base/base.py", line 279, in ensure_connection
 self.connect()
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/utils/asyncio.py", line 26, in inner
 return func(*args, **kwargs)
 ^^^^^^^^^^^^^^^^^^^^^
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/db/backends/base/base.py", line 256, in connect
 self.connection = self.get_new_connection(conn_params)
 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/utils/asyncio.py", line 26, in inner
 return func(*args, **kwargs)
 ^^^^^^^^^^^^^^^^^^^^^
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/db/backends/postgresql/base.py", line 333, in get_new_connection
 connection = self.Database.connect(**conn_params)
 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/psycopg2/**init**.py", line 122, in connect
 conn = _connect(dsn, connection_factory=connection_factory, **kwasync)
 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
psycopg2.OperationalError: could not translate host name "postgres" to address: Temporary failure in name resolution
The above exception was the direct cause of the following exception:
Traceback (most recent call last):
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/db/backends/postgresql/base.py", line 508, in _nodb_cursor
 with super()._nodb_cursor() as cursor:
 ^^^^^^^^^^^^^^^^^^^^^^
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/contextlib.py", line 137, in **enter**
 return next(self.gen)
 ^^^^^^^^^^^^^^
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/db/backends/base/base.py", line 712, in _nodb_cursor
 with conn.cursor() as cursor:
 ^^^^^^^^^^^^^
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/utils/asyncio.py", line 26, in inner
 return func(*args, **kwargs)
 ^^^^^^^^^^^^^^^^^^^^^
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/db/backends/base/base.py", line 320, in cursor
 return self._cursor()
 ^^^^^^^^^^^^^^
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/db/backends/base/base.py", line 296, in _cursor
 self.ensure_connection()
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/utils/asyncio.py", line 26, in inner
 return func(*args, **kwargs)
 ^^^^^^^^^^^^^^^^^^^^^
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/db/backends/base/base.py", line 278, in ensure_connection
 with self.wrap_database_errors:
 ^^^^^^^^^^^^^^^^^^^^^^^^^
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/db/utils.py", line 94, in **exit**
 raise dj_exc_value.with_traceback(traceback) from exc_value
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/db/backends/base/base.py", line 279, in ensure_connection
 self.connect()
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/utils/asyncio.py", line 26, in inner
 return func(*args, **kwargs)
 ^^^^^^^^^^^^^^^^^^^^^
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/db/backends/base/base.py", line 256, in connect
 self.connection = self.get_new_connection(conn_params)
 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/utils/asyncio.py", line 26, in inner
 return func(*args, **kwargs)
 ^^^^^^^^^^^^^^^^^^^^^
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/db/backends/postgresql/base.py", line 333, in get_new_connection
 connection = self.Database.connect(**conn_params)
 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/psycopg2/**init**.py", line 122, in connect
 conn = _connect(dsn, connection_factory=connection_factory, **kwasync)
 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
django.db.utils.OperationalError: could not translate host name "postgres" to address: Temporary failure in name resolution
During handling of the above exception, another exception occurred:
Traceback (most recent call last):
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/db/backends/base/base.py", line 279, in ensure_connection
 self.connect()
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/utils/asyncio.py", line 26, in inner
 return func(*args, **kwargs)
 ^^^^^^^^^^^^^^^^^^^^^
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/db/backends/base/base.py", line 256, in connect
 self.connection = self.get_new_connection(conn_params)
 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/utils/asyncio.py", line 26, in inner
 return func(*args, **kwargs)
 ^^^^^^^^^^^^^^^^^^^^^
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/db/backends/postgresql/base.py", line 333, in get_new_connection
 connection = self.Database.connect(**conn_params)
 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/psycopg2/**init**.py", line 122, in connect
 conn = _connect(dsn, connection_factory=connection_factory, **kwasync)
 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
psycopg2.OperationalError: could not translate host name "postgres" to address: Temporary failure in name resolution
The above exception was the direct cause of the following exception:
Traceback (most recent call last):
 File "/home/runner/work/inventory_tracker/inventory_tracker/django-api/manage.py", line 14, in <module>
 main()
 File "/home/runner/work/inventory_tracker/inventory_tracker/django-api/manage.py", line 11, in main
 execute_from_command_line(sys.argv)
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/core/management/**init**.py", line 443, in execute_from_command_line
 utility.execute()
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/core/management/**init**.py", line 437, in execute
 self.fetch_command(subcommand).run_from_argv(self.argv)
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/core/management/commands/test.py", line 24, in run_from_argv
 super().run_from_argv(argv)
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/core/management/base.py", line 420, in run_from_argv
 self.execute(*args, **cmd_options)
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/core/management/base.py", line 464, in execute
 output = self.handle(*args, **options)
 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/core/management/commands/test.py", line 63, in handle
 failures = test_runner.run_tests(test_labels)
 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/test/runner.py", line 1127, in run_tests
 old_config = self.setup_databases(
 ^^^^^^^^^^^^^^^^^^^^^
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/test/runner.py", line 1026, in setup_databases
 return _setup_databases(
 ^^^^^^^^^^^^^^^^^
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/test/utils.py", line 207, in setup_databases
 connection.creation.create_test_db(
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/db/backends/base/creation.py", line 69, in create_test_db
 self._create_test_db(verbosity, autoclobber, keepdb)
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/db/backends/base/creation.py", line 221, in _create_test_db
 with self._nodb_cursor() as cursor:
 ^^^^^^^^^^^^^^^^^^^
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/contextlib.py", line 137, in **enter**
 return next(self.gen)
 ^^^^^^^^^^^^^^
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/db/backends/postgresql/base.py", line 534, in _nodb_cursor
 with conn.cursor() as cursor:
 ^^^^^^^^^^^^^
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/utils/asyncio.py", line 26, in inner
 return func(*args, **kwargs)
 ^^^^^^^^^^^^^^^^^^^^^
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/db/backends/base/base.py", line 320, in cursor
 return self._cursor()
 ^^^^^^^^^^^^^^
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/db/backends/base/base.py", line 296, in _cursor
 self.ensure_connection()
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/utils/asyncio.py", line 26, in inner
 return func(*args, **kwargs)
 ^^^^^^^^^^^^^^^^^^^^^
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/db/backends/base/base.py", line 278, in ensure_connection
 with self.wrap_database_errors:
 ^^^^^^^^^^^^^^^^^^^^^^^^^
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/db/utils.py", line 94, in **exit**
 raise dj_exc_value.with_traceback(traceback) from exc_value
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/db/backends/base/base.py", line 279, in ensure_connection
 self.connect()
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/utils/asyncio.py", line 26, in inner
 return func(*args, **kwargs)
 ^^^^^^^^^^^^^^^^^^^^^
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/db/backends/base/base.py", line 256, in connect
 self.connection = self.get_new_connection(conn_params)
 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/utils/asyncio.py", line 26, in inner
 return func(*args, **kwargs)
 ^^^^^^^^^^^^^^^^^^^^^
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/django/db/backends/postgresql/base.py", line 333, in get_new_connection
 connection = self.Database.connect(**conn_params)
 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 File "/opt/hostedtoolcache/Python/3.12.13/x64/lib/python3.12/site-packages/psycopg2/**init**.py", line 122, in connect
 conn = _connect(dsn, connection_factory=connection_factory, **kwasync)
 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
django.db.utils.OperationalError: could not translate host name "postgres" to address: Temporary failure in name resolution

The error is a classic database connection issue in Django tests with PostgreSQL.
Root Cause

Your DATABASES setting (likely in settings.py or settings_test.py) is configured with:

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': '...',
        'USER': '...',
        'PASSWORD': '...',
        'HOST': 'postgres',   # ← This is the problem here
        'PORT': '5432',
    }
}

The hostname "postgres" only resolves inside a Docker network where there's a service/container named postgres. In GitHub Actions (or plain local runs without Docker), name resolution fails.
Quick Fix for GitHub Actions (Recommended)

Create or update your workflow file (e.g. .github/workflows/test.yml):

name: Django Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt  # or poetry/pipenv equivalent

      - name: Run tests
        env:
          DATABASE_URL: postgres://postgres:postgres@localhost:5432/test_db  # optional
          # Or set individual vars:
          # DJANGO_DB_HOST: localhost
          # DJANGO_DB_NAME: test_db
          # etc.
        run: |
          cd django-api
          python manage.py test

Key points:

    The services.postgres block starts a real Postgres container.
    GitHub maps it to localhost:5432 on the runner.
    Update your Django settings (or use environment variables) to connect to HOST: "localhost" (or 127.0.0.1) during tests.

Make Django Settings Environment-Aware

Best practice is to make your settings flexible:

# settings.py (or base.py)
import os

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('POSTGRES_DB', 'postgres'),
        'USER': os.getenv('POSTGRES_USER', 'postgres'),
        'PASSWORD': os.getenv('POSTGRES_PASSWORD', 'postgres'),
        'HOST': os.getenv('POSTGRES_HOST', 'localhost'),   # default to localhost for CI/local
        'PORT': os.getenv('POSTGRES_PORT', '5432'),
    }
}

Then in GitHub Actions, pass the variables via env:.

For local Docker development, you can override with POSTGRES_HOST=postgres.
Alternative: Use SQLite for Tests (Fastest)

If you don't need full Postgres features in tests:

# In manage.py or test settings
if 'test' in sys.argv:
    DATABASES['default'] = {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
    }

Or use Django's TEST dict to override.
Other Common Fixes

    Docker Compose — Make sure the test command runs inside the Django service:

    docker-compose run --rm django python manage.py test

    Wait for DB — Add a wait script or use pg_isready in entrypoint.
    Test Database Name — The warning mentions it tries to connect to the postgres maintenance DB first. That's normal.

Would you like me to help you:

    Fix your specific settings.py?
    Create a full GitHub Actions workflow?
    Set up docker-compose for local + CI consistency?

Just share the relevant parts of your settings.py and .github/workflows/ if you have them.
16 sources

services:
  postgres:
    image: postgres:16
    restart: always
    environment:
      POSTGRES_DB: inventory
      POSTGRES_USER: invent_admin
      POSTGRES_PASSWORD: soft2025
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U invent_admin -d inventory"]
      interval: 10s
      timeout: 5s
      retries: 5
  backend:
    image: ${DOCKER_USERNAME}/inventory-app-backend:latest
    restart: always
    env_file:
      - .env
    depends_on:
      postgres:
        condition: service_healthy
  nginx:
    image: ${DOCKER_USERNAME}/inventory-app-frontend:latest
    restart: always
    ports:
      - "80:80"
    depends_on:
      - backend
volumes:
  postgres_data:

Got it. Your docker-compose.yml is correctly set up for local development (Postgres service named postgres, custom user/password/db, healthcheck, etc.).

The error happens because your CI (GitHub Actions) is not using Docker Compose — it's running the tests directly on the runner, where the hostname postgres doesn't exist.
Recommended Solution: Update GitHub Actions Workflow

Create/update .github/workflows/ci.yml:

name: Django CI

on:
  push:
    branches: [ main, master, develop ]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: inventory
          POSTGRES_USER: invent_admin
          POSTGRES_PASSWORD: soft2025
        ports:
          - 5432:5432
        options: >-
          --health-cmd "pg_isready -U invent_admin -d inventory"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'

      - name: Install dependencies
        working-directory: ./django-api
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt   # adjust if you use poetry/pipenv

      - name: Run Django tests
        working-directory: ./django-api
        env:
          POSTGRES_HOST: localhost
          POSTGRES_DB: inventory
          POSTGRES_USER: invent_admin
          POSTGRES_PASSWORD: soft2025
          # Add other env vars from your .env if needed
        run: |
          python manage.py test --settings=your_project.settings_test  # or just python manage.py test

Update Your Django Settings (Important)

Make sure your settings support both local Docker and CI:

# django-api/your_project/settings.py (or base.py)

import os

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('POSTGRES_DB', 'inventory'),
        'USER': os.environ.get('POSTGRES_USER', 'invent_admin'),
        'PASSWORD': os.environ.get('POSTGRES_PASSWORD', 'soft2025'),
        'HOST': os.environ.get('POSTGRES_HOST', 'postgres'),   # Docker default
        'PORT': os.environ.get('POSTGRES_PORT', '5432'),
    }
}

For tests specifically, you can create settings_test.py that forces HOST: 'localhost', or override via environment variables in CI (as shown above).
Alternative: Run Tests via Docker Compose in CI

If you prefer to keep everything in Docker:

- name: Run tests with Docker Compose
        run: |
          docker compose -f docker-compose.yml run --rm backend python manage.py test

But the service container approach (first example) is faster and more common for Django CI.

Would you like me to:

    Help you create the full workflow file?
    Show how to create a settings_test.py?
    Adjust for environment variables from .env?

Paste your current settings.py (DATABASES section) or the full workflow if you have one, and I’ll give you the exact patch.

if DEBUG:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }
else:
    DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("DB_NAME", "inventory_db"),
        "USER": os.getenv("DB_USER", "postgres"),
        "PASSWORD": os.getenv("DB_PASSWORD", ""),
        "HOST": os.getenv("DB_HOST", "localhost"),
        "PORT": os.getenv("DB_PORT", "5432"),
    }
}
 
.env
DJANGO_SECRET_KEY=your-secret-key-here
DB_NAME=inventory
DB_USER=invent_admin
DB_PASSWORD=soft2025
DB_HOST=postgres
DB_PORT=5432

# Frontend URL for password reset emails

FRONTEND_URL=http://localhost:8080

# Google OAuth (from https://console.cloud.google.com/apis/credentials)

GOOGLE_CLIENT_ID=
SECRET_KEY=$**bor£0f*t0frwz13fk&(257x*+4(jv5_1_712&a=n&i)a037
DEBUG=False

Perfect, now I see the exact issue.

Your settings switch based on DEBUG. When running tests in CI (and usually in Docker too), DEBUG=False, so it uses PostgreSQL with values from the .env file — where DB_HOST=postgres.

In GitHub Actions there is no .env file loaded automatically, and the host postgres doesn't exist.
Fix 1: Update Your Settings (Best Long-term Fix)

Replace your current DATABASES block with this improved version:

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent



if DEBUG:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": os.getenv("DB_NAME", "inventory"),
            "USER": os.getenv("DB_USER", "invent_admin"),
            "PASSWORD": os.getenv("DB_PASSWORD", "soft2025"),
            "HOST": os.getenv("DB_HOST", "localhost"),      # Changed default to localhost
            "PORT": os.getenv("DB_PORT", "5432"),
        }
    }


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
