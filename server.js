'use strict';

require('dotenv').config();

const PORT = process.env.PORT || 3005;

const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const morgan = require('morgan');

const app = express();
const database = new pg.Client(process.env.DATABASE_URL);


app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

app.set('view engine', 'ejs');

app.get('/login', login);
app.post('/addUser', test);
app.get('/', getPokeNames);
app.post('/add', addFavorites);
app.get('/favorites', getFavorites);
app.use('*', routeNotFound);
app.use(bigError);

//----------Login (New User)
function login(req, res){
    let url = 'https://fontmeme.com/permalink/200718/724a6d29d63468457272b3a6112fd84b.png';

    res.status(200).render('pages/login', {route: '/login', linkToRoute: 'Login', url: url});
}



//----------Show Pokemon Names
function getPokeNames(req, res){
    const API = 'https://pokeapi.co/api/v2/pokemon';
    console.log(req.params.userName);

    superagent.get(API).then(data => {
        let getPokeArr = data.body.results.map(targetNames => {
            let newArr = new Pokemon(targetNames).name;
            return newArr;
        })
        let url = 'https://fontmeme.com/permalink/200718/724a6d29d63468457272b3a6112fd84b.png';

        getPokeArr.sort();

        res.status(200).render('pages/show', {names: getPokeArr, route: '/favorites', linkToRoute: 'Favorites', url: url});

    }).catch(error => bigError(error, res));
}

//----------Pokemon Constructor
function Pokemon(obj){
    this.name = obj.name;
}

//----------Add Pokemon to Favorites
function addFavorites(req, res){
    let saveToDB = [req.body.name];

    const SQL = `INSERT INTO pokemon (name) VALUES ($1);`;

    database.query(SQL, saveToDB).then(data => {
    
        res.status(200).redirect('/');

    }).catch(error => bigError(error, res));
}

//----------Show Favorite Pokemon
function getFavorites(req, res){
    const SQL = 'SELECT * FROM pokemon;';

    database.query(SQL).then(data => {
        let row = data.rows.map(targetNames => {
            let newArr = new Pokemon(targetNames).name;
            let twoArr = newArr.name;
            return newArr;
        })
        let url = 'https://fontmeme.com/permalink/200718/62a4f2b98f2af5ac4721709ccb01b039.png';

        res.status(200).render('pages/favorites', {names: row, route: '/', linkToRoute: 'Home', url: url});

    }).catch(error => bigError(error, res));
}

//----------404 Error
function routeNotFound(req, res) {
    res.status(404).send('Route NOT Be Found!');
}

//----------All Errors minus 404
function bigError(error, res) {
    console.log(error);
    res.status(error).send('BROKEN!');
}

//----------Connect to Server and Database
database.connect(() => {
    app.listen(PORT, () => console.log(`WORKING!: ${PORT}`));
})
