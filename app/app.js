/*
 * Dylan Lettinga
 * 12/16/2017
 */
require('dotenv').config();
const auth = require('./auth');
const sql = require('./dbops');
var path = require("path")
var express = require('express');
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser');
var mustache = require('mustache');
var fs = require("fs");

var app = express();
var jsonParser = bodyParser.json();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use( '/', express.static(path.join(__dirname, '../public')));

app.get('/page', jsonParser, function (req, res) {
    sql.query('SELECT `id` FROM `Referrals` WHERE `referral`= ?'
    ,[req.query.ref]
    ,function(ret)
    {
        if (ret.length === 0) res.redirect(path.join(__dirname, '../public/index.html'));
        else
        {
            sql.get_clientview(req.query.ref, function(ret){
                var page = fs.readFileSync(path.join(__dirname, 'views/page.html'), "utf8");
                var html = mustache.render(page, ret); // replace all of the data
                res.end(html);
            });
        }
    });
});

app.get('/admin', jsonParser, function (req, res) {

    if(req.cookies['SESSION'])
    {
        sql.get_adminview(function(ret){
            var page = fs.readFileSync(path.join(__dirname, 'views/dashboard.html'), "utf8");
            var html = mustache.render(page, ret); // replace all of the data
            res.end(html);
        });
        /*auth.authorize(req.headers.authorization, 1, sql, function(neterr, match){
            if (neterr || !match) res.sendStatus(neterr);
            else {
                sql.get_clients(function(ret){
                    
                    var page = fs.readFileSync(path.join(__dirname, 'views/dashboard.html'), "utf8");
                    var html = mustache.to_html(page, JSON.stringify(ret)); // replace all of the data
                    res.end(html);
                });
            }
        });*/
    }
    else
    {
        res.sendFile(path.join(__dirname, '../public/admin/login.html'));
    }
});

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
                if (req.body.remember === 0)
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
 * POST request to /api/add/click/
 * adds new click under referred client
 * */
app.post('/api/add/click/', jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);
    else
    {
        sql.query(
        'CALL `add_clicks`(?, ?)'
        ,[req.body.lid, req.body.ref]
        , function(ret){
            console.log(ret);
        });
        res.end(JSON.stringify({ "STATUS": "success"}));
    }
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
            sql.query(
            'CALL `add_admin`(?, ?, ?)'
            ,[req.body.nme, req.body.email, hash]
            , function(ret){
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
            'CALL `add_link`(?, ?, ?)'
            ,[1, req.body.nme, req.body.link]
            ,function(ret){
                console.log(ret);
            });
        }
    });
});

/** 
 * POST request to /api/add/referral/
 * adds new referral code to client
 * returns generated code
 * */
app.post('/api/add/referral/:clientid', function (req, res) {
    console.log("[200] " + req.method + " to " + req.url);
    auth.authorize(req.headers.authorization, 1, sql, function(neterr, match){
        if (neterr || !match) res.sendStatus(neterr);
        else {
            var code = auth.referral_gen();
            console.log(req.params.clientid);
            console.log(code);
            sql.query(
                'CALL `add_referral`(?,?,?)'
            ,[req.params.clientid, 1, code]
            ,function(ret){
                console.log(ret);
            });
            res.end(JSON.stringify({"REFERRAL": code}));
        }
    });
});

/** 
 * POST request to /api/rmv/client/
 * removes client
 * */
app.post('/api/rmv/client/', jsonParser, function (req, res) {
    console.log("[200] " + req.method + " to " + req.url);
    if (!req.body) return res.sendStatus(400);
    auth.authorize(req.headers.authorization, 1, sql, function(neterr, match){
        if (neterr || !match) res.sendStatus(neterr);
        else {
            console.log("client="+req.body.cid+" admin="+req.body.aid);
            sql.query(
                'CALL `rmv_client`(?,?)'
            ,[req.body.cid, req.body.aid]
            ,function(ret){
                console.log(ret);
            });
            res.end(JSON.stringify({"RETURN": 200}));
        }
    });
});

/** 
 * POST request to /api/rmv/link/
 * removes client
 * */
app.post('/api/rmv/link/', jsonParser, function (req, res) {
    console.log("[200] " + req.method + " to " + req.url);
    if (!req.body) return res.sendStatus(400);
    auth.authorize(req.headers.authorization, 1, sql, function(neterr, match){
        if (neterr || !match) res.sendStatus(neterr);
        else {
            console.log("link="+req.body.lid+" admin="+req.body.aid);
            sql.query(
                'CALL `rmv_link`(?,?)'
            ,[req.body.lid, req.body.aid]
            ,function(ret){
                console.log(ret);
            });
            res.end(JSON.stringify({"RETURN": 200}));
        }
    });
});

/** 
 * POST request to /api/upd/client/
 * removes client
 * */
app.post('/api/upd/client/', jsonParser, function (req, res) {
    console.log("[200] " + req.method + " to " + req.url);
    if (!req.body) return res.sendStatus(400);
    auth.authorize(req.headers.authorization, 1, sql, function(neterr, match){
        if (neterr || !match) res.sendStatus(neterr);
        else {
            console.log("client="+req.body.cid+" admin="+req.body.aid);
            sql.query(
                'CALL `upd_client`(?,?, ?)'
            ,[req.body.cid, req.body.aid, req.body.pn]
            ,function(ret){
                console.log(ret);
            });
            res.end(JSON.stringify({"RETURN": 200}));
        }
    });
});

/** 
 * POST request to /api/upd/client/
 * removes client
 * */
app.post('/api/upd/link/', jsonParser, function (req, res) {
    console.log("[200] " + req.method + " to " + req.url);
    if (!req.body) return res.sendStatus(400);
    auth.authorize(req.headers.authorization, 1, sql, function(neterr, match){
        if (neterr || !match) res.sendStatus(neterr);
        else {
            console.log("link="+req.body.lid+" admin="+req.body.aid);
            sql.query(
                'CALL `upd_link`(?,?,?,?)'
            ,[req.body.lid, req.body.aid, req.body.nme, req.body.url]
            ,function(ret){
                console.log(ret);
            });
            res.end(JSON.stringify({"RETURN": 200}));
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
            sql.query( 'SELECT * FROM `Clients`', function (results) {
                console.log(results);
                res.json(results);
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
                +'FROM Clicks WHERE `client_id`= ?'
            ,[req.params.clientid]
            ,function(ret){
                res.json(ret);
            });
        }
    });
});

/** 
 * GET request to /api/get/links
 * returns links as JSON
 * */
app.get('/api/get/links', function (req, res) {
    console.log("[200] " + req.method + " to " + req.url);
    sql.query(
        'CALL `get_links`("'
        +req.query.ref
        +'");'
    ,function(ret){
        res.json(ret);
    });
});

var server = app.listen(7819, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Server started at http://%s:%s", host, port);
})