var h = require('./handlers'),
    m = require('./middleware');

function setsRouter(express, db) {
  var router = express.Router();

  router.get('/', h.list(db, 'sets', 'all', { limit: 50, group: true, remap: nameAndSize}));

  router.param('set_name', prependOctothorpe);
  router.get('/:set_name', h.list(db, 'sets', 'show', { limit: 50, reduce: false, byId: 'set_name' }));

  return router;
}

function nameAndSize(doc) {
  return { name: doc.key, size: doc.value };
}

function prependOctothorpe(req, res, next, set_name) {
  req.set_name = set_name[0] !== '#' ? '#'+set_name : set_name;
  next();
}

module.exports = setsRouter;
