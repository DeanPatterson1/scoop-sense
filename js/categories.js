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
 *                                also puts the caffeine range in the
 *                                category's "at a glance" panel
 *   tileFacts  array    three {label, key} fact rows on the product tile
 *   compareCols array   compare-table columns: {label, key, sortable, num}
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
    ]
  },

  protein: {
    label: "Protein",
    plural: "protein powders",
    page: "protein.html",
    stimBadges: false,
    tileFacts: [
      { label: "Protein", key: "m:proteinG:g" },
      // "Per scoop 88%" read as a percentage of nothing to a first-time buyer.
      // Name what the figure is a share of.
      { label: "Protein by weight", key: "protPct" },
      { label: "Source", key: "m:source" }
    ],
    compareCols: [
      { label: "Protein", key: "m:proteinG:g", sortable: true, num: true },
      { label: "Protein %", key: "protPct", sortable: true, num: true },
      // Protein % says how much of the scoop is not protein; these say what
      // that remainder actually is, which is the whole question when cutting.
      { label: "Calories", key: "m:calories", sortable: true, num: true },
      { label: "Carbs", key: "m:carbsG:g", sortable: true, num: true },
      { label: "Fat", key: "m:fatG:g", sortable: true, num: true },
      { label: "Source", key: "m:source" },
      { label: "Sweetener", key: "m:sweetener" },
      { label: "Servings", key: "servings", sortable: true, num: true },
      { label: "Price", key: "price" }
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
    ]
  }
};
