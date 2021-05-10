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

// QUERIES FOR OPTIMIZATION

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
            res.send('Success');
        }
    })    
});


// QUERIES FOR MAP
const zoom = (req, res) => {

    let location = req.params.location;
    let locationType = req.params.locationType;

    let query =
    `
        SELECT z.${locationType} as ${locationType}, avg(z.latitude) as latitude, avg(z.longitude) as longitude
        FROM zipcode z
        WHERE z.${locationType} = '${location}'
        GROUP BY z.${locationType}
    `;

    connection.query(query, function(err, rows, fields){
        if (err) {
            console.log(err);
        } else {
            console.log('Success!');
            console.log(rows);
            res.json(rows);
        }
    })
}

app.get('/search/:location/:locationType', zoom);


// QUERIES FOR SEARCH PAGE

/********** GENERAL SEARCH ***********/
const search = (req, res) => {

    // Says if we are looking for businesses or zipcodes
    //DEFAULTS TO ZIPCODE
    let bus_or_zip = 'zipcode';

    //DEFAULTS SET TO PHOENIX COORDINATES, TO GUIDE USERS INITIALLY TOWARD AREA WHERE WE HAVE MOST BUSINESS INFO
    //DEFAULT 33.44
    let latitude = req.params.latitude ;
    //DEFAULT 112.07
    let longitude = req.params.longitude ;

    //DEFAULT 25000
    let radius = req.params.radius ;
    //DEFAULT 0
    let minBudget = req.params.minBudget ;
    //DEFAULT 999999999
    let maxBudget = req.params.maxBudget;

    // Defines attribute table name
    // DEFAULT NULL
    //let attribute = req.params.attribute;
    let attribute = 'attributesGoodForKids';
    let attribute_tbl = 'GoodForKids';

    // DEFAULT NULL
    let tag = 'Food';


    // DEFAULT DISTANCE
    //let order_key = req.params.order_key;
    let order_key = 'distance';
    // DEFAULT ASC
    //let order_direction = req.params.order_direction;
    let order_direction = 'ASC';

    let query = '';

    if (bus_or_zip === 'zipcode') {
        query = `
        WITH coordinates AS
        (SELECT zip,
        69 * DEGREES(acos( 
        cos( radians(latitude) ) *
        cos( radians(${latitude}) ) * 
        cos( radians(${longitude}) - radians(longitude ) ) +
        sin( radians( latitude ) ) * 
        sin( radians(${latitude}) ) ) )  as distance
        FROM zipcode
        WHERE 69 * DEGREES(acos( 
        cos( radians(latitude) ) *
        cos( radians(${latitude}) ) * 
        cos( radians(${longitude}) - radians(longitude ) ) +
        sin( radians(latitude) ) * 
        sin( radians(${latitude}) ) ) ) <= ${radius}),
        attribute AS
        (SELECT zipcode, percentile
        FROM ${attribute_tbl}
        WHERE percentile >= .7),
        budget AS
        (SELECT zip, 2021_02
        FROM home_values
        WHERE 2021_02 BETWEEN ${minBudget} AND ${maxBudget})
        SELECT z.zip, z.city, z.state, z.county, COUNT(business_id) AS 'Num_Businesses_Listed', 2021_02 AS Median_Home_Value
        FROM zipcode z
        JOIN coordinates c ON c.zip = z.zip 
        LEFT OUTER JOIN attribute a ON z.zip= a.zipcode
        LEFT OUTER JOIN budget h ON z.zip = h.zip 
        LEFT OUTER JOIN business b ON z.zip=b.postal_code
        WHERE 2021_02 BETWEEN ${minBudget} AND ${maxBudget}`
                + (req.params.attribute === "undefined" ? `` : ` AND percentile >= .7`)
                + `GROUP BY z.zip
        ORDER BY ${order_key} ${order_direction}
        LIMIT 50;`
    } else {
        query = `
        WITH coordinates AS
        (SELECT business_id AS id, 
        69 * DEGREES(acos( 
        cos( radians(latitude) ) *
        cos( radians(${latitude}) ) * 
        cos( radians(${longitude}) - radians(longitude ) ) +
        sin( radians( latitude ) ) * 
        sin( radians(${latitude}) ) ) )  as distance
        FROM zipcode
        WHERE 69 * DEGREES(acos( 
        cos( radians(latitude) ) *
        cos( radians(${latitude}) ) * 
        cos( radians(${longitude}) - radians(longitude ) ) +
        sin( radians(latitude) ) * 
        sin( radians(${latitude}) ) ) ) <= ${radius}),
    budget AS
        (SELECT zip, 2021_02
        FROM home_values
        WHERE 2021_02 BETWEEN ${minBudget} AND ${maxBudget})
    SELECT b.name, b.city, b.state, b.postal_code, z.county, b.stars AS 'Rating (Out of 5)'
    FROM zipcode z
    LEFT OUTER JOIN budget h ON z.zip = h.zip
    JOIN business b ON b.postal_code = z.zip
    JOIN coordinates c ON b.business_id = c.id
    WHERE 2021_02 BETWEEN ${minBudget} AND ${maxBudget} AND ${attribute} = 'True'
    AND EXISTS (SELECT * FROM business_categories WHERE business_id = b.business_id AND categories = ${tag})
    ORDER BY ${order_key} ${order_direction}
    LIMIT 50;
        `
    }

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

app.get('/search/:latitude/:longitude/:radius/:minBudget/:maxBudget/:bus_or_zip/:attribute/:attribute_tbl/:tag/:order_key/:order_direction', search);


/********** LOCAL_BUSINESSES ***********/

const locals = (req, res) => {

    // Says if we are looking for businesses or zipcodes
    //DEFAULTS TO ZIPCODE
    let bus_or_zip = 'zipcode';

    //DEFAULTS SET TO PHOENIX COORDINATES, TO GUIDE USERS INITIALLY TOWARD AREA WHERE WE HAVE MOST BUSINESS INFO
    //DEFAULT 33.44
    let latitude = req.params.latitude ;
    //DEFAULT 112.07
    let longitude = req.params.longitude ;

    //DEFAULT 25000
    let radius = req.params.radius ;
    //DEFAULT 0
    let minBudget = req.params.minBudget ;
    //DEFAULT 999999999
    let maxBudget = req.params.maxBudget;

    // Defines attribute table name
    // DEFAULT NULL
    //let attribute = req.params.attribute;
    let attribute = 'attributesGoodForKids';
    let attribute_tbl = 'GoodForKids';

    // DEFAULT NULL
    let tag = 'Food';


    // DEFAULT DISTANCE
    //let order_key = req.params.order_key;
    let order_key = 'distance';
    // DEFAULT ASC
    //let order_direction = req.params.order_direction;
    let order_direction = 'ASC';

    let query = `
    WITH coordinates AS
        (SELECT zip,
        69 * DEGREES(acos( 
        cos( radians(latitude) ) *
        cos( radians(${latitude}) ) * 
        cos( radians(${longitude}) - radians(longitude ) ) +
        sin( radians( latitude ) ) * 
        sin( radians(${latitude}) ) ) )  as distance
        FROM zipcode
        WHERE 69 * DEGREES(acos( 
        cos( radians(latitude) ) *
        cos( radians(${latitude}) ) * 
        cos( radians(${longitude}) - radians(longitude ) ) +
        sin( radians(latitude) ) * 
        sin( radians(${latitude}) ) ) ) <= ${radius})
    SELECT name, city, state, postal_code, stars AS 'Rating (Out of 5)'
    FROM business b
    JOIN coordinates c ON b.business_id = c.id
    WHERE NOT EXISTS (SELECT * FROM business b2 WHERE b.name=b2.name AND b.business_id <> b2.business_id)
    limit 50;
    `;


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

app.get('/search/:latitude/:longitude/:radius/:minBudget/:maxBudget/:bus_or_zip/:attribute/:attribute_tbl/:tag/:order_key/:order_direction', locals);

/********** Restaurants ***********/

const restaurants = (req, res) => {

    // Says if we are looking for businesses or zipcodes
    //DEFAULTS TO ZIPCODE
    let bus_or_zip = 'zipcode';

    //DEFAULTS SET TO PHOENIX COORDINATES, TO GUIDE USERS INITIALLY TOWARD AREA WHERE WE HAVE MOST BUSINESS INFO
    //DEFAULT 33.44
    let latitude = req.params.latitude ;
    //DEFAULT 112.07
    let longitude = req.params.longitude ;

    //DEFAULT 25000
    let radius = req.params.radius ;
    //DEFAULT 0
    let minBudget = req.params.minBudget ;
    //DEFAULT 999999999
    let maxBudget = req.params.maxBudget;

    // Defines attribute table name
    // DEFAULT NULL
    //let attribute = req.params.attribute;
    let attribute = 'attributesGoodForKids';
    let attribute_tbl = 'GoodForKids';

    // DEFAULT NULL
    let tag = 'Food';


    // DEFAULT DISTANCE
    //let order_key = req.params.order_key;
    let order_key = 'distance';
    // DEFAULT ASC
    //let order_direction = req.params.order_direction;
    let order_direction = 'ASC';

    //DEFAULT 1
    let rating = 3;
    let r_price = 2;
    let r_count = 10;

    let query = `
    WITH coordinates AS
        (SELECT zip,
        69 * DEGREES(acos( 
        cos( radians(latitude) ) *
        cos( radians(${latitude}) ) * 
        cos( radians(${longitude}) - radians(longitude ) ) +
        sin( radians( latitude ) ) * 
        sin( radians(${latitude}) ) ) )  as distance
        FROM zipcode
        WHERE 69 * DEGREES(acos( 
        cos( radians(latitude) ) *
        cos( radians(${latitude}) ) * 
        cos( radians(${longitude}) - radians(longitude ) ) +
        sin( radians(latitude) ) * 
        sin( radians(${latitude}) ) ) ) <= ${radius}),
        attribute AS
        (SELECT zipcode, percentile
        FROM ${attribute_tbl}
        WHERE percentile >= .7),
        budget AS
        (SELECT zip, 2021_02
        FROM home_values
        WHERE 2021_02 BETWEEN ${minBudget} AND ${maxBudget}),
        business_count AS
        (SELECT postal_code, COUNT(business_id) AS bcount
        FROM business
        GROUP BY postal_code)
        SELECT z.zip, z.city, z.state, z.county, bcount AS 'Num_Businesses_Listed', AVG(stars) AS 'Average Rating (Out of 5)', AVG(attributesRestaurantsPriceRange) AS 'Average Price ($ - $$$$)', COUNT(attributesRestaurantsPriceRange) AS '# Restaurants Listed'
        FROM zipcode z
        JOIN coordinates c ON c.zip = z.zip 
        LEFT OUTER JOIN attribute a ON z.zip= a.zipcode
        LEFT OUTER JOIN budget h ON z.zip = h.zip 
        JOIN business_count bc ON z.zip=bc.postal_code
        JOIN business b ON z.zip=b.postal_code
        WHERE 2021_02 BETWEEN ${minBudget} AND ${maxBudget}`
                + (req.params.attribute === "undefined" ? `` : ` AND percentile >= .7`)
                + `GROUP BY z.zip
        HAVING AVG(stars) >= ${rating} AND AVG(attributesRestaurantsPriceRange) <= ${r_price} AND COUNT(attributesRestaurantsPriceRange) >= ${r_count}
        ORDER BY ${order_key} ${order_direction}
        LIMIT 50;
    `;


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

app.get('/search/:latitude/:longitude/:radius/:minBudget/:maxBudget/:bus_or_zip/:attribute/:attribute_tbl/:tag/:order_key/:order_direction/:rating/:r_price/:r_count', restaurants);






// QUERIES FOR DETAILS PAGE

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
    SELECT Asian, Black, AmericanIndian, NativeHawaiianOtherPacific, White, TwoOrMoreRaces
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
    SELECT Females AS Percent_Female, Males AS Percent_Male
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

// details page list of local restaurants thats not in any other region 
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
            LIMIT 15)
    SELECT DISTINCT name, stars
    FROM topTenLocalRestaurants t JOIN business_categories bc ON t.business_id = bc.business_id
    WHERE categories IN ('Restaurants', 'Food');
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

// details page line chart of home values
const homeLine = (req, res) => {
    var inputZip = req.params.zip;
    var query = `
    SELECT 
        2020_09 AS September, 
        2020_10 AS October, 
        2020_11 AS November, 
        2020_12 AS December, 
        2021_01 AS January,
        2021_02 AS February
    FROM home_values
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

// details page line chart of rent prices 
const rentLine = (req, res) => {
    var inputZip = req.params.zip;
    var query = `
    SELECT 
        2020_09 AS September, 
        2020_10 AS October, 
        2020_11 AS November, 
        2020_12 AS December, 
        2021_01 AS January,
        2021_02 AS February
    FROM rental_prices
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

// pie chart of ethnicity
app.get('/ethnicPieChart/:zip', ethnicPie)

// bar chart of business categories
app.get('/businessCategoriesBarChart/:zip', businessCategoriesBar)

// pie chart of ethnicity
app.get('/genderPieChart/:zip', genderPie)

// list of 10 local restaurants
app.get('/restaurants/:zip', restaurantList)

// last 6 month of home values
app.get('/homeValues/:zip', homeLine)

// last 6 month of rent prices
app.get('/rentPrices/:zip', rentLine)










app.listen(4000, () => {
    console.log('running on port 4000');
})