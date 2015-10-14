var merge = require('merge');

function listResources(db, viewName, opts) {
  opts = opts || {};

  var remap = opts.remap || function(doc) { return doc.value; };
  delete opts.remap;

  return function(req, res, next) {
    var page = Number(req.query.page) || 1,
        nextpg = page + 1;

    opts.limit = opts.limit || 10;
    opts.skip = (page - 1) * opts.limit;

    db.view(viewName, 'all', opts, function(err, body) {
      if (err)
        return res.json({error: err.error, message: err.message});

      var count = Number(body.total_rows),
          lastpg = Math.ceil(count / opts.limit),
          link = '<'+req.originalUrl+'?page='+lastpg+'>; rel="last"';

      if (page != lastpg)
        link = '<'+req.originalUrl+'?page='+nextpg+'>; rel="next", ' + link;

      res.append('Link', link)
         .json(body.rows.map(remap));
    });
  };
}

function getResource(db) {
  return function(req, res, next) {
    res.json(req.resource);
  };
}

function createResource(db) {
  return function(req, res, next) {
    db.insert(req.body, function(err, body) {
      if (err)
        return res.json({error: err.error, message: err.message});

      var resource = { _id: body.id, _rev: body.rev };
      res.append('Location', req.originalUrl + '/' + resource._id)
         .status(201)
         .json(resource);
    });
  };
}

function updateResource(db) {
  return function(req, res, next) {
    var updated = merge(req.resource, req.body);
    db.insert(updated, function(err, resource) {
      if (err)
        return res.json({error: err.error, message: err.message});

      res.append('Location', req.originalUrl);
      res.json(resource);
    });
  };
}

function destroyResource(db) {
  return function(req, res, next) {
    db.destroy(req.resource._id, req.resource._rev, function(err, _) {
      if (err)
        return res.json({error: err.error, message: err.message});

      res.status(204);
      res.send();
    });
  };
}

module.exports = {
  list: listResources,
  get: getResource,
  create: createResource,
  update: updateResource,
  destroy: destroyResource
};
