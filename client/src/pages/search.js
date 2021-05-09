import React, { useState, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { LineLayer, TextLayer, PathLayer, ScatterplotLayer } from '@deck.gl/layers';
import { StaticMap, ReactMapGL, Marker } from 'react-map-gl';
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper, Divider } from '@material-ui/core';

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

    // Hook for managing map view state
    const [viewState, setViewState] = useState(initialViewState);

    const mapClickHandler = (info) => {
        console.log("Longitude: " + info.coordinate[0]);
        console.log("Latitude: " + info.coordinate[1]);
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
            <Grid container spacing={4} className={classes.gridGeneral}>   
                <Grid item xs={12} md={4} className={classes.gridTop}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <div>Radius</div>
                            <div>Latitude</div>
                            <div>Longitude</div>
                            <div>Budget</div>
                            <div>Attribute</div>
                            <div>City</div>
                            <div>State</div>
                        </Paper>
                    </Grid>
                    <Divider className={classes.divider} />
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <div>More Attributes</div>
                            <div>More Attributes</div>
                            <div>More Attributes</div>
                            <div>More Attributes</div>
                            <div>More Attributes</div>
                            <div>More Attributes</div>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} className={classes.gridButton}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <button>Advanced Filters</button>
                        </div>
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
                                position: 'relative', width: '100%', height: '100%', margin: '15px'
                            }}>
                            <StaticMap 
                                mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
                                mapStyle="mapbox://styles/mapbox/streets-v11"
                            />
                        </DeckGL>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Paper className={classes.paper}></Paper>
                </Grid>
            </Grid>
        </div>
    )
}