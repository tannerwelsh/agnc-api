var merge = require('merge');

function objectsRouter(express, db) {
  var router = express.Router();

  router.get('/', function(req, res, next) {
    db.view('objects', 'all', function(err, body) {
      if (err)
        return res.json({error: err.error, message: err.message});

      res.json(body.rows.map(function(doc) { return doc.value; }));
    });
  });

  router.get('/:object_id', function(req, res, next) {
    db.get(req.params.object_id, function(err, body) {
      if (err)
        return res.json({error: err.error, message: err.message});

      res.json(body);
    });
  });

  router.post('/', function(req, res, next) {
    db.insert(req.body, function(err, body) {
      if (err)
        return res.json({error: err.error, message: err.message});

      res.append('Location', req.originalUrl + body.id);
      res.json(body);
    });
  });

  router.put('/:object_id', function(req, res, next) {
    db.get(req.params.object_id, function(err, body) {
      if (err)
        return res.json({error: err.error, message: err.message});

      var updatedObject = merge(body, req.body);
      db.insert(updatedObject, function(err, body) {
        if (err)
          return res.json({error: err.error, message: err.message});

        res.append('Location', req.originalUrl);
        res.json(body);
      });
    });
  });

  router.delete('/:object_id', function(req, res, next) {
    db.get(req.params.object_id, function(err, body) {
      if (err)
        return res.json({error: err.error, message: err.message});

      db.destroy(req.params.object_id, body._rev, function(err, body) {
        if (err)
          return res.json({error: err.error, message: err.message});

        res.status(204);
        res.json(body);
      });
    });
  });

  return router;
}

module.exports = objectsRouter;
