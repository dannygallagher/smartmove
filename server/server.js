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

config.connectionLimit = 10;
const connection = mysql.createPool(config)

// Temporary table query
app.post('/temptablecreate', (req, res) => {
    var query = `
        CREATE TABLE att_rats
        WITH gfk_count AS(
            SELECT postal_code AS zipcode, COUNT(business_id) AS att
            FROM business
            WHERE attributesGoodForKids = 'True'
            GROUP BY postal_code),
        gfk_total AS(
            SELECT postal_code AS zipcode, COUNT(business_id) AS total
            FROM business
            WHERE attributesGoodForKids IN ('Unlisted', 'True', 'False')
            GROUP BY postal_code),
        gfd_count AS(
            SELECT postal_code AS zipcode, COUNT(business_id) AS att
            FROM business
            WHERE attributesGoodForDancing = 'True'
            GROUP BY postal_code),
        gfd_total AS(
            SELECT postal_code AS zipcode, COUNT(business_id) AS total
            FROM business
            WHERE attributesGoodForDancing IN ('Unlisted', 'True', 'False')
            GROUP BY postal_code),
        wa_count AS(
            SELECT postal_code AS zipcode, COUNT(business_id) AS att
            FROM business
            WHERE attributesWheelchairAccessible = 'True'
            GROUP BY postal_code),
        wa_total AS(
            SELECT postal_code AS zipcode, COUNT(business_id) AS total
            FROM business
            WHERE attributesWheelchairAccessible IN ('Unlisted', 'True', 'False')
            GROUP BY postal_code),
        da_count AS(
            SELECT postal_code AS zipcode, COUNT(business_id) AS att
            FROM business
            WHERE attributesDogsAllowed = 'True'
            GROUP BY postal_code),
        da_total AS(
            SELECT postal_code AS zipcode, COUNT(business_id) AS total
            FROM business
            WHERE attributesDogsAllowed IN ('Unlisted', 'True', 'False')
            GROUP BY postal_code),
        att_ratio AS(
            SELECT gfk_count.zipcode, gfk_count.att AS GoodForKidsCount, gfk_total.total AS GoodForKidsTotal, gfk_count.att/gfk_total.total AS GoodForKidsRatio, ROUND(PERCENT_RANK() OVER (ORDER BY gfk_count.att/gfk_total.total), 2) AS GoodForKidsPercentile,
            gfd_count.att AS GoodForDancingCount, gfd_total.total AS GoodForDancingTotal, gfd_count.att/gfd_total.total AS GoodForDancingRatio, ROUND(PERCENT_RANK() OVER (ORDER BY gfd_count.att/gfd_total.total), 2) AS GoodForDancingPercentile,
            wa_count.att AS WheelchairAccessibleCount, wa_total.total AS WheelchairAccessibleTotal, wa_count.att/wa_total.total AS WheelchairAccessibleRatio, ROUND(PERCENT_RANK() OVER (ORDER BY wa_count.att/wa_total.total), 2) AS WheelchairAccessiblePercentile,
            da_count.att AS DogsAllowedCount, da_total.total AS DogsAllowedTotal, da_count.att/da_total.total AS DogsAllowedRatio, ROUND(PERCENT_RANK() OVER (ORDER BY da_count.att/da_total.total), 2) AS DogsAllowedPercentile
            FROM gfk_count JOIN gfk_total ON gfk_count.zipcode = gfk_total.zipcode
            JOIN gfd_count ON gfk_count.zipcode = gfd_count.zipcode JOIN gfd_total ON gfk_count.zipcode = gfd_total.zipcode
            JOIN wa_count ON gfk_count.zipcode = wa_count.zipcode JOIN wa_total ON gfk_count.zipcode = wa_total.zipcode
            JOIN da_count ON gfk_count.zipcode = da_count.zipcode JOIN da_total ON gfk_count.zipcode = da_total.zipcode)
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
        DROP TABLE att_rats
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