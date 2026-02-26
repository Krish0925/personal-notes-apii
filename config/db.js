require("dotenv").config();

const mysql = require("mysql2");

const db = mysql.createConnection({

host: process.env.DB_HOST,

user: process.env.DB_USER,

password: process.env.DB_PASSWORD,

database: process.env.DB_NAME,

port: process.env.DB_PORT

});

db.connect((err)=>{

if(err){

console.log("DB Error :",err);

return;

}

console.log("Database Connected Successfully ✅");


/*
==============================
AUTO CREATE TABLES
==============================
*/


// USERS TABLE

db.query(`

CREATE TABLE IF NOT EXISTS users(

id INT AUTO_INCREMENT PRIMARY KEY,

name VARCHAR(255),

email VARCHAR(255),

password VARCHAR(255)

);

`,(err)=>{

if(err) console.log("Users Table Error :",err);

else console.log("Users Table Ready ✅");

});



// NOTES TABLE

db.query(`

CREATE TABLE IF NOT EXISTS notes(

id INT AUTO_INCREMENT PRIMARY KEY,

title VARCHAR(255),

content TEXT,

user_id INT

);

`,(err)=>{

if(err) console.log("Notes Table Error :",err);

else console.log("Notes Table Ready ✅");

});

});


module.exports = db;
