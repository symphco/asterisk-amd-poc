# Asterisk Web Dialer with JACK

This project provides a Docker Compose setup for:

- Asterisk built with JACK audio support (chan_jack)
- A Node.js Web UI to dial numbers via Asterisk AMI
- Exposes JACK audio ports for call audio monitoring

## Prerequisites

- Linux host with JACK server running (e.g., jackd, QJackCtl)
- Docker & Docker Compose

## Configuration

1. Edit SIP provider credentials in asterisk/config/sip.conf.
2. Update AMI credentials in asterisk/config/manager.conf and web/src/index.js (via environment variables).

## Usage

1. Start services:

   # Bring up both Asterisk (with JACK) and the Web UI
   docker-compose up --build

   # Or in detached mode:
   docker-compose up -d --build

   # For local Linux testing, Asterisk uses host networking
   # SIP (5060) and RTP ports (10000-10100) are bound directly on the host
   # Ensure no other service is using UDP 5060 or your RTP range

2. Access Web UI at http://localhost:3000.
3. (Optional) Test AMI connectivity:
   - **Via HTTP**: curl:
     ```bash
     curl http://localhost:3000/health
     ```
     You should get `{ success: true, amiResponse: ... }`.
   - **Via Web UI**: click the **Check AMI Health** button on the page and look for the `Health response:` log in your browser console.
4. Enter a phone number and click Call.
5. Use a JACK client (e.g., QJackCtl, Carla) to connect to the 'asterisk' JACK port to listen to call audio.
