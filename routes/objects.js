var h = require('./handlers'),
    m = require('./middleware');

function objectsRouter(express, db) {
  var router = express.Router();

  router.param('object_id', m.fetch(db));
  router.get('/:object_id', h.get(db));
  router.put('/:object_id', h.update(db));
  router.delete('/:object_id', h.destroy(db));

  router.use('/', m.viewFinder);
  router.get('/', h.list(db));
  router.post('/', h.create(db));

  return router;
}

module.exports = objectsRouter;
