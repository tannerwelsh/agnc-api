if (!process.env.NODE_ENV)
  process.env.NODE_ENV = 'development';

require('dotenv').load();

if (/development|test/.test(process.env.NODE_ENV))
  process.env.COUCHDB_NAME += '_' + process.env.NODE_ENV;

module.exports = process.env;
