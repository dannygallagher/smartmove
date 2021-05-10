import * as React from 'react';
import DeckGL from '@deck.gl/react';
import { StaticMap, ReactMapGL, Marker } from 'react-map-gl';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoiaml3b25pZTExIiwiYSI6ImNrbnV2eWg0bDBlZnUyd3BqcXN4cGRwMTIifQ.mM4cn9MeLMvpAgOeZsfovA';

const Map = ({viewState, setViewState, mapClickHandler}) => {

    return (
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
                position: 'relative', width: '100%', height: '60%', margin: '15px'
            }}>
            <StaticMap 
                mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
                mapStyle="mapbox://styles/mapbox/streets-v11"
            />
        </DeckGL>
    )
}

export default Map