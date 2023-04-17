# Steam Deck Gamepad Demo

This client/server demo shows how to send gamepad state messages using WebSockets, from a client running in the browser, to a server written in Python.

Currently the server runs on localhost on port 8001.

## Server

Run ```cd server && python app.py``` in a terminal.

## Client

Plug in a XBox compatible controller to your client PC.

Run ```cd client && python -m http.server``` in a terminal, then open ```localhost:8000``` your client's PC browser.

## Known limitations

On Steam OS's default browser (Firefox) the gamepad is NOT recognized, you  must use Chromium. To install it: 

```bash
sudo pacman -Syu
sudo pacman -S chromium
```