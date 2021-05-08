const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();

app.use(cors());

const config = {
    host: "cis550-proj.c4nnu48yetwb.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "group58password",
    database: "cis550_proj_db",
    port: "3306"
}

config.connectionLimit = 10;
const connection = mysql.createPool(config)

// TEST QUERY  
const testQuery = (req, res) => {
    var query = `
        SELECT *
        FROM business
        WHERE city = 'Phoenix' AND state = 'AZ'
        LIMIT 10;
    `;

    connection.query(query, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            //console.log(rows);
            res.json(rows);
        }
    })
}

app.get('/sample', testQuery)

app.listen(4000, () => {
    console.log('running on port 4000');
})