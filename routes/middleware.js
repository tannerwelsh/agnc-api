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

module.exports = {
  fetch: fetch
};
