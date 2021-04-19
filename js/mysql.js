"use strict"
const mysql = require('mysql2')

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "parser",
    password: ""
  });
  connection.connect(function(e) {
	if (e) 	{
		console.log("DATABASE IS NOT WORKING");
		throw e;
	}
	else 	{
		console.log(`DATABASE IS WORKING`);
	}
});
module.exports = connection;