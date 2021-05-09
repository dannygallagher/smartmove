const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const config = {
    host: "cis550-proj.c4nnu48yetwb.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "group58password",
    database: "cis550_proj_db",
    port: "3306"

}

const configMult = {
    host: "cis550-proj.c4nnu48yetwb.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "group58password",
    database: "cis550_proj_db",
    port: "3306",
    multipleStatements: true

}

config.connectionLimit = 10;
const connection = mysql.createPool(configMult)

// Temporary table query
app.post('/temptablecreate', (req, res) => {
    var query = `
        CREATE TABLE GoodForKids
WITH att_count AS(
	SELECT postal_code AS zipcode, COUNT(business_id) AS att
    FROM business
    WHERE attributesGoodForKids = 'True'
    GROUP BY postal_code),
total_count AS(
	SELECT postal_code AS zipcode, COUNT(business_id) AS total
    FROM business
	WHERE attributesGoodForKids IN ('Unlisted', 'True', 'False')
    GROUP BY postal_code),
att_ratio AS(
	SELECT a.zipcode, a.att, t.total, a.att/t.total AS att_rat, ROUND(PERCENT_RANK() OVER (ORDER BY a.att/t.total), 2) AS percentile
	FROM att_count a JOIN total_count t ON a.zipcode = t.zipcode)
SELECT *
FROM att_ratio;

CREATE TABLE GoodForDancing
WITH att_count AS(
	SELECT postal_code AS zipcode, COUNT(business_id) AS att
    FROM business
    WHERE attributesGoodForDancing = 'True'
    GROUP BY postal_code),
total_count AS(
	SELECT postal_code AS zipcode, COUNT(business_id) AS total
    FROM business
	WHERE attributesGoodForDancing IN ('Unlisted', 'True', 'False')
    GROUP BY postal_code),
att_ratio AS(
	SELECT a.zipcode, a.att, t.total, a.att/t.total AS att_rat, ROUND(PERCENT_RANK() OVER (ORDER BY a.att/t.total), 2) AS percentile
	FROM att_count a JOIN total_count t ON a.zipcode = t.zipcode)
SELECT *
FROM att_ratio;

CREATE TABLE WheelchairAccessible
WITH att_count AS(
	SELECT postal_code AS zipcode, COUNT(business_id) AS att
    FROM business
    WHERE attributesWheelchairAccessible = 'True'
    GROUP BY postal_code),
total_count AS(
	SELECT postal_code AS zipcode, COUNT(business_id) AS total
    FROM business
	WHERE attributesWheelchairAccessible IN ('Unlisted', 'True', 'False')
    GROUP BY postal_code),
att_ratio AS(
	SELECT a.zipcode, a.att, t.total, a.att/t.total AS att_rat, ROUND(PERCENT_RANK() OVER (ORDER BY a.att/t.total), 2) AS percentile
	FROM att_count a JOIN total_count t ON a.zipcode = t.zipcode)
SELECT *
FROM att_ratio;

CREATE TABLE DogsAllowed
WITH att_count AS(
	SELECT postal_code AS zipcode, COUNT(business_id) AS att
    FROM business
    WHERE attributesDogsAllowed = 'True'
    GROUP BY postal_code),
total_count AS(
	SELECT postal_code AS zipcode, COUNT(business_id) AS total
    FROM business
	WHERE attributesDogsAllowed IN ('Unlisted', 'True', 'False')
    GROUP BY postal_code),
att_ratio AS(
	SELECT a.zipcode, a.att, t.total, a.att/t.total AS att_rat, ROUND(PERCENT_RANK() OVER (ORDER BY a.att/t.total), 2) AS percentile
	FROM att_count a JOIN total_count t ON a.zipcode = t.zipcode)
SELECT *
FROM att_ratio;
    `;

    connection.query(query, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log('Success'); 
            res.send('Success');
        }
    })    
});

// Temporary table query
app.post('/temptabledrop', (req, res) => {
    var query = `
        DROP TABLE GoodForKids;
        DROP TABLE GoodForDancing;
        DROP TABLE WheelchairAccessible;
        DROP TABLE DogsAllowed;
    `;

    connection.query(query, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log('Success'); 
            res.send('Success');
        }
    })    
});



// TEST QUERY  
const testQuery = (req, res) => {
    var query = `
        SELECT *
        FROM att_rats
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

//app.post('/temptable', tempTable);
app.get('/sample', testQuery);


app.listen(4000, () => {
    console.log('running on port 4000');
})