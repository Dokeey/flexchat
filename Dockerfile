FROM python:3.8.5


ADD    . /flex/backend
WORKDIR /flex/backend


ENV LANG en_US.utf8
ENV PYTHONIOENCODING UTF-8
#ENV DJANGO_SETTINGS_MODULE buynsell.settings.prod
ENV PYTHONUNBUFFERED 1

RUN    pip install --no-cache-dir -r requirements.txt

EXPOSE 80


CMD    daphne -b 0.0.0.0 -p $PORT backend.asgi:application
#CMD ["uwsgi", "--plugins", "http,python", \
#              "--http", "0.0.0.0:80", \
#              "--wsgi-file", "/bns/buynsell/wsgi.py", \
#              "--master", \
#              "--die-on-term", \
#              "--single-interpreter", \
#              "--harakiri", "30", \
#              "--reload-on-rss", "512", \
#              "--post-buffering-bufsize", "8192"]

