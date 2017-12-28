/*
 * Dylan Lettinga
 * 12/16/2017
 */
require('dotenv').config();
const auth = require('./auth');
const sql = require('./dbops');
var path = require("path")
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var jsonParser = bodyParser.json();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../dashboard')));

/** 
 * POST request to /auth/login/
 * returns session token in cookie 
 * */
app.post('/auth/login/', jsonParser, function (req, res) {
    auth.login(req.headers.authorization, sql, function(neterr, token){
        if(neterr) res.sendStatus(neterr);
        else {
            var status = {"STATUS": "success"};

            if (!req.body) return res.sendStatus(400);
            else
            {
                /* TODO */
                if ( req.body.remember === 0)
                {
                    res.cookie('SESSION', token, { });
                    res.end(JSON.stringify(status));
                }
                else
                {
                    res.cookie('SESSION', token, { });
                    res.end(JSON.stringify(status));
                }
            }
        }
    });   

});

/** 
 * POST request to /api/add/admin/
 * adds new admin to db 
 * */
app.post('/api/add/admin/', jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);
    else
    {
        auth.secure(req.body.pw, function(hash){
            console.log(hash);
            sql.query('CALL `add_admin`("'
            +req.body.nme
            +'","'
            +req.body.email
            +'","'
            +hash
            +'")', function(ret){
                console.log(ret);
            });
        });
        res.end(JSON.stringify({ "STATUS": "success"}));
    }
});

/** 
 * POST request to /api/add/link/
 * adds new link to db
 * */
app.post('/api/add/link', function (req, res) {
    console.log("[200] " + req.method + " to " + req.url);
    auth.authorize(req.headers.authorization, 1, sql, function(neterr, match){
        if (neterr || !match) res.sendStatus(neterr);
        else {
            sql.query(
                
            ,function(ret){
                console.log(ret);
            });
        }
    });
});


/** 
 * GET request to /api/get/clients/
 * returns all clients for admin as JSON
 * */
app.get('/api/get/clients/', function (req, res) {
    console.log("[200] " + req.method + " to " + req.url);
    auth.authorize(req.headers.authorization, 1, sql, function(neterr, match){
        if (neterr || !match) res.sendStatus(neterr);
        else {
            sql.get_clients(function(ret){
                res.json(ret);
            });
        }
    });
});

/** 
 * GET request to /api/get/clients/:clientid
 * returns client with further detail as JSON
 * */
app.get('/api/get/clients/:clientid', function (req, res) {
    console.log("[200] " + req.method + " to " + req.url);
    auth.authorize(req.headers.authorization, 1, sql, function(neterr, match){
        if (neterr || !match) res.sendStatus(neterr);
        else {
            sql.query(
                'SELECT `id`,`client_id`,`click_date`, `click_loc` '
                +'FROM Clicks WHERE `client_id`='
                +req.params.clientid
            ,function(ret){
                res.json(ret);
            });
        }
    });
});

/** 
 * GET request to /api/get/clients/:clientid/:linkid
 * returns client browsing detail as JSON
 * 
app.get('/api/get/clients/:clientid/:linkid', function (req, res) {
    console.log("[200] " + req.method + " to " + req.url);
    auth.authorize(req.headers.authorization, 1, sql, function(neterr, match){
        if (neterr || !match) res.sendStatus(neterr);
        else {
            sql.query(
                
            ,function(ret){
                res.json(ret);
            });
        }
    });
});*/

/** 
 * GET request to /api/get/links
 * returns links as JSON
 * */
app.get('/api/get/links', function (req, res) {
    console.log("[200] " + req.method + " to " + req.url);
    auth.authorize(req.headers.authorization, 1, sql, function(neterr, match){
        if (neterr || !match) res.sendStatus(neterr);
        else {
            sql.query(
                
            ,function(ret){
                res.json(ret);
            });
        }
    });
});

var server = app.listen(7819, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Server started at http://%s:%s", host, port);
    //mongo.createcol("invoice");
})