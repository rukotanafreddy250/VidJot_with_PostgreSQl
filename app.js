const express = require('express');
const bodyParser = require('body-parser');
const exprSession = require('express-session');
const expresMsg = require('express-messages');
const flashMsg = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');
const fs = require('fs');
const hbs = require('hbs');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();


dotenv.config({ path: " ../../.env" });
const { ensureAuthenticated, checkUser } = require('./auth/auth');

// const {dbConn} = require('./dbConnection/dbConn');
// const dbConn = require('./dbConnection/dbConn');

// dbConn();
// const publicDirectory = path.join(__dirname, './publicDir');
// app.use(express.static(publicDirectory);) // when that folder is outside the views folder

// app.use('/auth', require('./auth/auth'));
// require('./auth/auth').ensureAuthenticated;

app.use(cors());

// app.use(function (req, res, next) {
        
//     });

    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(bodyParser.json());

    // app.use(expressValidator());

    //method override middleware
    app.use(methodOverride('_method'));

    app.use(exprSession({
        secret: 'keyboard cat',
        resave: true,
        saveUninitialized: true,
    }));

    // flash message Middlewares
    app.use(flashMsg());

    // app.use(function(req, res, next){
    //     // res.header("Access-Control-Allow-Origin", "*");
    //     // res.header("Access-Control-Allow-Methods", "GET, PUT, DELETE, POST");
    //     // res.header("Access-Control-Allow-Headers", "Content-Type");
    //     // next();
    // })

    //Global Variables
    app.use(function (req, res, next) {
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        res.locals.error = req.flash('error');
        res.locals.user = req.user || null;
        // res.locals.names = req.names;
        // res.locals.user = req.flash('user');
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET, PUT, DELETE, POST");
        res.header("Access-Control-Allow-Headers", "Content-Type", 'Authorization');
        next();
    });


    app.use(require('connect-flash')());
    app.use(function (req, res, next) {
        res.locals.messages = require('express-messages')(req, res);
        next();
    });
    app.use(cookieParser());
    app.set('views', path.join(__dirname, './views'));
    app.set('view engine', 'hbs');


    // hbs.registerPartial('headPartial', '_navbar');

    // const dbConn = require('./dbConnection/dbConn');

    // load routes for ideas
    const ideasRoutes = require('./routes/ideas.js');

    //load router for users
    const usersRoutes = require('./routes/users.js');

    //use DB conn 
    // app.use();

    // use auth as authenticaction middleware


    // use routes of ideas
    app.use('/', ideasRoutes);

    // use routes of users
    app.use('/users', usersRoutes);

    //middleware for authintication the unregisted users
    app.use(checkUser);

    //middleware for authenticating the registerd users
    app.use(ensureAuthenticated);

    //middleware for Database
    // app.use(dbConn);


    
   
    const port = 3000;
    app.listen(port, () => {
        console.log(`Server Started At Port ${port}`);
    });