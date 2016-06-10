FROM coreos/apache
MAINTAINER cory.a.johannsen@gmail.com
COPY app /var/www/

CMD ["/usr/sbin/apache2ctl", "-D FOREGROUND"]