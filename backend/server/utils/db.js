const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "1234",
  port: "5432",
  database: "rapimoney"
});

module.exports = pool;
