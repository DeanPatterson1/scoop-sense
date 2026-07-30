/* Scoop Sense is static files — there is no server-side logic and this script
 * adds none. It exists because Cloudflare will not attach a custom domain to a
 * Worker that has only static assets: "Triggers cannot be added to a Worker
 * that only has static assets." Declaring a `main` entry makes the project a
 * normal Worker, which can hold the thescoopsense.com trigger.
 *
 * It costs nothing at runtime. With both `main` and `assets` configured,
 * Cloudflare serves a request that matches a file directly from the asset
 * store without invoking this script, so only paths matching no file reach
 * here — and those are handed straight back to the asset handler, which
 * answers with its own 404.
 */
export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  }
};
