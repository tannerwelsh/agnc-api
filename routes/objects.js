var merge = require('merge');

function objectsRouter(express, db) {
  var router = express.Router();

  router.get('/', function(req, res, next) {
    var limit = 10,
        page = Number(req.query.page) || 1,
        nextpg = page + 1,
        skip = (page - 1) * limit;

    db.view('objects', 'all', {limit: limit, skip: skip}, function(err, body) {
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

  router.param('object_id', function(req, res, next, obj_id) {
    db.get(obj_id, function(err, obj) {
      if (err) {
        next(err);
      } else if (obj) {
        req.obj = obj;
        next();
      } else {
        next(new Error('Failed to find object '+obj_id));
      }
    });
  });

  router.get('/:object_id', function(req, res, next) {
    res.json(req.obj);
  });

  router.put('/:object_id', function(req, res, next) {
    var updatedObject = merge(req.obj, req.body);
    db.insert(updatedObject, function(err, obj) {
      if (err)
        return res.json({error: err.error, message: err.message});

      res.append('Location', req.originalUrl);
      res.json(obj);
    });
  });

  router.delete('/:object_id', function(req, res, next) {
    db.destroy(req.obj._id, req.obj._rev, function(err, _) {
      if (err)
        return res.json({error: err.error, message: err.message});

      res.status(204);
      res.send();
    });
  });

  return router;
}

module.exports = objectsRouter;
