var h = require('./handlers'),
    m = require('./middleware');

function agentsRouter(express, db) {
  var router = express.Router();

  router.get('/', h.list(db, 'agents', 'all'));
  router.post('/', h.create(db));

  router.param('agent_id', m.fetch(db, prependAtSymbol));
  router.get('/:agent_id', h.get(db));
  router.put('/:agent_id', h.update(db));
  router.delete('/:agent_id', h.destroy(db));

  return router;
}

function prependAtSymbol(agent_id) {
  if (agent_id[0] !== '@')
    agent_id = '@'+agent_id;
  return agent_id;
}

module.exports = agentsRouter;
