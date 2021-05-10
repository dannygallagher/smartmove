import React, { useState, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { LineLayer, TextLayer, PathLayer, ScatterplotLayer } from '@deck.gl/layers';
import { StaticMap, ReactMapGL, Marker } from 'react-map-gl';
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper, Divider, TextField, Checkbox } from '@material-ui/core';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoiaml3b25pZTExIiwiYSI6ImNrbnV2eWg0bDBlZnUyd3BqcXN4cGRwMTIifQ.mM4cn9MeLMvpAgOeZsfovA';

export default function Search() {
    
    // Map view initial state
    const initialViewState = {
        latitude: 39,
        longitude: -99,
        zoom: 3.3,
        pitch: 0,
        bearing: 0
    };

    // Attributes initial state
    const initialAttributesState = {
        GoodForKids: false,
        GoodForDancing: false,
        DogsAllowed: false,
        WheelchairAccessible: false,
        GoodForBikers: false,
        RestaurantDelivery: false
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

    // Hooks for managing map view state
    const [viewState, setViewState] = useState(initialViewState);
    
    const [location, setLocation] = useState();
    const [locationType, setLocationType] = useState("zip");
    const [latitude, setLatitude] = useState();
    const [longitude, setLongitude] = useState();
    const [errorMessage, setErrorMessage] = useState("");


    const [radius, setRadius] = useState();
    const [minBudget, setMinBudget] = useState();
    const [maxBudget, setMaxBudget] = useState();

    const [attributes, setAttributes] = useState(initialAttributesState);
    const [tags, setTags] = useState(initialTagsState);

    // Hooks for performing actions after render

    // Click Handlers

    const mapClickHandler = (info) => {
        console.log("Longitude: " + info.coordinate[0]);
        console.log("Latitude: " + info.coordinate[1]);
        setLongitude(info.coordinate[0]);
        setLatitude(info.coordinate[1]);
        console.log(locationType);


    }


    /***************************** SAMPLE QUERY UPON BUTTON CLICK ****************************/
    const[testResults, setTestResults] = useState([]); //Hook for updating state of some specific results
    const sampleButtonQuery = () => {
        // Send an HTTP request to the server to pull the information for businesses from Phoenix, AZ
        fetch("http://localhost:4000/sample", 
        {
            method: 'GET', // The type of HTTP request
        }).then(res => {
            //console.log(res.json());
            return res.json();
        }).catch((err) => {
            console.log(err)
        }).then(resultsList => {
            const resultsDivs = resultsList.map((result, i) => 
                <div className="results" id="test-results">
                    <div className="name">{result.name}</div>
                    <div className="city">{result.city}</div>
                    <div className="state">{result.state}</div>
                    <div className="zip">{result.zip}</div>
                    <div className="latitude">{result.latitude}</div>
                    <div className="longitude">{result.longitude}</div>
                </div>
            )

            setTestResults(resultsDivs);
        });
    };
    /******************************** END SAMPLE QUERY *******************************************/

    /*
    return (
        <div>
            <div>
                <button onClick={sampleButtonQuery}>Submit</button>
                <div className="test-query-output" id="results">{testResults}</div>
            </div>
            <div>
                <DeckGL
                    className='map'
                    width="80%" 
                    height="80%"
                    viewState={viewState}
                    onViewStateChange={e => setViewState(e.viewState)}
                    controller={true}
                    onHover={event => {}}
                    getCursor={() => {}}
                    onClick={mapClickHandler}
                    style={{
                        //position: 'absolute', left: '10%', right: '10%', top: '10%'
                        position: 'absolute', left: '40%', top: '10%', width: '50%', height: '50%'
                    }}>
                    <StaticMap 
                        mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
                        mapStyle="mapbox://styles/mapbox/streets-v11"
                    />
                </DeckGL>
            </div>
        </div>
    )
*/


    const [searchResults, setSearchResults] = useState([]);
    const searchQuery = () => {

        // setRadius(10);
        // setLongitude(90)
        // setLatitude(-99);
        // const [minBudget, setMinBudget] = useState();
        // const [maxBudget, setMaxBudget] = useState();


        // Send an HTTP request to the server to pull the information for businesses from Phoenix, AZ
        fetch(`http://localhost:4000/search/${latitude}/${longitude}/${radius}/${minBudget}/${maxBudget}`, 
        {
            method: 'GET', // The type of HTTP request
        }).then(res => {
            //console.log(res.json());
            return res.json();
        }).catch((err) => {
            console.log(err)
        }).then(resultsList => {
            const resultsDivs = resultsList.map((result, i) => 
                <div className="results" id="test-results">
                    <div className="name">{result.zip}</div>
                    <div className="city">{result.city}</div>
                    <div className="state">{result.state}</div>
                </div>
            )
            setSearchResults(resultsDivs);
        });
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
            //color: theme.palette.text.secondary,
            background: theme.palette.action.hover,
            //boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)'
            boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.3)'
        },
        divider: {
            margin: theme.spacing(2,0)
        }
    }))



    const classes = useStyles();

    return (
        <div>
            <button onClick={searchQuery}>Search</button>
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
                        </Paper>
                    </Grid>
                    <Divider className={classes.divider} />
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <div><h3>Preferences</h3></div>

                            <div>
                            <label>
                            <Checkbox
                            checked={attributes.GoodForKids}
                            onChange={e => setAttributes(prevState => {return {...prevState, GoodForKids: !attributes.GoodForKids}})}
                            />
                            <span>Good For Kids</span>
                            </label>
                            </div>  

                            <div>
                            <label>
                            <Checkbox
                            checked={attributes.GoodForDancing}
                            onChange={e => setAttributes(prevState => {return {...prevState, GoodForDancing: !attributes.GoodForDancing}})}
                            />
                            <span>Good For Dancing</span>
                            </label>
                            </div>  
                            
                            <div>
                            <label>
                            <Checkbox
                            checked={attributes.DogsAllowed}
                            onChange={e => setAttributes(prevState => {return {...prevState, DogsAllowed: !attributes.DogsAllowed}})}
                            />
                            <span>Dogs Allowed</span>
                            </label>
                            </div>

                            <div>
                            <label>
                            <Checkbox
                            checked={attributes.WheelchairAccessible}
                            onChange={e => setAttributes(prevState => {return {...prevState, WheelchairAccessible: !attributes.WheelchairAccessible}})}
                            />
                            <span>Wheelchair Accessible</span>
                            </label>
                            </div>    

                            <div>
                            <label>
                            <Checkbox
                            checked={attributes.GoodForBiker}
                            onChange={e => setAttributes(prevState => {return {...prevState, GoodForBiker: !attributes.GoodForBiker}})}
                            />
                            <span>Good For Bikers</span>
                            </label>
                            </div>  

                            <div>
                            <label>
                            <Checkbox
                            checked={attributes.RestaurantDelivery}
                            onChange={e => setAttributes(prevState => {return {...prevState, RestaurantDelivery: !attributes.RestaurantDelivery}})}
                            />
                            <span>Restaurant Delivery</span>
                            </label>
                            </div>      

                        </Paper>
                    </Grid>
                    <Grid item xs={12} className={classes.gridButton}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <button>Advanced Filters</button>
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
                        <DeckGL
                            className='map'
                            width="100%" 
                            height="100%"
                            viewState={viewState}
                            onViewStateChange={e => setViewState(e.viewState)}
                            controller={true}
                            onHover={event => {}}
                            getCursor={() => {}}
                            onClick={mapClickHandler}
                            style={{
                                position: 'relative', width: '100%', height: '70%', margin: '15px'
                            }}>
                            <StaticMap 
                                mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
                                mapStyle="mapbox://styles/mapbox/streets-v11"
                            />
                        </DeckGL>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Paper className={classes.paper}>
                        {searchResults}
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}