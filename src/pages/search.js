import React, { useState } from 'react';
import DeckGL from '@deck.gl/react';
import { LineLayer, TextLayer, PathLayer, ScatterplotLayer } from '@deck.gl/layers';
import { StaticMap, ReactMapGL, Marker } from 'react-map-gl';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoiaml3b25pZTExIiwiYSI6ImNrbnV2eWg0bDBlZnUyd3BqcXN4cGRwMTIifQ.mM4cn9MeLMvpAgOeZsfovA';

export default function Search() {
    
    // Map view initial state
    const initialViewState = {
        latitude: 39,
        longitude: -96,
        zoom: 3.8,
        pitch: 0,
        bearing: 0
    };

    // Hook for managing map view state
    const [viewState, setViewState] = useState(initialViewState);

    const mapClickHandler = (info) => {
        console.log("Longitude: " + info.coordinate[0]);
        console.log("Latitude: " + info.coordinate[1]);
    }

    return (
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
                    position: 'absolute', left: '10%', right: '10%', top: '10%'
                }}>
                <StaticMap 
                    mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
                    mapStyle="mapbox://styles/mapbox/streets-v11"
                />
            </DeckGL>
        </div>
    )
}