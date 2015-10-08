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

  router.param('type_id', function(req, res, next, type_id) {
    if (type_id[0] !== type_id[0].toUpperCase())
      type_id = type_id[0].toUpperCase() + type_id.substr(1);

    db.get(type_id, function(err, type) {
      if (err) {
        next(err);
      } else if (type) {
        req.typeObj = type;
        next();
      } else {
        next(new Error('Failed to find type '+type_id));
      }
    });
  });

  router.get('/:type_id', function(req, res, next) {
    res.json(req.typeObj);
  });

  router.put('/:type_id', function(req, res, next) {
    var updatedType = merge(req.typeObj, req.body);
    db.insert(updatedType, function(err, type) {
      if (err)
        return res.json({error: err.error, message: err.message});

      res.append('Location', req.originalUrl);
      res.json(type);
    });
  });

  router.delete('/:type_id', function(req, res, next) {
    db.destroy(req.typeObj._id, req.typeObj._rev, function(err, _) {
      if (err)
        return res.json({error: err.error, message: err.message});

      res.status(204);
      res.send();
    });
  });

  return router;
}

module.exports = typesRouter;
