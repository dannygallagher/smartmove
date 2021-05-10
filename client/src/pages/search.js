import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper, Divider, TextField, Checkbox, Select, MenuItem, FormControl, InputLabel, Button, Box } from '@material-ui/core';
import Map from "../components/map";
import {SearchResultsHeader, SearchResultsRow} from "../components/searchresults";
import Details from "./details";
import Image from '../Styles/city_warm.jpg';

export default function Search() {
    
    // Map view initial state
    const initialViewState = {
        latitude: 39,
        longitude: -99,
        zoom: 3.3,
        pitch: 0,
        bearing: 0
    };

    // Initial optional result field selection for zip search
    const initialResultFieldsZip = {
        medianHouseValue: false,
        medianRentalIndex: false,
        attributeRanking: true,
        avgBusinessRating: true,
        totalPopulation: true,
    } 

    // Attributes initial state
    const initialAttributesState = {
        GoodForKids: 0,
        GoodForDancing: 0,
        DogsAllowed: 0,
        WheelchairAccessible: 0,
        GoodForBikers: 0,
        RestaurantDelivery: 0
    };

    // Tags initial state
    const initialTagsState = {
        "Restaurants": false,
        "Shopping": false,
        "Home Services": false,
        "Food": false,
        "Health & Medical": false,
        "Beauty & Spas": false,
        "Local Services": false,
        "Automotive": false,
        "Event Planning & Services": false,
        "Active Life": false,
    };

    // Tags list
    const tagsList = ["Restaurants", "Shopping", "Home Services", "Food", "Health & Medical", 
    "Beauty & Spas", "Local Services", "Automotive", "Event Planning & Services", "Active Life"];

    
    // HOOKS
    // Map view state
    const [viewState, setViewState] = useState(initialViewState);
    // User input variables
    const [dealBreaker, setDealBreaker] = useState();
    const [zipOrBusiness, setZipOrBusiness] = useState("zip");
    const [radius, setRadius] = useState(25000);
    const [location, setLocation] = useState();
    const [locationType, setLocationType] = useState("zip");
    const [longitude, setLongitude] = useState(-112.07);
    const [latitude, setLatitude] = useState(33.44);
    const [minBudget, setMinBudget] = useState(0);
    const [maxBudget, setMaxBudget] = useState(999999999);
    const [errorMessage, setErrorMessage] = useState("");
    const [attributes, setAttributes] = useState(initialAttributesState);
    const [tags, setTags] = useState(initialTagsState);
    const [restaurantPrice, setRestaurantPrice] = useState(1);
    const [restaurantStars, setRestaurantStars] = useState(1);
    const [restaurantMin, setRestaurantMin] = useState(0);
    const [restaurantPriceError, setRestaurantPriceError] = useState("");
    const [restaurantStarsError, setRestaurantStarsError] = useState("");
    const [restaurantMinError, setRestaurantMinError] = useState("");
    const [orderKey, setOrderKey] = useState("MedianHomeValue");
    const [orderDirection, setOrderDirection] = useState("ASC");
    // Result fields (headers)
    const [resultFieldsZip, setResultFieldsZip] = useState(initialResultFieldsZip);
    // Output
    const [showResults, setShowResults] = useState(false);
    const [outputZip, setOutputZip] = useState();
    const [outputBusiness, setOutputBusiness] = useState();
    const [searchResults, setSearchResults] = useState([]);
    const [localBusiness, setLocalBusiness] = useState();
    // Showing Details page
    const [zip, setZip] = useState();
    const [showDetails, setShowDetails] = useState(false);

    //SAMPLE OUTPUT
    let sampleZipOutput = {
        zip: '08302',
        city: 'Phoenix',
        state: 'AZ',
        county: 'Random',
        medianHouseValue: 1000,
        attributeRanking: 3,
        avgBusinessRating: 5,
        distance: 100
    }
    let sampleBusinessOutput = {
        name: 'McDonalds',
        zip: '08302',
        city: 'Phoenix',
        state: 'AZ',
        county: 'Random',
        rating: 5,
        distance: 100
    }

    // Function for obtaining latitude and longitude when user clicks on a point on the map
    const mapClickHandler = (info) => {
        console.log("Longitude: " + info.coordinate[0]);
        console.log("Latitude: " + info.coordinate[1]);
        setLongitude(info.coordinate[0]);
        setLatitude(info.coordinate[1]);
    }

    const zoomQuery = () => {
        fetch(`http://localhost:4000/search/${location}/${locationType}`,
        {
            method: 'GET',
        }).then(res => {
            return res.json();
        }).catch((err) => {
            console.log(err)
        }).then(coordinates => {
            if (coordinates[0] === undefined){
                setErrorMessage("Invalid Location")
                return;
            }
            setLatitude(coordinates[0].latitude);
            setLongitude(coordinates[0].longitude);
            setViewState({
                latitude: coordinates[0].latitude,
                longitude: coordinates[0].longitude,
                zoom: 5,
                pitch: 0,
                bearing: 0
            });
            setErrorMessage("");
        });
    }

    // General search query
    const generalSearchQuery = () => {

        let tagString = (tags["Restaurants"] ? "Restaurants-" : "") + (tags["Shopping"] ? "Shopping-" : "") + (tags["Home Services"] ? "HomeServices-" : "") + (tags["Food"] ? "Food-" : "") + (tags["Health & Medical"] ? "Health&Medical-" : "") + (tags["Beauty & Spas"] ? "Beauty&Spas-" : "") + (tags["Local Services"] ? "LocalServices-" : "") + (tags["Automotive"] ? "Automotive-" : "") + (tags["Event Planning & Services"] ? "EventPlanning&Services-" : "") + (tags["Active Life"] ? "ActiveLife-" : "");

        if (tagString !== "") {
            tagString = tagString.slice(0, -1);
        }

        console.log({tagString});


        fetch(`http://localhost:4000/search/${latitude}/${longitude}/${radius}/${minBudget}/${maxBudget}/${zipOrBusiness}/${dealBreaker}/${orderKey}/${orderDirection}/${attributes.GoodForKids}/${attributes.GoodForDancing}/${attributes.WheelchairAccessible}/${attributes.DogsAllowed}/${attributes.GoodForBikers}/${attributes.RestaurantDelivery}/${tagString}`,
        {
            method: 'GET',
        }).then(res => {
            return res.json();
        }).catch((err) => {
            console.log(err)
        }).then(resultsList => {
            console.log(resultsList);
            console.log("Reached here!!!")

            const resultsRows = resultsList.map((output, i) => {
                return (
                    <SearchResultsRow zipOrBusiness={zipOrBusiness} output={output} setShowDetails={setShowDetails} setZip={setZip} />
                )
            })
            
            setSearchResults(resultsRows);
            
            console.log("Search page");
            console.log(resultsRows);
            console.log(searchResults);
        });
    }

    const foodQuery = () => {
        fetch(`http://localhost:4000/restaurants/${latitude}/${longitude}/${radius}/${minBudget}/${maxBudget}/${zipOrBusiness}/${dealBreaker}/${orderKey}/${orderDirection}/${restaurantStars}/${restaurantPrice}/${restaurantMin}`,
        {
            method: 'GET',
        }).then(res => {
            return res.json();
        }).catch((err) => {
            console.log(err)
        }).then(resultsList => {
            console.log(resultsList);
            const resultsRows = resultsList.map((output, i) => {
                return (
                    <SearchResultsRow zipOrBusiness={zipOrBusiness} output={output} setShowDetails={setShowDetails} setZip={setZip} />
                )
            })
            setSearchResults(resultsRows);
        });
    };

    const findLocalBusinesses = () => {
        fetch(`http://localhost:4000/locals/${latitude}/${longitude}/${radius}`,
        {
            method: 'GET',
        }).then(res => {
            return res.json();
        }).catch((err) => {
            console.log(err)
        }).then(resultsList => {
            console.log(resultsList);
            const resultsRows = resultsList.map((output, i) => {
                return (
                    <SearchResultsRow zipOrBusiness={zipOrBusiness} output={output} setShowDetails={setShowDetails} setZip={setZip} />
                )
            })
            
            setSearchResults(resultsRows);
        });
    };

    const zipOrBusinessHandler = (e) => {
        console.log(e.target.value);
        setZipOrBusiness(e.target.value);
    }

    const restaurantPriceErrorHandler = (e) => {
        setRestaurantPrice(e.target.value);
        if (e.target.value < 1 || e.target.value > 4){
            setRestaurantPriceError("Restaurant price must be between 1 and 4, inclusive");
        } else {
            setRestaurantPriceError("");
        }
    };

    const restaurantStarsErrorHandler = (e) => {
        setRestaurantStars(e.target.value);
        if (e.target.value < 1 || e.target.value > 5){
            setRestaurantStarsError("Restaurant quality must be between 1 and 5, inclusive");
        } else {
            setRestaurantStarsError("");
        }
    };

    const restaurantMinErrorHandler = (e) => {
        setRestaurantMin(e.target.value);
        if (e.target.value < 0){
            setRestaurantMinError("Number of restaurants must be non-negative");
        } else {
            setRestaurantMinError("");
        }
    };

    // Styling for grid layout on Search page
    const useStyles = makeStyles((theme) => ({
        root: {
            flexGrow: 1,
            padding: theme.spacing(2),
            backgroundImage: `url(${Image})`
        },
        gridGeneral: {
            flexGrow: 1,
            padding: theme.spacing(2),
            backgroundImage: `url(${Image})`
        },
        gridTop: {
            width: '100%',
            marginTop: '30px',
        },
        gridButton: {
            paddingLeft: "20px",
            paddingTop: '20px',
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
            backgroundColor: "rgba(245,245,245,1)"
        },
        divider: {
            margin: theme.spacing(2,0)
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
          },
    }))

    const classes = useStyles();

    return (
        (showDetails) ?
            <Details zip={zip} setShowDetails={setShowDetails}/>
            :
            <div className={classes.root}>
                <div>{showDetails}</div>
                
                <Grid container spacing={3}>
                    <Grid item xs>
                        <Grid container direction="column" spacing={3}>
                            <Grid item xs>
                                <Paper className={classes.paper}>
                                    <div><h3>Search Center</h3></div>
                                    <div><p>Please click on map to populate coordinates</p></div>

                                    <div></div>
                                    
                                    <TextField
                                    id="location"
                                    label="Location"
                                    value={location}
                                    onChange={e => setLocation(e.target.value)}
                                    margin="dense"
                                    />

                                    <div></div>

                                    <select onChange={e => setLocationType(e.target.value)}>
                                    <option value="zip">Zipcode</option>
                                    <option value="city">City</option>
                                    <option value="state">State</option>
                                    </select>

                                    <button onClick={zoomQuery}>Zoom</button>

                                    <div><p>{errorMessage}</p></div>

                                    <TextField
                                    id="latitude"
                                    required
                                    label="Latitude"
                                    value={latitude || ''}
                                    onChange={e => setLatitude(e.target.value)}
                                    margin="dense"
                                    />

                                    <div></div>

                                    <TextField
                                    id="longitude"
                                    required
                                    label="Longitude"
                                    value={longitude || ''}
                                    onChange={e => setLongitude(e.target.value)}
                                    margin="dense"
                                    />

                                    <div></div>

                                    <TextField
                                    id="radius"
                                    required
                                    label="Radius"
                                    value={radius}
                                    onChange={e => setRadius(e.target.value)}
                                    margin="dense"
                                    />

                                    <div></div>
                                </Paper>
                            </Grid>
                            <Grid item >
                            <Paper className={classes.paper}>
                                    <div><h3>Preferences</h3></div>
                                    <div><p>Please assign relative priority numbers to each/any of the following preferences</p></div>


                                    <TextField
                                    id="good-for-kids"
                                    label="Good For Kids"
                                    value={attributes.GoodForKids}
                                    onChange={e => setAttributes(prevState => {return {...prevState, GoodForKids: e.target.value}})}
                                    margin="dense"
                                    />

                                    <TextField
                                    id="good-for-dancing"
                                    label="Good For Dancing"
                                    value={attributes.GoodForDancing}
                                    onChange={e => setAttributes(prevState => {return {...prevState, GoodForDancing: e.target.value}})}
                                    margin="dense"
                                    />
                                    
                                    <TextField
                                    id="dogs-allowed"
                                    label="Dogs Allowed"
                                    value={attributes.DogsAllowed}
                                    onChange={e => setAttributes(prevState => {return {...prevState, DogsAllowed: e.target.value}})}
                                    margin="dense"
                                    />

                                    <TextField
                                    id="wheelchair-accessible"
                                    label="Wheelchair Accessible"
                                    value={attributes.WheelchairAccessible}
                                    onChange={e => setAttributes(prevState => {return {...prevState, WheelchairAccessible: e.target.value}})}
                                    margin="dense"
                                    /> 

                                    <TextField
                                    id="good-for-bikers"
                                    label="Good For Bikers"
                                    value={attributes.GoodForBikers}
                                    onChange={e => setAttributes(prevState => {return {...prevState, GoodForBikers: e.target.value}})}
                                    margin="dense"
                                    />

                                    <TextField
                                    id="restaurant-delivery"
                                    label="Restaurant Delivery"
                                    value={attributes.RestaurantDelivery}
                                    onChange={e => setAttributes(prevState => {return {...prevState, RestaurantDelivery: e.target.value}})}
                                    margin="dense"
                                    />   

                                </Paper>
                                &nbsp;
                                <Grid>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Button variant="contained" color='secondary' onClick={generalSearchQuery}>
                                            SEARCH!
                                        </Button>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    
                    <Grid item xs>
                        <Grid container direction="column" spacing={3}> 
                            <Grid item xs>
                            <Paper className={classes.paper}>
                                    <div><h3>Filters</h3></div>
                                    
                                    <TextField
                                    id="min-budget"
                                    label="Min Budget"
                                    value={minBudget}
                                    onChange={e => setMinBudget(e.target.value)}
                                    margin="dense"
                                    />

                                    <div></div>

                                    <TextField
                                    id="max-budget"
                                    label="Max Budget"
                                    value={maxBudget}
                                    onChange={e => setMaxBudget(e.target.value)}
                                    margin="dense"
                                    />

                                    <div></div>
                                    
                                    <FormControl className={classes.formControl}>
                                        <InputLabel id="demo-simple-select-label">Search Type</InputLabel>
                                        <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={zipOrBusiness}
                                        onChange={zipOrBusinessHandler}
                                        >
                                            <MenuItem value="zip">Zip Code</MenuItem>
                                            <MenuItem value="business">Business</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <FormControl className={classes.formControl}>
                                        <InputLabel id="deal-breaker">Must-Have</InputLabel>
                                        <Select
                                        labelId="deal-breaker-label"
                                        id="deal-breaker"
                                        value={dealBreaker}
                                        onChange={(e) => {setDealBreaker(e.target.value)}}
                                        >
                                            <MenuItem value="GoodForKids">Good For Kids</MenuItem>
                                            <MenuItem value="GoodForDancing">Good For Dancing</MenuItem>
                                            <MenuItem value="DogsAllowed">Dogs Allowed</MenuItem>
                                            <MenuItem value="WheelchairAccessible">Wheelchair Accessible</MenuItem>
                                            <MenuItem value="GoodForBikers">Good For Bikers</MenuItem>
                                            <MenuItem value="RestaurantDelivery">Restaurant Delivery</MenuItem>
                                        </Select>
                                    </FormControl>

                                    {zipOrBusiness === 'zip' && <FormControl className={classes.formControl}>
                                        <InputLabel id="order-key-dropdown">Order By...</InputLabel>
                                        <Select
                                        labelId="order-key-label"
                                        id="order-key"
                                        value={orderKey}
                                        onChange={(e) => {setOrderKey(e.target.value)}}
                                        >
                                            <MenuItem value="MedianHomeValue">Median Home Value</MenuItem>
                                            <MenuItem value="AverageBusinessRating">Average Business Rating</MenuItem>
                                            <MenuItem value="Distance">Distance</MenuItem>
                                        </Select>
                                    </FormControl>}
                                    {zipOrBusiness === 'business' && <FormControl className={classes.formControl}>
                                        <InputLabel id="order-key-dropdown">Order By...</InputLabel>
                                        <Select
                                        labelId="order-key-label"
                                        id="order-key"
                                        value={orderKey}
                                        onChange={(e) => {setOrderKey(e.target.value)}}
                                        >
                                            <MenuItem value="BusinessRating">Business Rating</MenuItem>
                                            <MenuItem value="Distance">Distance</MenuItem>
                                        </Select>
                                    </FormControl>}

                                    <FormControl className={classes.formControl}>
                                        <InputLabel id="order-direction-dropdown">Order Direction</InputLabel>
                                        <Select
                                        labelId="order-direction-label"
                                        id="order-direction"
                                        value={orderDirection}
                                        onChange={(e) => {setOrderDirection(e.target.value)}}
                                        >
                                            <MenuItem value="ASC">Ascending</MenuItem>
                                            <MenuItem value="DESC">Descending</MenuItem>
                                        </Select>
                                    </FormControl>

                                </Paper>
                            </Grid>
                            <Grid item>
                                <Paper className={classes.paper} >
                                    <div><h3>Tags</h3></div>

                                    <div>
                                    <label>
                                    <Checkbox
                                    checked={tags["Restaurants"]}
                                    onChange={e => setTags(prevState => {return {...prevState, Restaurants: !tags["Restaurants"]}})}
                                    />
                                    <span>Restaurants</span>
                                    </label>
                                    </div>   

                                    <div>
                                    <label>
                                    <Checkbox
                                    checked={tags["Shopping"]}
                                    onChange={e => setTags(prevState => {return {...prevState, Shopping: !tags["Shopping"]}})}
                                    />
                                    <span>Shopping</span>
                                    </label>
                                    </div>   

                                    <div>
                                    <label>
                                    <Checkbox
                                    checked={tags["Home Services"]}
                                    onChange={e => setTags(prevState => {return {...prevState, "Home Services": !tags["Home Services"]}})}
                                    />
                                    <span>Home Services</span>
                                    </label>
                                    </div>  

                                    <div>
                                    <label>
                                    <Checkbox
                                    checked={tags["Food"]}
                                    onChange={e => setTags(prevState => {return {...prevState, Food: !tags["Food"]}})}
                                    />
                                    <span>Food</span>
                                    </label>
                                    </div>  

                                    <div>
                                    <label>
                                    <Checkbox
                                    checked={tags["Health & Medical"]}
                                    onChange={e => setTags(prevState => {return {...prevState, "Health & Medical": !tags["Health & Medical"]}})}
                                    />
                                    <span>Health &amp; Medical</span>
                                    </label>
                                    </div>  

                                    <div>
                                    <label>
                                    <Checkbox
                                    checked={tags["Beauty & Spas"]}
                                    onChange={e => setTags(prevState => {return {...prevState, "Beauty & Spas": !tags["Beauty & Spas"]}})}
                                    />
                                    <span>Beauty &amp; Spas</span>
                                    </label>
                                    </div>  

                                    <div>
                                    <label>
                                    <Checkbox
                                    checked={tags["Local Services"]}
                                    onChange={e => setTags(prevState => {return {...prevState, "Local Services": !tags["Local Services"]}})}
                                    />
                                    <span>Local Services</span>
                                    </label>
                                    </div>  

                                    <div>
                                    <label>
                                    <Checkbox
                                    checked={tags["Automotive"]}
                                    onChange={e => setTags(prevState => {return {...prevState, "Automotive": !tags["Automotive"]}})}
                                    />
                                    <span>Automotive</span>
                                    </label>
                                    </div> 

                                    <div>
                                    <label>
                                    <Checkbox
                                    checked={tags["Event Planning & Services"]}
                                    onChange={e => setTags(prevState => {return {...prevState, "Event Planning & Services": !tags["Event Planning & Services"]}})}
                                    />
                                    <span>Event Planning &amp; Services</span>
                                    </label>
                                    </div> 

                                    <div>
                                    <label>
                                    <Checkbox
                                    checked={tags["Active Life"]}
                                    onChange={e => setTags(prevState => {return {...prevState, "Active Life": !tags["Active Life"]}})}
                                    />
                                    <span>Active Life</span>
                                    </label>
                                    </div>   
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={6}>
                        <Grid container direction="column" spacing={3}>
                            <Grid item xs>
                                <Box height={600} >
                                    <Map 
                                        viewState={viewState}
                                        setViewState={setViewState}
                                        mapClickHandler={mapClickHandler}
                                    />
                                </Box> 
                            </Grid>
                            <Grid item xs>
                                <Paper className={classes.paper}>
                                    <div><h2>SmartMove's Signature Searches</h2></div>
                                    <div><h3>Filters for Foodies (Find Regions Based on Their Food)</h3></div>

                                    <TextField
                                    id="restaurant-price"
                                    label="Maximum Avg Restaurant Price (1-4: $-$$$$)"
                                    value={restaurantPrice}
                                    onChange={e => restaurantPriceErrorHandler(e)}
                                    margin="dense"
                                    error = {restaurantPrice < 1 || restaurantPrice > 4}
                                    helperText = {restaurantPriceError}
                                    />

                                    <TextField
                                    id="restaurant-stars"
                                    label="Minimum Avg Restaurant Quality (1-5 Stars)"
                                    value={restaurantStars}
                                    onChange={e => restaurantStarsErrorHandler(e)}
                                    margin="dense"
                                    error = {restaurantStars < 1 || restaurantStars > 5}
                                    helperText = {restaurantStarsError}
                                    />

                                    <TextField
                                    id="restaurant-min"
                                    label="Minimum Number of Restaurants in Area"
                                    value={restaurantMin}
                                    onChange={e => restaurantMinErrorHandler(e)}
                                    margin="dense"
                                    error = {restaurantMin < 0}
                                    helperText = {restaurantMinError}
                                    />
                                    <div></div>
                                    <Button variant="contained" color='secondary' onClick={foodQuery}>Find Some Food!</Button>

                                    <div><h3>Find One-of-a-Kind Businesses (requires search-type Business)</h3></div>

                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Button variant="contained" color='secondary' onClick={findLocalBusinesses}>Let's Go!</Button>
                                    </div>

                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
               
                <Grid container spacing={4}>
                    <Grid item xs>
                        <Paper className={classes.paper}>
                            <div><h2>Results</h2></div>
                            <SearchResultsHeader zipOrBusiness={zipOrBusiness} resultFieldsZip={resultFieldsZip} />
                            <div>
                                {searchResults}
                            </div>
                        </Paper>
                    </Grid>
                    
                </Grid>
            </div>
    )
}




                        