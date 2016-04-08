var isWebKit = 'webkitAppearance' in document.documentElement.style,
  // zoom-based scaling causes font sizes and line heights to be calculated differently
  // on the other hand, zoom-based scaling correctly anti-aliases fonts during transforms (no need for layer creation hack)
  scaleMethod = isWebKit ? 'zoom' : 'transform',
  //scaleMethod = 'transform',
  //scaleMethod = null,
  bespoke = require('bespoke'),
  backdrop = require('bespoke-backdrop'),
  bullets = require('bespoke-bullets'),
  classes = require('bespoke-classes'),
  //cursor = require('bespoke-cursor'),
  forms = require('bespoke-forms'),
  fullscreen = require('bespoke-fullscreen'),
  hash = require('bespoke-hash'),
  multimedia = require('bespoke-multimedia'),
  nav = require('bespoke-nav'),
  overview = require('bespoke-overview'),
  scale = require('bespoke-scale');

bespoke.from('.deck', [
  classes(),
  nav(),
  fullscreen(),
  backdrop(),
  (scaleMethod ? scale(scaleMethod) : function(deck) {}),
  overview(),
  bullets('.build, .build-items > li'),
  // enable multimedia() if you have videos or SVGs in your slides
  multimedia(),
  // enable cursor() to automatically hide the cursor when presenting
  //cursor(),
  // enable forms() if you have form elements in your slides
  forms(),
  hash()
]);
