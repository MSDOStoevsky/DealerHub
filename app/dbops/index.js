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

    /* stored procedure call */
    get_clients: (res) =>
    {
        con.query('CALL `get_clients`()', function (error, results, fields) {
            if (error) throw error;
            res(results);
        });
    },
    query: (stmt, res) =>
    {
        con.query(stmt, function (error, results, fields) {
            if (error) throw error;
            
            res(results);
        });
    }

}