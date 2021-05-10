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
	SELECT postal_code AS zipcode, 
    (CASE WHEN attributesGoodForKids = 'True' THEN COUNT(if( attributesGoodForKids = 'True', business_id, NULL))
    ELSE 0
    END) AS att,
	COUNT(business_id) AS total
    FROM business
	WHERE attributesGoodForKids IN ('Unlisted', 'True', 'False')
    GROUP BY postal_code),
att_0 AS
	(SELECT zipcode, att, total, 0 AS att_rat, 0 AS percentile
    FROM att_count 
    WHERE att = 0),
att_ratio AS(
	SELECT zipcode, att, total, att/total AS att_rat, 
    ROUND(PERCENT_RANK() OVER (ORDER BY att/total), 2) AS percentile
	FROM att_count a
    WHERE att > 0
)
SELECT * FROM att_0
UNION
SELECT *
FROM att_ratio;

CREATE TABLE GoodForDancing
WITH att_count AS(
	SELECT postal_code AS zipcode, 
    (CASE WHEN attributesGoodForDancing = 'True' THEN COUNT(if( attributesGoodForDancing = 'True', business_id, NULL))
    ELSE 0
    END) AS att,
	COUNT(business_id) AS total
    FROM business
	WHERE attributesGoodForDancing IN ('Unlisted', 'True', 'False')
    GROUP BY postal_code),
att_0 AS
	(SELECT zipcode, att, total, 0 AS att_rat, 0 AS percentile
    FROM att_count 
    WHERE att = 0),
att_ratio AS(
	SELECT zipcode, att, total, att/total AS att_rat, 
    ROUND(PERCENT_RANK() OVER (ORDER BY att/total), 2) AS percentile
	FROM att_count a
    WHERE att > 0
)
SELECT * FROM att_0
UNION
SELECT *
FROM att_ratio;

CREATE TABLE WheelchairAccessible
WITH att_count AS(
	SELECT postal_code AS zipcode, 
    (CASE WHEN attributesWheelchairAccessible = 'True' THEN COUNT(if( attributesWheelchairAccessible = 'True', business_id, NULL))
    ELSE 0
    END) AS att,
	COUNT(business_id) AS total
    FROM business
	WHERE attributesWheelchairAccessible IN ('Unlisted', 'True', 'False')
    GROUP BY postal_code),
att_0 AS
	(SELECT zipcode, att, total, 0 AS att_rat, 0 AS percentile
    FROM att_count 
    WHERE att = 0),
att_ratio AS(
	SELECT zipcode, att, total, att/total AS att_rat, 
    ROUND(PERCENT_RANK() OVER (ORDER BY att/total), 2) AS percentile
	FROM att_count a
    WHERE att > 0
)
SELECT * FROM att_0
UNION
SELECT *
FROM att_ratio;

CREATE TABLE DogsAllowed
WITH att_count AS(
	SELECT postal_code AS zipcode, 
    (CASE WHEN attributesDogsAllowed = 'True' THEN COUNT(if(attributesDogsAllowed = 'True', business_id, NULL))
    ELSE 0
    END) AS att,
	COUNT(business_id) AS total
    FROM business
	WHERE attributesDogsAllowed IN ('Unlisted', 'True', 'False')
    GROUP BY postal_code),
att_0 AS
	(SELECT zipcode, att, total, 0 AS att_rat, 0 AS percentile
    FROM att_count 
    WHERE att = 0),
att_ratio AS(
	SELECT zipcode, att, total, att/total AS att_rat, 
    ROUND(PERCENT_RANK() OVER (ORDER BY att/total), 2) AS percentile
	FROM att_count a
    WHERE att > 0
)
SELECT * FROM att_0
UNION
SELECT *
FROM att_ratio;

CREATE TABLE GoodForBikers
WITH att_count AS(
	SELECT postal_code AS zipcode, 
    (CASE WHEN attributesBikeParking = 'True' THEN COUNT(if(attributesBikeParking = 'True', business_id, NULL))
    ELSE 0
    END) AS att,
	COUNT(business_id) AS total
    FROM business
	WHERE attributesBikeParking IN ('Unlisted', 'True', 'False')
    GROUP BY postal_code),
att_0 AS
	(SELECT zipcode, att, total, 0 AS att_rat, 0 AS percentile
    FROM att_count 
    WHERE att = 0),
att_ratio AS(
	SELECT zipcode, att, total, att/total AS att_rat, 
    ROUND(PERCENT_RANK() OVER (ORDER BY att/total), 2) AS percentile
	FROM att_count a
    WHERE att > 0
)
SELECT * FROM att_0
UNION
SELECT *
FROM att_ratio;

CREATE TABLE RestaurantDelivery
WITH att_count AS(
	SELECT postal_code AS zipcode, 
    (CASE WHEN attributesRestaurantsDelivery = 'True' THEN COUNT(if(attributesRestaurantsDelivery = 'True', business_id, NULL))
    ELSE 0
    END) AS att,
	COUNT(business_id) AS total
    FROM business
	WHERE attributesRestaurantsDelivery IN ('Unlisted', 'True', 'False')
    GROUP BY postal_code),
att_0 AS
	(SELECT zipcode, att, total, 0 AS att_rat, 0 AS percentile
    FROM att_count 
    WHERE att = 0),
att_ratio AS(
	SELECT zipcode, att, total, att/total AS att_rat, 
    ROUND(PERCENT_RANK() OVER (ORDER BY att/total), 2) AS percentile
	FROM att_count a
    WHERE att > 0
)
SELECT * FROM att_0
UNION
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
        DROP TABLE GoodForBikers;
        DROP TABLE RestaurantDelivery;
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
    let bus_or_zip = req.params.bus_or_zip;

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
    let attribute = req.params.attribute;

    let attribute_db = '';
    if(attribute === 'GoodForKids'){
        attribute_db = 'attributesGoodForKids'
    }else if(attribute === 'GoodForDancing'){
        attribute_db = 'attributesGoodForDancing'
    }else if(attribute === 'DogsAllowed'){
        attribute_db = 'attributesDogsAllowed'
    }else if(attribute === 'WheelchairAccessible'){
        attribute_db = 'attributesWheelchairAccessible'
    }else if(attribute === 'GoodForBikers'){
        attribute_db = 'attributesBikeParking'
    }else if(attribute === 'RestaurantDelivery'){
        attribute_db = 'attributesRestaurantsDelivery'
    }


    // DEFAULT NULL
    let tags = req.params.tags;

    let tag_array = tags.split("-");

    console.log({tag_array});

    let tag_string = '(';

    for (var i = 0; i < tag_array.length; i++) {
        let temp = tag_array[i];
        console.log({temp});
        if (temp === "HomeServices") {
            temp = "Home Services";
        } else if (temp === "Health&Medical") {
            temp = "Heath & Medical";
        } else if (temp === "Beauty&Spas") {
            temp = "Beauty & Spas";
        } else if (temp === "LocalServices") {
            temp = "Local Services";
        } else if (temp === "EventPlanning&Services") {
            temp = "Event Planning & Services";
        } else if (temp === "ActiveLife") { 
            temp = "Active Life";
        }
        
        if (i < tag_array.length - 1) {
            tag_string = tag_string + "'" + temp + "'" +  ', ';
        } else {
            tag_string = tag_string + "'" + temp + "'" + ')';
        }
    }

    console.log({tag_string});


    // DEFAULT DISTANCE
    //let order_key = req.params.order_key;
    let order_val = req.params.order_key;
    let order_key = 'distance';
    if(order_val === "MedianHomeValue"){
        order_key = '2021_02';
    }else if (order_val === 'AverageBusinessRating'){
        order_key = 'AVG(stars)';
    }else if (order_val === 'Distance'){
        order_key = 'distance';
    }else if (order_val === 'BusinessRating'){
        order_key = 'stars';
    }

    // DEFAULT ASC
    //let order_direction = req.params.order_direction;
    let order_direction = req.params.order_direction;

    let gfk = req.params.gfk;
    let gfd = req.params.gfd;
    let da = req.params.da;
    let wa = req.params.wa;
    let gfb = req.params.gfb;
    let rd = req.params.rd;



    let query = '';

    if (gfk > 0 || gfd > 0 || da > 0 || wa > 0 || gfb > 0 || rd > 0) {
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
        FROM ` + (req.params.attribute === "undefined" ? `GoodForKids ` : `${attribute} `) + 
        `WHERE percentile >= .7),
        budget AS
        (SELECT zip, 2021_02
        FROM home_values
        WHERE 2021_02 BETWEEN ${minBudget} AND ${maxBudget}),
        c_scores AS
            (SELECT a1.zipcode as zip, (${gfk} * a1.percentile + ${gfd} * a2.percentile + ${wa} * a3.percentile + ${da} * a4.percentile + ${gfb} * a5.percentile + ${rd} * a6.percentile)*100 AS comScore
            FROM GoodForKids a1 
            JOIN GoodForDancing a2 ON a1.zipcode = a2.zipcode
            JOIN WheelchairAccessible a3 ON a1.zipcode = a3.zipcode
            JOIN DogsAllowed a4 ON a1.zipcode = a4.zipcode
            JOIN GoodForBikers a5 ON a1.zipcode = a5.zipcode
            JOIN RestaurantDelivery a6 ON a1.zipcode = a6.zipcode)
        SELECT z.zip, z.city, z.state, z.county, 2021_02 AS MedianHomeValue, AVG(stars) AS avgBusinessRating, cs.comScore AS 'Compatibility Score'
        FROM zipcode z
        JOIN c_scores cs ON z.zip = cs.zip
        JOIN coordinates c ON c.zip = z.zip 
        LEFT OUTER JOIN attribute a ON z.zip= a.zipcode
        LEFT OUTER JOIN budget h ON z.zip = h.zip 
        LEFT OUTER JOIN business b ON z.zip=b.postal_code
        WHERE 2021_02 BETWEEN ${minBudget} AND ${maxBudget} `
            + (req.params.attribute === "undefined" ? `` : ` AND percentile >= .7`)
            + `GROUP BY z.zip
        ORDER BY comScore DESC
        LIMIT 50;`
    } else if (bus_or_zip === 'zip') {
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
        FROM ` + (req.params.attribute === "undefined" ? `GoodForKids ` : `${attribute} `) + 
        `WHERE percentile >= .7),
        budget AS
        (SELECT zip, 2021_02
        FROM home_values
        WHERE 2021_02 BETWEEN ${minBudget} AND ${maxBudget})
        SELECT z.zip, z.city, z.state, z.county, 2021_02 AS MedianHomeValue, AVG(stars) AS avgBusinessRating
        FROM zipcode z
        JOIN coordinates c ON c.zip = z.zip 
        LEFT OUTER JOIN attribute a ON z.zip= a.zipcode
        LEFT OUTER JOIN budget h ON z.zip = h.zip 
        LEFT OUTER JOIN business b ON z.zip=b.postal_code
        WHERE 2021_02 BETWEEN ${minBudget} AND ${maxBudget}`
                + (req.params.attribute === "undefined" ? `` : ` AND percentile >= .7`)
                + ` GROUP BY z.zip
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
        FROM business
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
    SELECT b.name, b.city, b.state, b.postal_code AS zip, z.county, b.stars AS 'rating'
    FROM zipcode z
    LEFT OUTER JOIN budget h ON z.zip = h.zip
    JOIN business b ON b.postal_code = z.zip
    JOIN coordinates c ON b.business_id = c.id
    WHERE 2021_02 BETWEEN ${minBudget} AND ${maxBudget} `
            + (req.params.attribute === "undefined" ? `` : `AND ${attribute_db} = 'True' `)
    + (tag_array === [] ? `` : `AND EXISTS (SELECT * FROM business_categories WHERE business_id = b.business_id AND categories IN ${tag_string}) `) +
    `ORDER BY ${order_key} ${order_direction} LIMIT 50;`
    }

    connection.query(query, function(err, rows, fields) {
        if (err) {
            console.log("Woops");
            console.log(err);
        } else {
            console.log('Success!');
            console.log(rows);
            res.json(rows);
        }
    })
}

app.get('/search/:latitude/:longitude/:radius/:minBudget/:maxBudget/:bus_or_zip/:attribute/:order_key/:order_direction/:gfk/:gfd/:wa/:da/:gfb/:rd/:tags', search);


/********** LOCAL_BUSINESSES ***********/

const locals = (req, res) => {


    //DEFAULTS SET TO PHOENIX COORDINATES, TO GUIDE USERS INITIALLY TOWARD AREA WHERE WE HAVE MOST BUSINESS INFO
    //DEFAULT 33.44
    let latitude = req.params.latitude ;
    //DEFAULT 112.07
    let longitude = req.params.longitude ;

    //DEFAULT 25000
    let radius = req.params.radius ;


    let query = `
    WITH coordinates AS
        (SELECT business_id AS id,
        69 * DEGREES(acos( 
        cos( radians(latitude) ) *
        cos( radians(${latitude}) ) * 
        cos( radians(${longitude}) - radians(longitude ) ) +
        sin( radians( latitude ) ) * 
        sin( radians(${latitude}) ) ) )  as distance
        FROM business
        WHERE 69 * DEGREES(acos( 
        cos( radians(latitude) ) *
        cos( radians(${latitude}) ) * 
        cos( radians(${longitude}) - radians(longitude ) ) +
        sin( radians(latitude) ) * 
        sin( radians(${latitude}) ) ) ) <= ${radius})
    SELECT name, city, state, postal_code AS zip, stars AS 'rating'
    FROM business b
    JOIN coordinates c ON b.business_id = c.id
    WHERE NOT EXISTS (SELECT * FROM business b2 WHERE b.name=b2.name AND b.business_id <> b2.business_id)
    ORDER BY distance ASC, b.name ASC
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

app.get('/locals/:latitude/:longitude/:radius', locals);

/********** Restaurants ***********/

const restaurants = (req, res) => {

    //DEFAULTS SET TO PHOENIX COORDINATES, TO GUIDE USERS INITIALLY TOWARD AREA WHERE WE HAVE MOST BUSINESS INFO
    //DEFAULT 33.44
    let latitude = req.params.latitude;
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
    let attribute_tbl = req.params.attribute;


    // DEFAULT DISTANCE
    //let order_key = req.params.order_key;
    let order_val = req.params.order_key;
    let order_key = 'distance';
    if(order_val === "MedianHomeValue"){
        order_key = '2021_02';
    }else if (order_val === 'AverageBusinessRating'){
        order_key = 'AVG(stars)';
    }else if (order_val === 'Distance'){
        order_key = 'distance';
    }else if (order_val === 'BusinessRating'){
        order_key = 'stars';
    }

    // DEFAULT ASC
    //let order_direction = req.params.order_direction;
    let order_direction = req.params.order_direction;

    //DEFAULT 1
    let rating = req.params.rating;
    let r_price = req.params.r_price;
    let r_count = req.params.r_count;

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
        FROM ` + (req.params.attribute === "undefined" ? `GoodForKids ` : `${attribute} `) + 
        `WHERE percentile >= .7),
        budget AS
        (SELECT zip, 2021_02
        FROM home_values
        WHERE 2021_02 BETWEEN ${minBudget} AND ${maxBudget}),
        business_count AS
        (SELECT postal_code, COUNT(business_id) AS bcount
        FROM business
        GROUP BY postal_code)
        SELECT z.zip, z.city, z.state, z.county, AVG(stars) AS avgBusinessRating, AVG(attributesRestaurantsPriceRange) AS 'Average Price ($ - $$$$)', COUNT(attributesRestaurantsPriceRange) AS '# Restaurants Listed', 2021_02 AS MedianHomeValue
        FROM zipcode z
        JOIN coordinates c ON c.zip = z.zip 
        LEFT OUTER JOIN attribute a ON z.zip= a.zipcode
        LEFT OUTER JOIN budget h ON z.zip = h.zip 
        JOIN business_count bc ON z.zip=bc.postal_code
        JOIN business b ON z.zip=b.postal_code
        WHERE 2021_02 BETWEEN ${minBudget} AND ${maxBudget}`
                + (req.params.attribute_tbl === "undefined" ? `` : ` AND percentile >= .7 `)
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

app.get('/restaurants/:latitude/:longitude/:radius/:minBudget/:maxBudget/:bus_or_zip/:attribute/:order_key/:order_direction/:rating/:r_price/:r_count', restaurants);






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