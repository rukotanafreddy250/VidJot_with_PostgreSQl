const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = /*require('bcryptjs'); */ require('bcrypt');
const { Client } = require('pg');
const { ensureAuthenticated } = require('../auth/auth')
const router = express.Router();


// const dbconn = () => {
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
// }

// module.exports = dbconn;

router.get('/register', (req, res) => {
    res.render('register', {

    });
});

router.get('/login', (req, res) => {
    res.render('login', {

    });
});

router.post('/register', async (req, res) => {
    let name = req.body.name;
    let emails = req.body.email;
    let password = req.body.password;
    let pwd2 = req.body.password2;
    try{
        let sql1 = `select 'email' from jot_users where email = ${emails}`;
        client.query(sql1, (err, results) => {
            if (err) {
                // console.error(err.stack);
                console.log('client.query():', err)
            }
            // if (results.rowCount !== 0) {
            //     req.flash('error_msg', 'Email already In Use...');
            //     res.redirect('/users/register');
            // }
        })
    }catch(e){
        console.error(e);
    }
    // if (password === pwd2) {
        // bcrypt.genSalt(10, (err, salt) =>{
        //     bcrypt.hash(pwd2, salt, (err, hash) =>{
        //         if(err) throw err;
        //         pwd2 = hash;
        //     });
        // });
        // let hashedPwd = await bcrypt.hash(password, 10);
        // let sql = 'INSERT INTO jot_users(names, email, passwords) VALUES ($1, $2, $3)';
        // let sql_value = [name, email, hashedPwd];
        // client.query(sql, sql_value, (err, results) => {
        //     if (err) throw err.stack;
        //     console.log(results.rows);
        //     req.flash('success_msg', "You Have been Registered,  You Can Now Login");
        //     res.redirect('/users/login');
        // })
    // }
    // else {
    //     req.flash('error', 'Password Do Not Much');
    //     res.redirect('/users/register');
    // }
    // res.redirect('/users/login');
});

router.post('/login', (req, res) => {
    let sql = 'select * from jot_users where email= $1 and passwords= $2 ';
    let sql_value = [req.body.email, req.body.passwords];
    client.query(sql, sql_value, (err, results) => {
        if (err) throw err;
        // console.log(results.rows[0].id);
        console.log(results);
        if (results.rowCount == 0) {
            req.flash('error_msg', `Email or Password Are Invalid`);
            res.redirect('/users/login');
        } else {
            const sql_Res = results.rows;
            let row = "";
            let id = "";
            let email = "";
            for (i = 0; i < results.rows.length; i++) {
                row = results.rows[i];
                id = results.rows[i].id;
                email = results.rows[i].email;
            }
            console.log(row);
            // console.log(sql_Res.forEach(item.id));
            let sqlRes = JSON.stringify(row);
            // if(sqlRes !== Object /*  means it has confirmed results from DB*/ ) {
            const token = jwt.sign({ id: id }, "freddy's screct");
            console.log(token);
            const cookieOptions = {
                /*exprises: new Date(  Date.now() + process.env.cookie_experises_in * 24 * 60 * 60 * 3000),*/
                httpOnly: true
            }
            // res.setHeader('Set-Cookie', [`cookie_value: ${token}`]);
            res.cookie('plsql_Auth', token, cookieOptions);
            // const cookieValue = req.headers.cookies.cookie_value;
            if (req.cookies['plsql_Auth']) {
                console.log('cookies are available for the site');
            }
            console.log(req.cookies['plsql_Auth']);
            if (req.cookies['plsql_Auth'] !== token) {
                console.log('not equal');
            }
            // res.header('authorization', token);
            // const bear = req.header['authorization'];
            // const hdBear = bear.split(' ')
            // console.log(bear);  
            // function ensureAuthenticated(req, res, next) {
            // console.log(req.headers['authorization'].split(' '));
            // let bear = req.header['authorization'];
            // let tokenAuth = bear && bear.split(' ')[1];
            // if( tokenAuth == null ){
            //     console.log('null');
            // }
            // }

            req.flash('success_msg', `Welcome To VidJot ` + email);
            res.redirect('/');
            // }else{
            //     console.log('No Data Found');
            //     req.flash('error_msg', `Email or Password Are Invalid`);
            //     res.redirect('/users/login');
            // }
        }

    });
});

router.get('/logout', (req, res) => {
    res.cookie('plsql_Auth', 'null', {
        experises: '1s', httpOnly: true
    })
    req.flash('success_msg', `You Have successfully Logged Out`);
    res.redirect('/users/login');
})

module.exports = router;