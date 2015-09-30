if (!process.env.NODE_ENV)
  process.env.NODE_ENV = 'development';

if (/development|test/.test(process.env.NODE_ENV))
  require('dotenv').load();

module.exports = process.env;
