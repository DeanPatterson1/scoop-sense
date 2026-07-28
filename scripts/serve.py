# Scoop Sense dev server — like `python -m http.server` but sends
# Cache-Control: no-store so the browser NEVER serves stale css/js/html.
# Run from the repo root:
#
#   python scripts/serve.py            # http://localhost:8743
#   python scripts/serve.py 9000       # custom port

import http.server
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8743


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Expires", "0")
        super().end_headers()


if __name__ == "__main__":
    http.server.test(HandlerClass=NoCacheHandler, port=PORT)
