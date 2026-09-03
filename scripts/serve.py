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
    # HTTP/1.0 — the base class default — has no keep-alive, so the server
    # answers every request by closing the socket. On Windows a close while the
    # send buffer still holds the body arrives at the browser as an RST, and
    # data/products.js (654KB) is big enough to be caught mid-flight most
    # loads: the console showed ERR_CONNECTION_RESET, the server still logged
    # 200, and the page rendered its server-side tiles with no PRODUCTS behind
    # them — a dead page that looked like a CSS bug. 1.1 keeps the connection
    # open and frames the body by the Content-Length the handler already sends.
    protocol_version = "HTTP/1.1"

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Expires", "0")
        super().end_headers()


if __name__ == "__main__":
    # Keep-alive holds a connection open per tab, so a single-threaded server
    # would stall the moment the browser opened a second one.
    server = http.server.ThreadingHTTPServer(("", PORT), NoCacheHandler)
    server.daemon_threads = True
    print("Serving on http://localhost:%d/  (Ctrl-C to stop)" % PORT)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.server_close()
