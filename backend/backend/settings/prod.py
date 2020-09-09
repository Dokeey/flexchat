from .commom import *

DEBUG = False
ALLOWED_HOSTS = ['*']

# MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')

# STATICFILES_STORAGE = 'whitenoise.storage.CompressedStaticFilesStorage'

# import dj_database_url
# db_from_env = dj_database_url.config()
# DATABASES['default'].update(db_from_env)
# DATABASES['default']['CONN_MAX_AGE'] = 500