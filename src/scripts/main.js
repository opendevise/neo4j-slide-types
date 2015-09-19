var isWebKit = 'webkitAppearance' in document.documentElement.style;
var bespoke = require('bespoke'),
  backdrop = require('bespoke-backdrop'),
  bullets = require('bespoke-bullets'),
  classes = require('bespoke-classes'),
  cursor = require('bespoke-cursor'),
  forms = require('bespoke-forms'),
  //fullscreen = require('bespoke-fullscreen'),
  hash = require('bespoke-hash'),
  nav = require('bespoke-nav'),
  overview = require('bespoke-overview'),
  scale = require('bespoke-scale');

bespoke.from('.deck', [
  classes(),
  cursor(),
  nav(),
  //fullscreen(),
  backdrop(),
  scale(isWebKit ? 'zoom' : 'transform'),
  overview(),
  bullets('li, .bullet'),
  hash(),
  forms()
]);

//require('prism');
