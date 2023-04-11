# Bluedom frontend documentation

## Prerequisites
- NodeJS
- npm or yarn

## Setup
Navigate to the frontend base folder `bluedom-fe` and install all dependencies:
```
npm install
```
or, if you're using `yarn`
```
yarn install
```
Next, configure the web api base url in `src/Api.tsx`. At the top of the file, you'll find the `API_BASEURL` constant. Change this to your api's url. For example:
```ts
export const API_BASEURL = 'https://localhost:7148/api';
```
The base website template and manifest is found in the `public` directory, you can change it however you see fit.

## Launch
To launch a development build with hot-reload, run:
```
npm start
```
or, if you're using `yarn`:
```
yarn start
```
This will serve the web app at `localhost:3000`, and automatically refresh when a change is detected.
<br />
<br />
Before building the app for production, make sure to change the `API_BASEURL` to something that's accessible anywhere, because that code will run on the users' machine. You can make the build using:
```
npm run build
```
or, if you're using `yarn`:
```
yarn build
```
This will create a `build` directory in `bluedom-fe` which contains the static website.

Additional details about the react commands can be found in [the React template readme](bluedom-fe/README.md).