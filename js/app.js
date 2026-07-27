/* Scoop Sense — filtering, sorting, and card rendering.
 *
 * Loads AFTER data/products.js on every scripted page. Reads the globals
 * PRODUCTS and FEATURED_IDS; defines nothing else on window.
 *
 * The same card renderer feeds both the homepage teasers and the hub grid.
 * Cards render COMPACT by default; full details (ingredients, cautions,
 * flavors, blurb, extra badges) live in an expandable panel per card.
 */

(function () {
  "use strict";

  var state = {
    search: "",
    caffeine: "all",
    stimFreeOnly: false,
    sort: "name"
  };

  var STIM_BADGES = ["Stim-Free", "Low Stim", "Moderate Stim", "High Stim"];
  var DEFAULT_ACCENT = "#C6FF33";

  /* ---------------------------------------------------------------------
   * Helpers
   * ------------------------------------------------------------------- */

  // Caffeine bucket for a product: matches the hub's data-bucket values.
  function bucketOf(p) {
    if (p.caffeineMg === 0) return "none";
    if (p.caffeineMg < 150) return "low";
    if (p.caffeineMg < 250) return "moderate";
    return "high";
  }

  // Escape a value for safe interpolation into card markup.
  function esc(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Badge text -> chip variant class.
  function chipClassFor(badge) {
    if (badge === "Stim-Free") return "sc-chip sc-chip-stimfree";
    if (badge === "High Stim") return "sc-chip sc-chip-highstim";
    return "sc-chip sc-chip-neutral";
  }

  // Split badges into the one stim-tier badge (shown on the compact face)
  // and the extras (shown inside the details panel).
  function splitBadges(p) {
    var stim = null;
    var extras = [];
    for (var i = 0; i < p.badges.length; i++) {
      if (stim === null && STIM_BADGES.indexOf(p.badges[i]) !== -1) {
        stim = p.badges[i];
      } else {
        extras.push(p.badges[i]);
      }
    }
    return { stim: stim || "", extras: extras };
  }

  // Search matches product name, brand, or any key ingredient name.
  function matchesSearch(p, term) {
    if (!term) return true;
    var haystack = [p.name, p.brand]
      .concat(p.keyIngredients.map(function (ing) { return ing.name; }))
      .join(" ")
      .toLowerCase();
    return haystack.indexOf(term) !== -1;
  }

  function applyFilters() {
    var term = state.search.trim().toLowerCase();

    var results = PRODUCTS.filter(function (p) {
      if (!matchesSearch(p, term)) return false;
      if (state.caffeine !== "all" && bucketOf(p) !== state.caffeine) return false;
      if (state.stimFreeOnly && p.stimFree !== true) return false;
      return true;
    });

    results.sort(function (a, b) {
      if (state.sort === "caffeine-asc") return a.caffeineMg - b.caffeineMg;
      if (state.sort === "caffeine-desc") return b.caffeineMg - a.caffeineMg;
      return a.name.localeCompare(b.name) || a.brand.localeCompare(b.brand);
    });

    return results;
  }

  /* ---------------------------------------------------------------------
   * Card markup — identical for the hub grid and the homepage teasers.
   * All product fields are escaped before interpolation.
   *
   * Compact face: tub visual, brand, name, stim chip, caffeine stat,
   * servings/price meta, buy CTA + affiliate note, details toggle.
   * Details panel: blurb, ingredients, cautions, flavors, extra badges.
   *
   * .sc-card-visual is the future image slot: when a product gains an
   * optional imageUrl (Amazon PA-API, later), swap the .sc-tub markup for
   * an <img> inside the same container — no other card changes needed.
   * ------------------------------------------------------------------- */

  function cardHTML(p) {
    var badges = splitBadges(p);
    var accent = p.accentColor || DEFAULT_ACCENT;
    var initial = String(p.brand || "?").charAt(0).toUpperCase();
    var detailsId = "sc-details-" + p.id;

    var stimChip = badges.stim
      ? '<span class="' + chipClassFor(badges.stim) + '">' + esc(badges.stim) + "</span>"
      : "";

    var stat = p.stimFree
      ? '<span class="sc-stat-num sc-stat-zero">Stim-Free</span>' +
        '<span class="sc-stat-label">0 mg caffeine</span>'
      : '<span class="sc-stat-num">' + esc(p.caffeineMg) +
        '<span class="sc-stat-unit">mg</span></span>' +
        '<span class="sc-stat-label">caffeine per serving</span>';

    var extraBadges = badges.extras.map(function (badge) {
      return '<span class="' + chipClassFor(badge) + '">' + esc(badge) + "</span>";
    }).join("");

    var ingredients = p.keyIngredients.map(function (ing) {
      return "<li><strong>" + esc(ing.name) + " — " + esc(ing.dose) + ".</strong> " +
        '<span class="sc-note">' + esc(ing.clinicalNote) + "</span></li>";
    }).join("");

    var cautions = p.cautions.map(function (caution) {
      return '<span class="sc-chip sc-chip-caution">' + esc(caution) + "</span>";
    }).join("");

    return '<article class="sc-card" style="--sc-accent:' + esc(accent) + '">' +
      '<div class="sc-card-top">' +
        '<div class="sc-card-visual" aria-hidden="true">' +
          '<span class="sc-tub"><span class="sc-tub-initial">' + esc(initial) + "</span></span>" +
        "</div>" +
        '<div class="sc-card-id">' +
          '<p class="sc-card-brand">' + esc(p.brand) + "</p>" +
          '<h3 class="sc-card-name">' + esc(p.name) + "</h3>" +
          stimChip +
        "</div>" +
      "</div>" +
      '<p class="sc-card-stat">' + stat + "</p>" +
      '<p class="sc-card-meta">' + esc(p.servings) + " servings · " + esc(p.priceRange) + "</p>" +
      '<div class="sc-card-cta">' +
        '<a class="sc-btn sc-btn-buy" href="' + esc(p.affiliateUrl) + '" target="_blank" ' +
        'rel="sponsored nofollow noopener">Check price on Amazon</a>' +
        '<p class="sc-affiliate-note">Affiliate link — we may earn a commission.</p>' +
      "</div>" +
      '<button type="button" class="sc-details-toggle" aria-expanded="false" ' +
        'aria-controls="' + esc(detailsId) + '" aria-label="Details for ' + esc(p.name) + '">' +
        '<span class="sc-toggle-label">Details</span>' +
        '<span class="sc-toggle-chevron" aria-hidden="true"></span>' +
      "</button>" +
      '<div class="sc-card-details" id="' + esc(detailsId) + '">' +
        '<div class="sc-card-details-inner">' +
          '<p class="sc-card-blurb">' + esc(p.blurb) + "</p>" +
          '<p class="sc-details-heading">Key ingredients</p>' +
          '<ul class="sc-card-ingredients">' + ingredients + "</ul>" +
          '<p class="sc-details-heading">Worth knowing</p>' +
          '<div class="sc-card-cautions">' + cautions + "</div>" +
          '<p class="sc-card-flavors">' + esc(p.flavorsNote) + "</p>" +
          (extraBadges ? '<div class="sc-card-badges">' + extraBadges + "</div>" : "") +
        "</div>" +
      "</div>" +
    "</article>";
  }

  /* ---------------------------------------------------------------------
   * Scroll reveal — IntersectionObserver adds .sc-visible with a small
   * per-batch stagger. Re-run after EVERY render (this also serves as the
   * filter-change transition: fresh results fade + rise in).
   * ------------------------------------------------------------------- */

  var revealObserver = null;

  function revealNow(cards) {
    for (var i = 0; i < cards.length; i++) {
      cards[i].classList.add("sc-visible");
    }
  }

  function setupReveal(container) {
    var cards = container.querySelectorAll(".sc-card");

    if (revealObserver) {
      revealObserver.disconnect();
      revealObserver = null;
    }

    var reducedMotion = !!(window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    if (reducedMotion || !("IntersectionObserver" in window)) {
      revealNow(cards);
      return;
    }

    revealObserver = new IntersectionObserver(function (entries) {
      var batch = [];
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) batch.push(entries[i].target);
      }
      for (var j = 0; j < batch.length; j++) {
        (function (card, delay) {
          revealObserver.unobserve(card);
          window.setTimeout(function () {
            card.classList.add("sc-visible");
          }, delay);
        })(batch[j], Math.min(j * 45, 270));
      }
    }, { rootMargin: "0px 0px -40px 0px", threshold: 0.05 });

    for (var k = 0; k < cards.length; k++) {
      revealObserver.observe(cards[k]);
    }
  }

  /* ---------------------------------------------------------------------
   * Expand/collapse — one delegated listener per grid container. The
   * container element persists across innerHTML re-renders, so this is
   * wired exactly once, at init.
   * ------------------------------------------------------------------- */

  function wireCardToggles(container) {
    container.addEventListener("click", function (event) {
      var toggle = event.target.closest(".sc-details-toggle");
      if (!toggle || !container.contains(toggle)) return;
      var card = toggle.closest(".sc-card");
      if (!card) return;
      var open = card.classList.toggle("sc-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---------------------------------------------------------------------
   * Renderers
   * ------------------------------------------------------------------- */

  function renderHub() {
    var grid = document.getElementById("sc-hub-grid");
    var count = document.getElementById("sc-count");
    var empty = document.getElementById("sc-empty");
    var results = applyFilters();

    grid.innerHTML = results.map(cardHTML).join("");
    setupReveal(grid);

    if (count) {
      count.textContent = "Showing " + results.length + " of " + PRODUCTS.length + " products";
    }
    if (empty) {
      empty.hidden = results.length !== 0;
    }
  }

  function renderFeatured() {
    var target = document.getElementById("sc-featured");

    target.innerHTML = FEATURED_IDS
      .map(function (id) {
        return PRODUCTS.find(function (p) { return p.id === id; });
      })
      .filter(Boolean)
      .map(cardHTML)
      .join("");

    setupReveal(target);
  }

  /* ---------------------------------------------------------------------
   * Wiring
   * ------------------------------------------------------------------- */

  function wireFilters() {
    var search = document.getElementById("sc-search");
    var buckets = document.getElementById("sc-caffeine-buttons");
    var stimFree = document.getElementById("sc-stimfree");
    var sort = document.getElementById("sc-sort");

    if (search) {
      search.addEventListener("input", function () {
        state.search = search.value;
        renderHub();
      });
    }

    if (buckets) {
      buckets.addEventListener("click", function (event) {
        var button = event.target.closest("button[data-bucket]");
        if (!button) return;

        state.caffeine = button.getAttribute("data-bucket");

        var all = buckets.querySelectorAll("button[data-bucket]");
        for (var i = 0; i < all.length; i++) {
          all[i].classList.toggle("sc-active", all[i] === button);
        }

        renderHub();
      });
    }

    if (stimFree) {
      stimFree.addEventListener("change", function () {
        state.stimFreeOnly = stimFree.checked;
        renderHub();
      });
    }

    if (sort) {
      sort.addEventListener("change", function () {
        state.sort = sort.value;
        renderHub();
      });
    }
  }

  function init() {
    if (typeof PRODUCTS === "undefined") return;

    var hubGrid = document.getElementById("sc-hub-grid");
    var featured = document.getElementById("sc-featured");

    if (hubGrid) {
      wireFilters();
      wireCardToggles(hubGrid);
      renderHub();
    }

    if (featured) {
      wireCardToggles(featured);
      renderFeatured();
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
