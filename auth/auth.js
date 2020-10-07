const express = require('express');
const jwt = require('jsonwebtoken');


module.exports = {
    ensureAuthenticated: (req, res, next) => {
        // console.log(req.headers['authorization'].split(' '));
        // let token = authHeader && authHeader.split(' ')[1];

        const authHeader = req.header['authorization'];

        //login Steps
        const cookieValue = req.cookies['plsql_Auth'];
        // if( cookieValue === undefined ){
        //    req.flash('error', 'You Are Unauthorized!, Plz Login First');
        //    res.redirect('/users/login');
        // }
        if( cookieValue === ' ' ){
            req.flash('error', 'You Are Unauthorized!, Plz Login First');
            res.redirect('/users/login');
        }
        // const verified = jwt.verify(cookieValue, "freddy's screct");
        // if(verified){
        //     req.user = verified;
        //     console.log(req.user);
        //     next();
        // }else{
        //     req.flash('error', 'You Are Unauthorized!, Plz Login First');
        //     res.redirect('/users/login');
        // }
        try{
            const verified = jwt.verify(cookieValue, "freddy's screct");
            req.user = verified;
            console.log(req.user);
            next();
        }catch(e){
            req.flash('error_msg', 'You Are Unauthorized!, Plz Login First');
            res.redirect('/users/login');
            next();
        }
    }
}

// const verified = jwt.verify(token, "freddy's screct"); it returns the id from the payload
// req.user = verified
// user is mongoDB model