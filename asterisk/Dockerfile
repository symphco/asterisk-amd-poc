FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y \
      build-essential wget libjack-jackd2-dev libssl-dev libxml2-dev uuid-dev \
    && cd /usr/src \
    && wget http://downloads.asterisk.org/pub/telephony/asterisk/asterisk-19-current.tar.gz \
    && tar xzf asterisk-19-current.tar.gz \
    && cd asterisk-19.* \
    && ./configure --with-jack \
    && make menuselect \
    && menuselect/menuselect --enable chan_jack menuselect.makeopts \
    && make && make install && make samples && make config \
    && rm -rf /usr/src/*

EXPOSE 5060/udp 5060 5038

CMD ["asterisk", "-f", "-U", "asterisk", "-G", "asterisk"]
