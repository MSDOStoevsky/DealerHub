var mysql = require('mysql');
var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password : process.env.DB_PASS,
    database: process.env.DB_NAME,
});

/*  */
con.connect(function(err) {
    if (err) throw err;
    console.log("Connection to mysql@" +process.env.DB_HOST+"/"+process.env.DB_NAME+ " successful");
});

module.exports = {

    /* stored procedure call to json */
    get_adminview: (res) =>
    {
        var resobj = {
            d_name: ""
            ,d_photo: ""
            ,d_email: ""
            ,clients: new Array()
            ,clicks: new Array()
            ,links: new Array()
        };
        con.query('CALL `get_clients`()', function (error, results, fields) {
            if (error) throw error;
            results[0].forEach(function(item, index){
                resobj.clients[index] = item;
            });
            con.query('CALL `get_clicks`(1)'
            ,function(error, results)
            {
                results[0].forEach(function(item, index){
                    resobj.clicks[index] = item;
                });
                con.query('SELECT `name`, `email`, `photo` FROM Admins WHERE `id` = 1'
                ,function(error, results)
                {
                    resobj.d_name = results[0].name;
                    resobj.d_photo = results[0].photo;
                    resobj.d_email = results[0].email;
                    con.query('SELECT `id`, `name`, `URL` FROM `Links` WHERE `admin_id` = 1'
                    ,function(error, results)
                    {
                        if (error) throw error;
                        results.forEach(function(item, index){
                            resobj.links[index] = item;
                        });
                        res(resobj);
                    });
                });
            });
        });
    },
    get_clientview: (param, res) =>
    {
        var resobj = {
            c_ref: param,
            d_name: "",
            d_email: "",
            d_photo: "",
            links: new Array()
        };
        con.query('CALL `get_links`(?)', [param], function (error, results, fields) {
            if (error) throw error;
            results[0].forEach(function(item, index){
                resobj.links[index] = item;
            });
            
            con.query('SELECT `name`, `email`, `photo` FROM Admins a LEFT JOIN Referrals r ON r.admin_id = a.id WHERE r.referral = ?'
            ,[param]
            ,function(error, results)
            {
                resobj.d_name = results[0].name;
                resobj.d_email = results[0].email;
                resobj.d_photo = results[0].photo;
                res(resobj);
            });
        });
    },
    query: (stmt, res) =>
    {
        con.query(stmt, function (error, results, fields) {
            if (error) throw error;
            res(results);
        });
    },
    query: (stmt, param, res) =>
    {
        con.query(stmt, param, function (error, results, fields) {
            if (error) throw error;
            res(results);
        });
    }

}