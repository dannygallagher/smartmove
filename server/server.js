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


// GENERAL SEARCH
const search = (req, res) => {

    console.log("Reached here");    

    let latitude = req.params.latitude ;
    let longitude = req.params.longitude ;
    let radius = req.params.radius ;
    let minBudget = req.params.minBudget ;
    let maxBudget = req.params.maxBudget;

    // // Defines attribute table name
    // let attribute = ';

    // // Says if we are looking for businesses or zipcodes
    // let result_type = ;

    let query = `
        WITH coordinates AS
            (SELECT zip,
            69 * DEGREES(acos( 
            cos( radians(latitude) ) *
            cos( radians(${latitude}) ) * 
            cos( radians(${longitude}) - radians(longitude ) ) +
            sin( radians( latitude ) ) * 
            sin( radians(${latitude}) ) ) )  as distance
            FROM zipcode)
        SELECT z.zip, z.city, z.state, z.county, COUNT(business_id) AS Num_Businesses_Listed, 2021_02 AS Median_Home_Value
        FROM zipcode z
        JOIN coordinates c ON c.zip = z.zip 
        LEFT OUTER JOIN GoodForKids a ON z.zip= a.zipcode
        JOIN home_values h ON z.zip = h.zip 
        JOIN business b ON z.zip=b.postal_code
        WHERE c.distance <= 100 AND 2021_02 BETWEEN 50000 AND 1000000 AND percentile >= .7
        GROUP BY z.zip
        ORDER BY a.percentile DESC
        LIMIT 20;
    `

    connection.query(query, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log('Success!');
            console.log(rows);
            res.json(rows);
        }
    })
}

app.get('/search/:latitude/:longitude/:radius/:minBudget/:maxBudget', search);






// // TEST QUERY  
// const testQuery = (req, res) => {
//     var query = `
//         SELECT *
//         FROM att_rats
//     `;

//     connection.query(query, function(err, rows, fields) {
//         if (err) {
//             console.log(err);
//         } else {
//             //console.log(rows);
//             res.json(rows);
//         }
//     })
// }


//app.get('/sample', testQuery);


app.listen(4000, () => {
    console.log('running on port 4000');
})