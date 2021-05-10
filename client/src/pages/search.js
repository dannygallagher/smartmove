import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper, Divider, TextField, Checkbox, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import Map from "../components/map";
import {SearchResultsHeader, SearchResultsRow} from "../components/searchresults";
import Details from "./details";

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
    const [zipOrBusiness, setZipOrBusiness] = useState("zip");
    const [radius, setRadius] = useState();
    const [location, setLocation] = useState();
    const [locationType, setLocationType] = useState("zip");
    const [longitude, setLongitude] = useState();
    const [latitude, setLatitude] = useState();
    const [minBudget, setMinBudget] = useState();
    const [maxBudget, setMaxBudget] = useState();
    const [errorMessage, setErrorMessage] = useState("");
    const [attributes, setAttributes] = useState(initialAttributesState);
    const [tags, setTags] = useState(initialTagsState);
    // Result fields (headers)
    const [resultFieldsZip, setResultFieldsZip] = useState(initialResultFieldsZip);
    // Output
    const [showResults, setShowResults] = useState(false);
    const [outputZip, setOutputZip] = useState([]);
    const [outputBusiness, setOutputBusiness] = useState([]);
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
        medianRentalIndex: 1000,
        attributeRanking: 3,
        avgBusinessRating: 5,
        totalPopulation: 1000
    }
    let sampleBusinessOutput = {
        name: 'McDonalds',
        zip: '08302',
        city: 'Phoenix',
        state: 'AZ',
        county: 'Random',
        rating: 5
    }



    // REMOVE EVENTUALLY
    const loadSampleOutput = () => {
        
        setOutputZip([...outputZip, sampleZipOutput]);
        setOutputBusiness([...outputBusiness, sampleBusinessOutput]);

        console.log(outputZip);
        console.log(outputBusiness);
        setShowResults(true);
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



    const zipOrBusinessHandler = (e) => {
        console.log(e.target.value);
        setZipOrBusiness(e.target.value);
    }


    // Styling for grid layout on Search page
    const useStyles = makeStyles((theme) => ({
        gridGeneral: {
            width: '100%',
            paddingLeft: '30px',
            paddingRight: '20px'
        },
        gridTop: {
            width: '100%',
            marginTop: '30px',
        },
        gridButton: {
            justifyContent: 'center',
            paddingTop: '20px'
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            background: theme.palette.action.hover,
            boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.3)'
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
            <div>
                <div>{showDetails}</div>
                <Grid container spacing={4} className={classes.gridGeneral}>
                    <Grid item xs={12} md={3} className={classes.gridTop}>
                        <Grid item xs={12}>
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
                            </Paper>
                        </Grid>
                        <Divider className={classes.divider} />
                        <Grid item xs={12}>
                            <Paper className={classes.paper}>
                                <div><h3>Filters</h3></div>
                                <TextField
                                id="radius"
                                required
                                label="Radius"
                                value={radius}
                                onChange={e => setRadius(e.target.value)}
                                margin="dense"
                                />

                                <div></div>
                                
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

                            </Paper>
                        </Grid>
                        <Divider className={classes.divider} />
                        <Grid item xs={12}>
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
                        </Grid>
                        <Grid item xs={12} className={classes.gridButton}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <button onClick={loadSampleOutput}>Search</button>
                            </div>
                        </Grid>
                        <Divider className={classes.divider} />
                        <Grid item xs={12}>
                            <Paper className={classes.paper}>
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
                    <Grid item xs={12} md={8}>
                        <Map 
                            viewState={viewState}
                            setViewState={setViewState}
                            mapClickHandler={mapClickHandler}
                        />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Paper className={classes.paper}>
                            <div><h2>Results</h2></div>
                            <SearchResultsHeader zipOrBusiness={zipOrBusiness} resultFieldsZip={resultFieldsZip} />
                            <div>
                                {showResults && zipOrBusiness === "zip" && outputZip.map((output) => (
                                    <SearchResultsRow zipOrBusiness={zipOrBusiness} resultFieldsZip={resultFieldsZip} output={output} setShowDetails={setShowDetails} zip={zip} setZip={setZip} />
                                ))}
                                {showResults && zipOrBusiness === "business" && outputBusiness.map((output) => (
                                    <SearchResultsRow zipOrBusiness={zipOrBusiness} resultFieldsZip={resultFieldsZip} output={output} />
                                ))}
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
    )
}