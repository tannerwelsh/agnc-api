var h = require('./handlers'),
    m = require('./middleware');

function setsRouter(express, db) {
  var router = express.Router();

  router.use('/', m.viewFinder);
  router.get('/', h.list(db, { limit: 50, group: true, remap: nameAndSize}));

  return router;
}

function nameAndSize(doc) {
  return { name: doc.key, size: doc.value };
}

module.exports = setsRouter;
