var mysql = require("mysql");


// MySQL DB Connection Information (remember to change this with our specific credentials)
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    // This is a temp password, so I'm not worried about exposing it in github.
    // Soon I'll know how to use environment variables, instead!
    password: "",
    database: "homework10"
  });


  module.exports=connection;
