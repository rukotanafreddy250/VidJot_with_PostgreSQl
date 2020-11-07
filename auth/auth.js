const express = require('express');
const jwt = require('jsonwebtoken');
// const dbConn = require('../dbConnection/dbConn');
//  require('../dbConnection/dbConn');


const { Client } = require('pg');

// const dbConn = (req, res, next) => {
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
// next();
// }

// module.exports = dbConn;

// const currentUser = (user) => {
//     res.locals.user = user;
// };

module.exports = {
    ensureAuthenticated: async (req, res, next) => {
        // console.log(req.headers['authorization'].split(' '));
        // let token = authHeader && authHeader.split(' ')[1];

        const authHeader = req.header['authorization'];

        //login Steps
        const cookieValue = req.cookies['plsql_Auth'];
        // if( cookieValue === undefined ){
        //    req.flash('error', 'You Are Unauthorized!, Plz Login First');
        //    res.redirect('/users/login');
        // }
        // if( cookieValue === ' ' ){
        //     req.flash('error', 'You Are Unauthorized!, Plz Login First');
        //     res.redirect('/users/login');
        // }
        // const verified = jwt.verify(cookieValue, "freddy's screct");
        // if(verified){
        //     req.user = verified;
        //     console.log(req.user);
        //     next();
        // }else{
        //     req.flash('error', 'You Are Unauthorized!, Plz Login First');
        //     res.redirect('/users/login');
        // }
        const verified = jwt.verify(cookieValue, "freddy's screct", (err, results) => {
            if (err) {
                // req.flash('error', 'You Are Unauthorized!, Plz Login First');
                res.redirect('/users/login');
            } else {
                req.user = results;
                console.log(req.user);
                // const currentUser = (user) => {
                //     user = req.user
                // };
                res.locals.user = req.user;
                next();
            }
        });
    },
    checkUser: (req, res, next) => {
        // dbConn();
        const token = req.cookies['plsql_Auth'];
        // if(token){
        try {
            const verifier = jwt.verify(token, "freddy's screct");
            console.log(verifier);
            req.user = verifier;
            res.locals.user = req.user;
            console.log(user);
            // req.flash('user', `${req.user}`);
            next();
        } catch (e) {
            // req.user = false;
            // req.flash('user', `${req.user}`);
            next();
        }
        // }else{
        // res.redirect('/about');
        // }
        // req.user = false;
    },
    checkAbout: (req, res, next) => {
        const cookie = req.cookies['plsql_Auth'];
        if (cookie) {
            currentUser(user);
            res.locals.user = user;
            return next();
        } else {
            currentUser(user);
            res.locals.user = user;
            next();
        }
    }
}

// const verified = jwt.verify(token, "freddy's screct"); it returns the id from the payload
// req.user = verified
// user is mongoDB model





// try{
//     const verified = jwt.verify(cookieValue, "freddy's screct");
//     req.user = verified;
//     console.log(req.user);
//     res.locals.user = verified;
//     next();
// }catch(e){
//     // req.flash('error_msg', 'You Are Unauthorized!, Plz Login First');
//     res.redirect('/users/login');
//     next();
// } 



// const verified = jwt.verify(cookieValue, "freddy's screct", (err, results) => {
//     if(err){
//         req.flash('error', 'You Are Unauthorized!, Plz Login First');
//         res.redirect('/users/login');
//     }else{
//         req.user = results;
//         console.log(req.user);
//         // const currentUser = (user) => {
//         //     user = req.user
//         // };
//         res.locals.user = req.user;
//         next();
//     }
// });


// jwt.verify(token, "freddy's screct", (err, results) => {
//     if (err) {
//         req.flash('error_msg', 'oop something went wrong...!!!')
//         console.log(err);
//     } else {
//         console.log('the ID for the current User: ' + results.id);
//         client.query(`select names from jot_users where id= ${results.id}`, (err, res) => {
//             if (err) {
//                 console.log('Auth Middleware error: ' + err.stack);
//             } else {
//                 req.names = res.rows[0].names;
//                 req.user = res.rows[0].names;
//                 console.log(req.user);
//                 // res.locals.user = req.user;
//                 // res.locals.name = req.user;
//                 req.flash('user', `${req.user}`);
//                 console.log('the name for current user is : ' + res.rows[0].names);
//             }
//         })
//         next();
//     }
// });







// try {
//     const verfier = jwt.verify(token, "freddy's screct");
//     console.log(verfier);
//     req.user = true;
//     console.log(user);
//     req.flash('user', `${req.user}`);
//     next();
// } catch (e) {
//     req.user = false;
//     req.flash('user', `${req.user}`);
//     next();
// }