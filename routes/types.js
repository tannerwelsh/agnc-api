var h = require('./handlers'),
    m = require('./middleware');

function typesRouter(express, db) {
  var router = express.Router();

  router.param('type_id', m.fetch(db, ensureUppercase));
  router.get('/:type_id', h.get(db));
  router.put('/:type_id', h.update(db));
  router.delete('/:type_id', h.destroy(db));

  router.use('/', m.viewFinder);
  router.get('/', h.list(db));
  router.post('/', h.create(db));

  return router;
}

function ensureUppercase(type_id) {
  if (type_id[0] !== type_id[0].toUpperCase())
    type_id = type_id[0].toUpperCase() + type_id.substr(1);
  return type_id;
}

module.exports = typesRouter;
