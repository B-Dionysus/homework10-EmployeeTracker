var mysql = require("mysql");


// MySQL DB Connection Information (remember to change this with our specific credentials)
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: ")rWh0",
    database: "homework10"
  });


  module.exports=connection;
