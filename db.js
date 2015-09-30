var DB = function(host, name) {
  var nano = require('nano')(host);

  return {
    create: function() {
      nano.db.create(name);
    },
    destroy: function() {
      nano.db.destroy(name);
    },
    connect: function() {
      return nano.db.use(name);
    }
  };
};

module.exports = DB;

if (!module.parent) {
  var host = process.argv[2] || process.env.COUCHDB_HOST,
      name = process.argv[3] || process.env.COUCHDB_NAME;

  if (!host && !name) throw (new Error('Must supply host and optinal name'));

  db = DB(host, name).connect();

  require('repl').start({
    useGlobal: true
  }).on('exit', function() {
    console.log('Goodbye.');
    process.exit();
  });
}
