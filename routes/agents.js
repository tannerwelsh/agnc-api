var merge = require('merge');

function agentsRouter(express, db) {
  var router = express.Router();

  router.get('/', function(req, res, next) {
    var limit = 10,
        page = Number(req.query.page) || 1,
        nextpg = page + 1,
        skip = (page - 1) * limit;

    db.view('agents', 'all', {limit: limit, skip: skip}, function(err, body) {
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

      var agent = { _id: body.id, _rev: body.rev };
      res.append('Location', req.originalUrl + '/' + agent._id)
         .status(201)
         .json(agent);
    });
  });

  router.param('agent_id', function(req, res, next, agent_id) {
    if (agent_id[0] !== '@')
      agent_id = '@'+agent_id;

    db.get(agent_id, function(err, agent) {
      if (err) {
        next(err);
      } else if (agent) {
        req.agent = agent;
        next();
      } else {
        next(new Error('Failed to find agent '+agent_id));
      }
    });
  });

  router.get('/:agent_id', function(req, res, next) {
    res.json(req.agent);
  });

  router.put('/:agent_id', function(req, res, next) {
    var updatedObject = merge(req.agent, req.body);
    db.insert(updatedObject, function(err, body) {
      if (err)
        return res.json({error: err.error, message: err.message});

      res.append('Location', req.originalUrl);
      res.json(body);
    });
  });

  router.delete('/:agent_id', function(req, res, next) {
    db.destroy(req.agent._id, req.agent._rev, function(err, body) {
      if (err)
        return res.json({error: err.error, message: err.message});

      res.status(204);
      res.send();
    });
  });

  return router;
}

module.exports = agentsRouter;
