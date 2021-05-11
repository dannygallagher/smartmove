# smartmove

## Running & Building
To run the app locally, clone this project into a local directory. After you have cloned the repo, make sure to install the dependencies with `yarn install` in both the server
and client folders; to do this, `cd` into the `smartmove/server` folder and type `yarn install` and then `cd` into the `smartmove/client` folder and type `yarn install` (NOTE: if 
you don't have yarn installed, first type `npm install --global yarn` if you're on Windows or `brew install yarn` if you're on Mac). Note that the `yarn.lock` file maintains a 
version set of all the node dependencies to ensure you are using the same modules. This project includes a number of dependencies, including the following (these should all be 
installed automatically if you run `yarn install` in the client and server folders):

Client:
- @material-ui
- chart.js
- deck.gl
- mapbox-gl
- react-router

Server:
- body-parser
- express
- mysql
- cors
- nodemon

To run the application, `cd` into the `smartmove/server` folder and type `yarn start` to run the server side. Then `cd` into the `smartmove/client` folder and type `yarn start`
to open the application on a local browser.

## Technologies
This is a `React` application with styling from `Material-UI` as well as some custom CSS. The "Search" page uses `deck.gl` and the Mapbox API to render the map.
