FROM debian:bookworm-slim
ENV TERM xterm

 RUN apt-get update && apt-get install -y \
      build-essential wget libjack-jackd2-dev libssl-dev libxml2-dev uuid-dev libedit-dev libjansson-dev libsqlite3-dev libncurses5-dev libncursesw5-dev pkg-config ncurses-term \
    && cd /usr/src \
    && wget https://downloads.asterisk.org/pub/telephony/asterisk/asterisk-22-current.tar.gz \
    && tar xzf asterisk-22-current.tar.gz \
    && cd asterisk-22.* \
    && ./configure --with-jack \
    && make menuselect \
    && menuselect/cmenuselect --enable app_jack menuselect.makeopts \
    && make && make install && make samples && make config \
    # Create asterisk system user and group, set directory permissions
    && groupadd -r asterisk \
    && useradd -r -g asterisk -d /var/lib/asterisk -s /usr/sbin/nologin asterisk \
    && mkdir -p /var/lib/asterisk/agi-bin /var/spool/asterisk /var/run/asterisk /var/log/asterisk \
    && chown -R asterisk:asterisk /var/lib/asterisk /var/spool/asterisk /var/run/asterisk /var/log/asterisk \
    && rm -rf /usr/src/*

EXPOSE 5060/udp 5060 5038

CMD ["asterisk", "-f", "-U", "asterisk", "-G", "asterisk"]
