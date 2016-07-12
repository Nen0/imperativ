'use strict';
var util = require('util');
var pg = require('pg');
var config = require('../helpers/config');

var conString = {
    host: config.db.host,
    user: config.db.username,
    database: config.db.database
}

module.exports = {
    clientCombo: clientCombo

};

function clientCombo(req, res) {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if (err) {
            return console.error('could not connect to postgres', err);
            client.end();
        } else {
            var query = `select     
                    s.id,
                    k.name                        
                 from
                    klijenti k
                    join sadrzaj s on s.id=k.id
                  where  s.active = 1`;
            client.query(query, function(err, result) {
                if (err) {
                    return console.error('error running query', err);
                    client.end();
                } else {
                    //console.log(result.rows[0]);
                    res.json({ data: result.rows });
                    client.end();
                }                
            })
        }
    })
};
