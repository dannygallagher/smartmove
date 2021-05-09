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

// details page bar graph of business categories 
const ethnicPie = (req, res) => {
    var inputZip = req.params.zip;
    var query = `
    WITH demographicsSummedByEthnicities AS 
        (SELECT 
            STNAME, 
            CTYNAME, 
            SUM(AA_FEMALE + AA_MALE) AS Asian, 
            SUM(BA_FEMALE + BA_MALE) AS Black,
            SUM(IA_FEMALE + IA_MALE) AS AmericanIndian, 
            SUM(NA_FEMALE + NA_MALE) AS NativeHawaiianOtherPacific, 
            SUM(TOM_FEMALE + TOM_MALE) AS TwoOrMoreRaces, 
            SUM(WA_FEMALE + WA_MALE) AS White
        FROM demographics 
        GROUP BY STNAME, CTYNAME)
    SELECT 
        (Asian/(Asian + Black + AmericanIndian + NativeHawaiianOtherPacific + White + TwoOrMoreRaces))*100 AS Asian, 
        (Black/(Asian + Black + AmericanIndian + NativeHawaiianOtherPacific + White + TwoOrMoreRaces))*100 AS Black, 
        (AmericanIndian/(Asian + Black + AmericanIndian + NativeHawaiianOtherPacific + White + TwoOrMoreRaces))*100 AS AmericanIndian, 
        (NativeHawaiianOtherPacific/(Asian + Black + AmericanIndian + NativeHawaiianOtherPacific + White + TwoOrMoreRaces))*100 AS NativeHawaiianOtherPacific, 
        (White/(Asian + Black + AmericanIndian + NativeHawaiianOtherPacific + White + TwoOrMoreRaces))*100 AS White, 
        (TwoOrMoreRaces/(Asian + Black + AmericanIndian + NativeHawaiianOtherPacific + White + TwoOrMoreRaces))*100 AS TwoOrMoreRaces
    FROM zipcode z JOIN demographicsSummedByEthnicities d ON (z.state = d.STNAME AND z.county = d.CTYNAME)
    WHERE zip = ${inputZip};

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

// details page bar graph of business categories 
const businessCategoriesBar = (req, res) => {
    var inputZip = req.params.zip;
    var query = `
        SELECT categories AS category, count(categories) AS number_of_businesses
        FROM business_categories JOIN business ON 
            business.business_id=business_categories.business_id
        WHERE postal_code = ${inputZip}
        GROUP BY categories
        ORDER BY number_of_businesses DESC
        LIMIT 15;
    
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

// details page pie chart of gender 
const genderPie = (req, res) => {
    var inputZip = req.params.zip;
    var query = `
    WITH demographicsSummedByGender AS 
    (SELECT STNAME, CTYNAME, SUM(TOT_FEMALE) AS Females, SUM(TOT_MALE) AS Males
        FROM demographics 
        GROUP BY STNAME, CTYNAME)
    SELECT (Females/(Females + Males))*100 AS Percent_Female, (Males/(Females + Males))*100 AS Percent_Male
    FROM zipcode z JOIN demographicsSummedByGender d ON (z.state = d.STNAME AND z.county = d.CTYNAME)
    WHERE zip = ${inputZip};
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

// details page list of local restaurants 
const restaurantList = (req, res) => {
    var inputZip = req.params.zip;
    var query = `
    WITH restaurants AS
            (SELECT b.business_id, postal_code, name, stars
            FROM business b JOIN business_categories bc ON b.business_id = bc.business_id
            WHERE categories = 'Restaurants'),
        topTenLocalRestaurants AS 
            (SELECT DISTINCT r1.business_id, name, stars
            FROM restaurants r1
            WHERE postal_code = ${inputZip} AND NOT EXISTS 
                (SELECT *
                FROM restaurants r2
                WHERE r2.name = r1.name AND r2.postal_code != ${inputZip}) 
            ORDER BY r1.stars DESC
            LIMIT 10)
    SELECT DISTINCT name, stars
    FROM topTenLocalRestaurants t JOIN business_categories bc ON t.business_id = bc.business_id
    WHERE categories in ('Restaurants', 'Food');
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

// pie chart of ethnicity
app.get('/ethnicPieChart/:zip', ethnicPie)

// bar chart of business categories
app.get('/businessCategoriesBarChart/:zip', businessCategoriesBar)

// pie chart of ethnicity
app.get('/genderPieChart/:zip', genderPie)

// list of 10 local restaurants
app.get('/restaurants/:zip', restaurantList)

app.listen(4000, () => {
    console.log('running on port 4000');
})