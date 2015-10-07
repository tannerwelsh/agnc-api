var merge = require('merge');

function objectsRouter(express, db) {
  var router = express.Router();

  router.get('/', function(req, res, next) {
    var limit = 10,
        page = Number(req.query.page) || 1,
        nxpg = page + 1,
        skip = (page - 1) * limit;

    db.view('objects', 'all', {limit: limit, skip: skip}, function(err, body) {
      if (err)
        return res.json({error: err.error, message: err.message});

      if (Number(body.total_rows) > limit * page)
        res.append('Link', '</objects?page='+nxpg+'>; rel="next"');

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

      var obj = { _id: body.id, _rev: body.rev };
      res.append('Location', req.originalUrl + '/' + obj._id)
         .status(201)
         .json(obj);
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
