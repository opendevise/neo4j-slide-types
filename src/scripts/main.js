var bespoke = require('bespoke'),
  classes = require('bespoke-classes'),
  keys = require('bespoke-keys'),
  touch = require('bespoke-touch'),
  fullscreen = require('bespoke-fullscreen'),
  backdrop = require('bespoke-backdrop'),
  scale = require('bespoke-scale'),
  overview = require('bespoke-overview'),
  bullets = require('bespoke-bullets'),
  hash = require('bespoke-hash'),
  forms = require('bespoke-forms');

bespoke.from('.deck', [
  classes(),
  keys(),
  touch(),
  fullscreen(),
  backdrop(),
  scale(),
  overview(),
  bullets('li, .bullet'),
  hash(),
  forms()
]);

require('prism');
