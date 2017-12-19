/*
 * Dylan Lettinga
 * 12/16/2017
 */
require('dotenv').config();
const auth = require('./auth');
const sql = require('./dbops');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var jsonParser = bodyParser.json();

app.use(bodyParser.urlencoded({ extended: false }));
//app.use(express.static(path.join(__dirname, '../frontend')));

app.post('/auth/login/', function (req, res) {
    auth.login(req.headers.authorization, sql, function(neterr, token){
        if(neterr) res.sendStatus(neterr);
        else {
            var status = {"STATUS": "success"};

            if (!req.body) return res.sendStatus(400);
            else
            {
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

})


app.post('/api/add/admin/', jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);
    else
    {
        auth.secure(req.body.pw, function(hash){
            sql.query('CALL add_admin("'
            +req.body.nme
            +'","'
            +req.body.email
            +'","'
            +hash
            +'")');
        });
        res.end(JSON.stringify({ "STATUS": "success"}))
    }
})

app.get('/api/get/clients/', function (req, res) {
    console.log("[200] " + req.method + " to " + req.url);
    /*auth.authorize(req.headers.authorization, req.params.userid, sql, function(neterr, match){
        if (neterr || !match) res.sendStatus(neterr);
        else {
            mongo.query("invoice", {'user_id': req.params.userid}, function(ret){
                res.json(ret);
            });
        }
    });*/
})

app.get('/api/get/clients/:clientid', function (req, res) {
    console.log("[200] " + req.method + " to " + req.url);
    /*auth.authorize(req.headers.authorization, req.params.userid, sql, function(neterr, match){
        if (neterr || !match) res.sendStatus(neterr);
        else {
            mongo.query("invoice", {'user_id': req.params.userid}, function(ret){
                res.json(ret);
            });
        }
    });*/
})

app.get('/api/add/:client', function (req, res) {
    console.log("[200] " + req.method + " to " + req.url);
    /*auth.authorize(req.headers.authorization, req.params.userid, sql, function(neterr, match){
        if (neterr || !match) res.sendStatus(neterr);
        else {
            mongo.query("invoice", {'user_id': req.params.userid}, function(ret){
                res.json(ret);
            });
        }
    });*/

})

var server = app.listen(7819, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Server started at http://%s:%s", host, port);
    //mongo.createcol("invoice");
})