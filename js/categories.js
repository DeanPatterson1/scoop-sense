/* Scoop Sense — category registry.
 *
 * Loaded AFTER data/products.js and BEFORE js/app.js on every page that
 * renders products. Defines one global: CATEGORY_CONFIG.
 *
 * Adding a category = one entry here + product data + one landing page.
 *
 * Entry shape:
 *   label      string   display name ("Creatine")
 *   plural     string   lowercase plural for copy ("creatine products")
 *   page       string   canonical browse page for the category
 *   stimBadges boolean  true  -> tiles always show a stim tag (pre-workout)
 *                                or show one only when caffeinated (others);
 *                                also gates the caffeine filter + stim-free
 *                                toggle on the category's landing page
 *   tileFacts  array    three {label, key} fact rows on the product tile
 *   compareCols array   compare-table columns: {label, key, sortable, num}
 *   sortOptions array   OPTIONAL — extra grid sorts offered on the category's
 *                       landing page, appended after "name (A–Z)".
 *                       {label, value}; value is "caffeine-asc" | "caffeine-desc"
 *                       | "f:<asc|desc>:<fact key>" (any key from the grammar
 *                       below, resolved through factSortValue)
 *
 * Key grammar (resolved by factOf()/factSortValue() in js/app.js):
 *   "caffeineMg" | "servings"      product number fields
 *   "blend" | "stim" | "price"     derived cells (Yes/No, tier word)
 *   "protPct"                      computed proteinG / servingG percent
 *   "ing:<pattern>"                keyIngredients name lookup (regex, i)
 *   "m:<key>"                      metrics field, rendered as-is
 *   "m:<key>:g" | "m:<key>:mg"     metrics number + unit suffix
 * Missing values render as an em-dash.
 */

var CATEGORY_CONFIG = {
  "pre-workout": {
    label: "Pre-workout",
    plural: "pre-workouts",
    page: "hub.html",
    stimBadges: true,
    tileFacts: [
      { label: "Caffeine", key: "caffeineMg" },
      { label: "Citrulline", key: "ing:citrulline" },
      { label: "Beta-alanine", key: "ing:beta[- ]alanine" }
    ],
    compareCols: [
      { label: "Caffeine", key: "caffeineMg", sortable: true, num: true },
      { label: "Citrulline", key: "ing:citrulline", sortable: true, num: true },
      { label: "Beta-alanine", key: "ing:beta[- ]alanine", sortable: true, num: true },
      { label: "Blend", key: "blend" },
      { label: "Stim tier", key: "stim" },
      { label: "Servings", key: "servings", sortable: true, num: true },
      { label: "Price", key: "price" }
    ],
    sortOptions: [
      { label: "caffeine, high to low", value: "caffeine-desc" },
      { label: "caffeine, low to high", value: "caffeine-asc" },
      { label: "citrulline, high to low", value: "f:desc:ing:citrulline" },
      { label: "servings, high to low", value: "f:desc:servings" }
    ]
  },

  creatine: {
    label: "Creatine",
    plural: "creatine products",
    page: "creatine.html",
    stimBadges: false,
    tileFacts: [
      { label: "Creatine", key: "m:creatineG:g" },
      { label: "Form", key: "m:form" }
    ],
    compareCols: [
      { label: "Creatine", key: "m:creatineG:g", sortable: true, num: true },
      { label: "Form", key: "m:form" },
      { label: "Blend", key: "blend" },
      { label: "Servings", key: "servings", sortable: true, num: true },
      { label: "Price", key: "price" }
    ],
    sortOptions: [
      { label: "creatine per serving, high to low", value: "f:desc:m:creatineG" },
      { label: "servings, high to low", value: "f:desc:servings" }
    ]
  },

  protein: {
    label: "Protein",
    plural: "protein powders",
    page: "protein.html",
    stimBadges: false,
    tileFacts: [
      { label: "Protein", key: "m:proteinG:g" },
      { label: "Per scoop", key: "protPct" },
      { label: "Source", key: "m:source" }
    ],
    compareCols: [
      { label: "Protein", key: "m:proteinG:g", sortable: true, num: true },
      { label: "Protein %", key: "protPct", sortable: true, num: true },
      { label: "Source", key: "m:source" },
      { label: "Sweetener", key: "m:sweetener" },
      { label: "Servings", key: "servings", sortable: true, num: true },
      { label: "Price", key: "price" }
    ],
    sortOptions: [
      { label: "protein per serving, high to low", value: "f:desc:m:proteinG" },
      { label: "protein per scoop, high to low", value: "f:desc:protPct" },
      { label: "servings, high to low", value: "f:desc:servings" }
    ]
  },

  eaa: {
    label: "EAA / BCAA",
    plural: "amino formulas",
    page: "eaa.html",
    stimBadges: true,
    tileFacts: [
      { label: "EAAs", key: "m:eaaG:g" },
      { label: "BCAAs", key: "m:bcaaG:g" },
      { label: "Leucine", key: "m:leucineG:g" }
    ],
    compareCols: [
      { label: "EAAs", key: "m:eaaG:g", sortable: true, num: true },
      { label: "BCAAs", key: "m:bcaaG:g", sortable: true, num: true },
      { label: "Leucine", key: "m:leucineG:g", sortable: true, num: true },
      { label: "Caffeine", key: "caffeineMg", sortable: true, num: true },
      { label: "Servings", key: "servings", sortable: true, num: true },
      { label: "Price", key: "price" }
    ],
    sortOptions: [
      { label: "total EAAs, high to low", value: "f:desc:m:eaaG" },
      { label: "leucine, high to low", value: "f:desc:m:leucineG" },
      { label: "servings, high to low", value: "f:desc:servings" }
    ]
  },

  electrolytes: {
    label: "Electrolytes",
    plural: "hydration mixes",
    page: "electrolytes.html",
    stimBadges: true,
    tileFacts: [
      { label: "Sodium", key: "m:sodiumMg:mg" },
      { label: "Potassium", key: "m:potassiumMg:mg" },
      { label: "Sugar", key: "m:sugarG:g" }
    ],
    compareCols: [
      { label: "Sodium", key: "m:sodiumMg:mg", sortable: true, num: true },
      { label: "Potassium", key: "m:potassiumMg:mg", sortable: true, num: true },
      { label: "Magnesium", key: "m:magnesiumMg:mg", sortable: true, num: true },
      { label: "Sugar", key: "m:sugarG:g", sortable: true, num: true },
      { label: "Servings", key: "servings", sortable: true, num: true },
      { label: "Price", key: "price" }
    ],
    sortOptions: [
      { label: "sodium, high to low", value: "f:desc:m:sodiumMg" },
      { label: "sodium, low to high", value: "f:asc:m:sodiumMg" },
      { label: "sugar, low to high", value: "f:asc:m:sugarG" }
    ]
  }
};
