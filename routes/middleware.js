function fetch(db, before) {
  return function(req, res, next, id) {
    if (before) id = before(id);

    db.get(id, function(err, resource) {
      if (err) {
        next(err);
      } else if (resource) {
        req.resource = resource;
        next();
      } else {
        next(new Error('Failed to find '+resourceName+' '+id));
      }
    });
  };
}

function viewFinder(req, res, next) {
  var design, view, queryParams, queryKey;

  design = req.baseUrl.replace('/', '');

  delete req.query.q; // TODO: parse 'q' query param

  if (req.query.set && req.query.set[0] !== '#')
    req.query.set = '#'+req.query.set;

  queryParams = Object.keys(req.query).sort();

  if (queryParams.length > 0) {
    view = 'by_'+queryParams.join('_and_');
    queryKey = queryParams.map(function(k) { return req.query[k]; });
  }

  req.design = design;
  req.view = view || 'all';
  req.queryKey = queryKey;

  next();
}

module.exports = {
  fetch: fetch,
  viewFinder: viewFinder
};
