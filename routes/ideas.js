const express = require('express');
const jwt = require('jsonwebtoken');
const { Client } = require('pg');
const cors = require('cors');
const { check, validationResult } = require("express-validator");
const { ensureAuthenticated, checkUser, checkAbout} = require('../auth/auth');

const router = express.Router();


// const dbConn = require('../dbConnection/dbConn');
const client = new Client({
    user: 'RecipeDB',
    host: 'localhost',
    database: 'RecipeDB',
    password: '1234',
    port: '5432'    
});

client.connect((err, client, done) => {
    if (!err) {
        console.log('PostgreSQL Database Server Connected...');
    } else {
        console.log("PostgreSQL Database Server Can't Connect!!! " + err.stack);
    }
});
// const dbConn = require('../dbConnection/dbConn');

// require('../auth/auth').ensureAuthenticated();

router.get('/', ensureAuthenticated, (req, res) => {
    res.render('index', {
        title: 'Vidjot',
        // user: req.user
    });
});

// var partialsDir = __dirname + '../views/partials';

// var filenames = fs.readdirSync(partialsDir);

// filenames.forEach(function (filename) {
//   var matches = /^([^.]+).hbs$/.exec(filename);
//   if (!matches) {
//     return;
//   }
//   var name = matches[1];
//   var template = fs.readFileSync(partialsDir + '/' + filename, 'utf8');
//   hbs.registerPartial(name, template);
// });


router.get('/about', checkUser,   /*async*/ (req, res) => {
    // const checker =  req.flash('user', `${req.user}`);
    // if(checker === true){
    //     return res.render('about',{
    //         // user: req.flash('user', `${req.user}`) 
    //     });
    // }
    // if(checker === false){
    //     return res.render('about',{
    //         user: req.flash('user', `${req.user}`)
    //     });
    // }
    res.render('about', {
        // user: req.user
    })
});

// list of ideas route
router.get('/ideas', ensureAuthenticated, (req, res) => {
    let id = '';
    if (!req.user) {
        ensureAuthenticated;
    }else{
        let sql = `select * from jot_videos where jot_users_id=${req.user.id}`;
        // let sql_value = [req.user];
        client.query(sql, (err, results) => {
            if (err) throw err.stack;
            // console.error(err);
            // console.log(results);
            let rows = '';
            for (i = 0; i < results.rows.length; i++) {
                rows = results.rows[i];
            }
            console.log(rows);
            console.log(results.rows);
            res.render('ideas', {
                ideas: results.rows,
                user: req.user
            });
        });
    }
    // res.render('');
});

//add Videos ideas
router.get('/ideas/add', ensureAuthenticated, (req, res) => {
    res.render('add', {
        user: req.user
    });
});

//Edit Videos ideas 's GET route
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    let sql = `select * from jot_videos where id_uuid=${req.params.id}`;
    // client.query(sql)
    // .catch( (err)=>{
    //     throw err;
    // })
    // .then( (results) =>{
    //     let row = '';
    //     for(i=0;i<results.rows;i++){
    //         row = results.rows[i];
    //     }
    //     console.log(row);
    //     res.render('edit', {
    //         results: row
    //     });
    // });
    client.query(sql, (err, results) => {
        if (err) throw err.stack;
        // console.log(results.rows);
        let row = '';
        for (i = 0; i < results.rows.length; i++) {
            row = results.rows[i];
        }
        console.log(row);
        res.render('edit', {
            results: row,
            user: req.user
        });
    });
});


// Post ideas Routes

// add ideas ' s post routes
router.post('/ideas', ensureAuthenticated, [
    check('title', 'this Title must be 5+ characters')
        .exists()
        .isLength({ min: 5 }),
    check('details', 'this is Details Field is Empty')
        .exists()
        .not()
        .isEmpty()
], (req, res) => {
    const error = validationResult(req);
    const title = req.body.title;
    const details = req.body.details;
    if ((!error.isEmpty()))/* == (!error.isEmpty())*/ {
        console.log(error);
        // return res.status(422).json(error.array());
        const validationError = error.array();
        let msg = "";
        for (i = 0; i < validationError.length; i++) {
            msg = validationError[i].msg;
        }
        res.render('add', {
            msg: validationError,
            details,
            title,
            user: req.user
            // msg_2: validationError[0].msg
        })
    } else {
        // req.checkbody('title')
        // res.json(req.body);
        // console.log(req.body);
        // `INSERT INTO jot_users(title, details) VALUES(${req.body.title},${req.body.details})`;
        client.query(`INSERT INTO jot_videos(title, details, jot_users_id) VALUES($1, $2, $3)`, [req.body.title, req.body.details, req.user.id], (err, results) => {
            if (err) throw err.stack;
            // res.json(results.rows);
            // client.end();
            console.log(results.rows);
            req.flash('success_msg', 'Videos Ideas Added');
            res.redirect('/ideas');
        });
    }
});

// Edit form Process
router.put('/edit/:id', ensureAuthenticated, (req, res) => {
    let sql = `UPDATE jot_videos SET title = $1, details = $2 WHERE id_uuid = $3`;
    let sql_value = [req.body.title, req.body.details, req.params.id];
    client.query(sql, sql_value, (err, results) => {
        if (err) {
            console.log(err);
        }
        console.log(results.rows);
        req.flash('success_msg', 'Video Ideas Edited');
        res.redirect('/ideas');
    });
});
router.delete('/remove/:id', ensureAuthenticated, (req, res) => {
    let sql = 'DELETE  FROM jot_videos WHERE id_uuid = $1';
    let sql_value = [req.params.id];
    client.query(sql, sql_value, (err, results) => {
        if (err) throw err.stack;
        console.log('Deleted Row is' + results.rows);
        req.flash('error_msg', 'Video Ideas Removed');
        res.redirect('/ideas');
    });
});

module.exports = router;