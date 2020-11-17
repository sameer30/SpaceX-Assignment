//Loads the express module
const express = require('express');
//Creates our express server
const app = express();
const port = 3000;

const handlebars = require('express-handlebars');

app.set('view engine', 'handlebars');

app.engine('handlebars', handlebars({
    layoutsDir: __dirname + '/views/layouts',
}));

app.use(express.static('public'))

app.get('/', (req, res) => {
    let api_url = 'https://api.spaceXdata.com/v3/launches?limit=100';
    let launch_success = req.query.launch_success;
    let land_success = req.query.land_success;
    let launch_year = req.query.launch_year;

    launch_year = launch_year ? launch_year : '';
    land_success = land_success ? land_success : '';
    launch_success = launch_success ? launch_success : '';

    res.render('main', {layout : 'index', helpers: {launch_year, land_success, launch_success}});
});

app.get('/test', (req, res) => {
    res.send('test');
});

//Makes the app listen to port 3000
app.listen(port, () => console.log(`App listening to port ${port}`));