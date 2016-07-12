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
    addNote: addNote,
    KlijentBiljeske: KlijentBiljeske,
    deleteNote: deleteNote
};

function addNote(req, res) {
    var client = new pg.Client(conString);
    var clientId = req.swagger.params.id.value;
    var data = JSON.parse(req.swagger.params.data.value);
    client.connect(function(err) {
        if (err) {
            client.end();
            return console.error('could not connect to postgres', err);
        } else {
            var query = `insert
                into sadrzaj
                (name,                
                kreiran_ts,                
                vrsta_id ) 
             values ('Biljeska',NOW(), 3) RETURNING id`;
            client.query(query, function(err, result) {
                if (err) {
                    return console.error('error running query', err);
                } else {
                    var id = result.rows[0].id;
                    query = `insert into biljeske(id,
                    client_id,opis,datum) values 
                    (` + id + `, ` + clientId + `, '` + data.note + `', '` + data.datum + `')`;
                    console.log(query);
                    client.query(query, function(err, result) {
                        if (err) {
                            client.end();
                            return console.error('error running query', err);
                        } else {

                        }
                    })
                    res.json({ success: true });
                    client.end();
                }
            })
        }
    })
}

function KlijentBiljeske(req, res) {
    var client = new pg.Client(conString);
    var client_id = req.swagger.params.id.value;
    console.log(client_id);
    client.connect(function(err) {
        if (err) {
            return console.error('could not connect to postgres', err);
            client.end();
        } else {
            var query = `select     
                    s.id,                                        
                    b.datum,
                    b.opis                    
                 from
                    biljeske b
                    join sadrzaj s on s.id=b.id
                  where  s.active = 1 and b.client_id='` + client_id + `' `;
            client.query(query, function(err, result) {
                if (err) {
                    client.end();
                    return console.error('error running query', err);
                } else {
                    //console.log(result.rows[0]);
                    res.json(result.rows);
                    client.end();
                }               
            })
        }
    })
}

function deleteNote(req, res) {
    var id = req.swagger.params.id.value;
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if (err) {
            return console.error('could not connect to postgres', err);
            client.end();
        } else {
            var query = `Update sadrzaj set
             active = 0,             
             izmjenjen_ts =  NOW()
              where id =` + id + ` `;
            client.query(query, function(err, result) {
                if (err) {
                    client.end();
                    return console.error('error running query', err);
                } else {
                    //console.log(result.rows);
                    res.json("Deleted");
                    client.end();
                }                
            })
        }
    })
}