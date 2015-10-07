var merge = require('merge');

function typesRouter(express, db) {
  var router = express.Router();

  router.get('/', function(req, res, next) {
    var limit = 10,
        page = Number(req.query.page) || 1,
        nextpg = page + 1,
        skip = (page - 1) * limit;

    db.view('types', 'all', {limit: limit, skip: skip}, function(err, body) {
      if (err)
        return res.json({error: err.error, message: err.message});

      var count = Number(body.total_rows),
          lastpg = Math.ceil(count / limit),
          link = '<'+req.originalUrl+'?page='+lastpg+'>; rel="last"';

      if (page != lastpg)
        link = '<'+req.originalUrl+'?page='+nextpg+'>; rel="next", ' + link;

      res.append('Link', link)
         .json(body.rows.map(function(doc) { return doc.value; }));
    });
  });

  router.get('/:type_id', function(req, res, next) {
    db.get(req.params.type_id, function(err, body) {
      if (err)
        return res.json({error: err.error, message: err.message});

      res.json(body);
    });
  });

  router.post('/', function(req, res, next) {
    db.insert(req.body, function(err, body) {
      if (err)
        return res.json({error: err.error, message: err.message});

      var type = { _id: body.id, _rev: body.rev };
      res.append('Location', req.originalUrl + '/' + type._id)
         .status(201)
         .json(type);
    });
  });

  router.put('/:type_id', function(req, res, next) {
    db.get(req.params.type_id, function(err, body) {
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

  router.delete('/:type_id', function(req, res, next) {
    db.get(req.params.type_id, function(err, body) {
      if (err)
        return res.json({error: err.error, message: err.message});

      db.destroy(req.params.type_id, body._rev, function(err, body) {
        if (err)
          return res.json({error: err.error, message: err.message});

        res.status(204);
        res.json(body);
      });
    });
  });

  return router;
}

module.exports = typesRouter;
