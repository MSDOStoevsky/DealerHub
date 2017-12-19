var bcrypt = require('bcrypt-nodejs');

function S4(){
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}

function token_gen() {
    return (S4()+S4()+S4()+S4()+S4()+S4());
}

module.exports = {

    token_gen : () => {
        return (S4()+S4()+S4()+S4()+S4()+S4());
    },

    login: (basic, db, res) => {
        var auth_arr;
        var un_pw;

        try
        {
            auth_arr = basic.split(" ");
        }
        catch(err)
        {
            res(400, null);
        }

        if(auth_arr[0] === "Basic")
        {
            un_pw = Buffer.from(auth_arr[1], 'base64').toString('ascii').split(":");
            db.query('SELECT * FROM `Admins` WHERE `email` = "'+un_pw[0]+'"', function(ret){
                /* no user with that un */
                if(ret.length === 0)
                    res(400, null);

                /* correct match on un */
                else
                {
                    console.log(ret);
                    bcrypt.compare(un_pw[1], ret[0].pw, function(err, issame){
                        if (err) throw err;
                        /* password matches */
                        else if (issame)
                        { 
                            /* store generated access token in db and send to client */
                            var access_token = token_gen();
                            db.query("UPDATE `Admins` SET `token` = "
                            + access_token
                            + ", `last_login` = NOW()"
                            + " WHERE `id` = "
                            +ret[0].user_id
                            )
                            res (null, access_token);
                        }
                        /* no password match */
                        else
                            res (400, null);
                    });
                
                }
            });
        }
        else res(400, null);
    },

    authorize: (bearer, user, db, res) => {
        var bearer_arr;
        var btoken;

        try
        {
            bearer_arr = bearer.split(" ");
        }
        catch(err)
        {
            res(400, null);
        }

        if(bearer_arr[0] === "Bearer")
        {
            btoken = bearer_arr[1];
            db.query("user", {'user_id': user}, function(ret){

                /* no user with that user_id */
                if(ret.length === 0)
                    res(400, null);

                /* correct match on user_id */
                else
                {
                    if( ret[0].token == btoken) res(null, true);
                    else res (403, false);
                
                }
            });
        }
        else res(400, null);
    },

    secure : (pw, callback) => {
        bcrypt.hash(pw, null, null, function(hasherr, hash){
            if(hasherr) throw hasherr;
            callback(hash);
        })
    }
}