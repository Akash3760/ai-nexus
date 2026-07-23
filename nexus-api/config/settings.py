"""
Django settings for AI Nexus.
Production-grade configuration.
"""

from pathlib import Path
import os
from dotenv import load_dotenv

# ==================================================
# BASE DIRECTORY
# ==================================================
BASE_DIR = Path(__file__).resolve().parent.parent

# ==================================================
# ENVIRONMENT VARIABLES
# ==================================================
load_dotenv(BASE_DIR / ".env")

# ==================================================
# SECURITY
# ==================================================
SECRET_KEY = os.getenv("SECRET_KEY")

DEBUG = os.getenv("DEBUG", "False") == "True"

ALLOWED_HOSTS = os.getenv(
    "ALLOWED_HOSTS",
    "127.0.0.1,localhost"
).split(",")

# ==================================================
# APPLICATIONS
# ==================================================
DJANGO_APPS = [
    "unfold",

    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

THIRD_PARTY_APPS = [
    "rest_framework",
    "corsheaders",
]

LOCAL_APPS = [
    "apps.accounts",
    "apps.workspace",
]

INSTALLED_APPS = (
    DJANGO_APPS
    + THIRD_PARTY_APPS
    + LOCAL_APPS
)

# ==================================================
# DJANGO UNFOLD SETTINGS
# ==================================================
UNFOLD = {
    "SITE_TITLE": "AI Nexus Admin",

    "SITE_HEADER": "AI Nexus",

    "SITE_SYMBOL": "hub",

    "SHOW_HISTORY": True,

    "SHOW_VIEW_ON_SITE": False,

    "SITE_DROPDOWN": [
        {
            "icon": "dashboard",
            "title": "Dashboard",
            "link": "/admin/",
        },
    ],

    "SIDEBAR": {
        "show_search": True,

        "show_all_applications": True,

        "navigation": [
            {
                "title": "Core",
                "separator": True,
                "items": [
                    {
                        "title": "Authentication",
                        "icon": "person",
                        "link": "/admin/auth/",
                    },
                    {
                        "title": "Users",
                        "icon": "group",
                        "link": "/admin/auth/user/",
                    },
                    {
                        "title": "Groups",
                        "icon": "admin_panel_settings",
                        "link": "/admin/auth/group/",
                    },
                ],
            },
        ],
    },

    "THEME": "dark",

    "LOGIN": {
        "image": None,
    },

    "STYLES": [
        lambda request: "css/admin.css",
    ],

    "COLORS": {
        "base": {
            "50": "250 250 250",
            "100": "245 245 245",
            "200": "229 229 229",
            "300": "212 212 212",
            "400": "163 163 163",
            "500": "115 115 115",
            "600": "82 82 82",
            "700": "64 64 64",
            "800": "38 38 38",
            "900": "23 23 23",
            "950": "10 10 10",
        },

        "primary": {
            "50": "240 249 255",
            "100": "224 242 254",
            "200": "186 230 253",
            "300": "125 211 252",
            "400": "56 189 248",
            "500": "14 165 233",
            "600": "2 132 199",
            "700": "3 105 161",
            "800": "7 89 133",
            "900": "12 74 110",
            "950": "8 47 73",
        },

        "font": {
            "subtle-light": "100 116 139",
            "subtle-dark": "148 163 184",
            "default-light": "15 23 42",
            "default-dark": "248 250 252",
            "important-light": "2 6 23",
            "important-dark": "255 255 255",
        },
    },
}

# ==================================================
# MIDDLEWARE
# ==================================================
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",

    "corsheaders.middleware.CorsMiddleware",

    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",

    "django.middleware.csrf.CsrfViewMiddleware",

    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",

    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# ==================================================
# URL CONFIG
# ==================================================
ROOT_URLCONF = "config.urls"

# ==================================================
# TEMPLATES
# ==================================================
TEMPLATES = [
    {
        "BACKEND":
        "django.template.backends.django.DjangoTemplates",

        "DIRS": [],

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

# ==================================================
# WSGI / ASGI
# ==================================================
WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

AUTH_USER_MODEL = 'accounts.User'

# ==================================================
# DATABASE (MYSQL)
# ==================================================
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": os.getenv("DB_NAME"),
        "USER": os.getenv("DB_USER"),
        "PASSWORD": os.getenv("DB_PASSWORD"),
        "HOST": os.getenv("DB_HOST", "localhost"),
        "PORT": os.getenv("DB_PORT", "3306"),
        "OPTIONS": {
            "charset": "utf8mb4",
        },
    }
}

# ==================================================
# REDIS CACHE
# ==================================================
REDIS_URL = os.getenv(
    "REDIS_URL",
    "redis://127.0.0.1:6379/1"
)

CACHES = {
    "default": {
        "BACKEND":
        "django_redis.cache.RedisCache",

        "LOCATION": REDIS_URL,

        "OPTIONS": {
            "CLIENT_CLASS":
            "django_redis.client.DefaultClient",
        }
    }
}

# ==================================================
# CELERY
# ==================================================
CELERY_BROKER_URL = os.getenv(
    "CELERY_BROKER_URL",
    "redis://127.0.0.1:6379/0"
)

CELERY_RESULT_BACKEND = os.getenv(
    "CELERY_RESULT_BACKEND",
    "redis://127.0.0.1:6379/0"
)

CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"

CELERY_TIMEZONE = "Asia/Kolkata"

CELERY_TASK_TRACK_STARTED = True
CELERY_TASK_TIME_LIMIT = 30 * 60

# ==================================================
# PASSWORD VALIDATION
# ==================================================
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME":
        "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME":
        "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME":
        "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME":
        "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# ==================================================
# DJANGO REST FRAMEWORK
# ==================================================
REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ],
}

# ==================================================
# CORS
# ==================================================
CORS_ALLOWED_ORIGINS = os.getenv(
    "CORS_ALLOWED_ORIGINS",
    "http://localhost:5173"
).split(",")

CORS_ALLOW_CREDENTIALS = True

# ==================================================
# INTERNATIONALIZATION
# ==================================================
LANGUAGE_CODE = "en-us"

TIME_ZONE = "Asia/Kolkata"

USE_I18N = True
USE_TZ = True

# ==================================================
# STATIC FILES
# ==================================================
STATIC_URL = "static/"

STATIC_ROOT = BASE_DIR / "staticfiles"

STATICFILES_DIRS = [
    BASE_DIR / "static",
]

# ==================================================
# MEDIA FILES
# ==================================================
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# ==================================================
# DEFAULT PRIMARY KEY
# ==================================================
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ==================================================
# SECURITY SETTINGS
# ==================================================
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = True

X_FRAME_OPTIONS = "DENY"

SECURE_CONTENT_TYPE_NOSNIFF = True

SECURE_BROWSER_XSS_FILTER = True

# ==================================================
# LOGGING (COLOR LOGGER)
# ==================================================
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,

    "formatters": {
        "verbose": {
            "format":
            "[{asctime}] [{levelname}] "
            "{name} : {message}",
            "style": "{",
        },

        "simple": {
            "format":
            "{levelname} | {message}",
            "style": "{",
        },
    },

    "handlers": {
        "console": {
            "class":
            "logging.StreamHandler",

            "formatter":
            "verbose",
        },
    },

    "root": {
        "handlers": ["console"],
        "level": "INFO",
    },

    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },
    },
}