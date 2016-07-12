'use strict';
var util = require('util');
var pg = require('pg');
var config = require('../helpers/config');
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport")

var conString = {
    host: config.db.host,
    user: config.db.username,
    database: config.db.database
}
var smtpTransport = nodemailer.createTransport(smtpTransport({
    host: "smtp.gmail.com",
    secureConnection: false,
    port: 587,
    auth: {
        user: "zegarski1307@gmail.com",
        pass: "zegarskikupus"
    }
}));

module.exports = {
    saveNoviKlijent: saveNoviKlijent,
    KlijentList: KlijentList,
    deleteKlijent: deleteKlijent,
    getKlijent: getKlijent,
    updateKlijent: updateKlijent,
    sendMail: sendMail
};

function saveNoviKlijent(req, res) {

    var data = JSON.parse(req.swagger.params.data.value);
    //console.log(data);
    //console.log(data.name);
    var client = new pg.Client(conString);
    var sadrzajId = client.connect(function(err) {
        if (err) {
            return console.error('could not connect to postgres', err);
            client.end();
        } else {
            //console.log(podaci);
            var query = `insert
                into sadrzaj
                (name,                
                kreiran_ts,                
                vrsta_id
                ) 
             values ('` + data.name + `',NOW(),1) RETURNING id`;
            //console.log(query);
            client.query(query, function(err, result) {
                if (err) {
                    return console.error('error running query', err);
                    client.end();
                } else {

                    var id = result.rows[0].id;
                    data['id'] = id;
                    console.log(data);
                    for (var prop in data) {
                        if (data[prop] === '') {
                            if (prop === 'oib' || prop === 'postanskibroj' || prop === 'pravnioblik' || prop === 'edkategorija' || prop === 'vrstapaketa' || prop === 'broj_stanovnika' || prop === 'zupanija') {
                                data[prop] = null;
                            }
                        }
                    }
                    query = `insert  into klijenti
                          (id,
                          name,
                          pravnioblik,
                          oib,
                          ulica,
                          postanskibroj,
                          grad,
                          zupanija,
                          zadnjiKontakt,
                          broj_stanovnika,
                          edkategorija,
                          vrstapaketa,
                          objaveKlijent,
                          telefon,
                          fax,
                          email,
                          web,
                          datumUkljucenja,                          
                          datumIsteka,
                          napomena
                          )
                          values(` + id + `,
                          '` + data.name + `', 
                          ` + data.pravnioblik + `,                         
                          ` + data.oib + `,
                          '` + data.ulica + `',
                          ` + data.postanskibroj + ` ,
                          '` + data.grad + `',
                          ` + data.zupanija + `,
                          '` + data.zadnjikontakt + `',
                          ` + data.broj_stanovnika + `,
                          ` + data.edkategorija + `,
                          ` + data.vrstapaketa + `,
                          '` + data.objaveklijent + `',
                          '` + data.telefon + `', 
                          '` + data.fax + `',
                          '` + data.email + `',
                          '` + data.web + `',
                          '` + data.datumukljucenja + `',
                          '` + data.datumisteka + `',
                          '` + data.napomena + `'               
                          )`;
                    console.log(query);
                    client.query(query, function(err, result) {
                        if (err) {
                            return console.error('error running query', err);
                            client.end();
                        } else {

                        }
                    })
                    res.json('Uspjesno spremljeno');
                    client.end();
                }
            })

        }
    })
}

function KlijentList(req, res) {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if (err) {
            return console.error('could not connect to postgres', err);
            client.end();
        } else {
            var query = `select     
                    s.id,
                    s.name,                    
                    k.oib,
                    k.ulica,
                    k.postanskibroj,
                    k.grad,
                    k.zupanija,
                    k.pravnioblik,
                    k.telefon,
                    k.fax,
                    k.email,
                    k.web,
                    k.broj_stanovnika,
                    k.edkategorija,
                    k.vrstapaketa,
                    k.napomena
                 from
                    klijenti k
                    join sadrzaj s on s.id=k.id
                  where  s.active = 1`;
            //console.log(query);
            client.query(query, function(err, result) {
                if (err) {
                    return console.error('error running query', err);
                    client.end();
                } else {
                    //console.log(result.rows[0]);
                    res.json(result.rows);
                    client.end();
                }

            })
        }
    })
}

function deleteKlijent(req, res) {
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
                    return console.error('error running query', err);
                    client.end();
                } else {
                    //console.log(result.rows);
                    res.json("Deleted");
                    client.end();
                }
            })
        }
    })
}

function getKlijent(req, res) {
    var id = req.swagger.params.id.value;
    //console.log(id);
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if (err) {
            return console.error('could not connect to postgres', err);
            client.end();
        } else {
            var query = `select                                         
                    e.*       
            from klijenti e join
            sadrzaj s on s.id= e.id
            where s.id = ` + id + ``;

            client.query(query, function(err, result) {
                if (err) {
                    return console.error('error running query', err);
                    client.end();
                } else {
                    // console.log(result.rows[0]);
                    res.json(result.rows[0]);
                    client.end();
                }
            })
        }
    })
}

function updateKlijent(req, res) {
    var data = JSON.parse(req.swagger.params.data.value);
    var id = req.swagger.params.id.value;
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if (err) {
            return console.error('could not connect to postgres', err);
            client.end();
        } else {
            var query = `update
                    sadrzaj set
                name = '` + data.name + `',
                izmjenjen_ts = NOW()        
             where id = ` + id + ` `;
            console.log(query);
            client.query(query, function(err, result) {
                if (err) {
                    return console.error('error running query', err);
                    client.end();
                } else {
                    for (var prop in data) {
                        if (data[prop] === '') {
                            if (prop === 'oib' || prop === 'postanskibroj' || prop === 'pravnioblik' || prop === 'edkategorija' || prop === 'vrstapaketa' || prop === 'broj_stanovnika' || prop === 'zupanija') {
                                data[prop] = null;
                            }
                        }
                    }
                    query = `update  klijenti set 
                          id = ` + id + `,
                          name = '` + data.name + `',
                          pravnioblik = ` + data.pravnioblik + `,
                          oib =  ` + data.oib + `,
                          ulica = '` + data.ulica + `',
                          postanskibroj = ` + data.postanskibroj + ` ,
                          grad = '` + data.grad + `',
                          zupanija = ` + data.zupanija + `,
                          broj_stanovnika =  ` + data.broj_stanovnika + `,
                          zadnjiKontakt = '` + data.zadnjikontakt + `',
                          edkategorija = ` + data.edkategorija + `,
                          vrstapaketa = ` + data.vrstapaketa + `,
                          objaveKlijent = '` + data.objaveklijent + `',
                          telefon = '` + data.telefon + `',
                          fax = '` + data.fax + `',
                          email = '` + data.email + `',
                          web = '` + data.web + `',
                          datumUkljucenja = '` + data.datumukljucenja + `',                         
                          datumIsteka = '` + data.datumisteka + `',
                          napomena = '` + data.napomena + `' 
                          where id = ` + id + `
                          `;
                    console.log(query);
                    client.query(query, function(err, result) {
                        if (err) {
                            return console.error('error running query', err);
                            client.end();
                        } else {
                            res.json(data);
                            client.end();
                        }
                    })
                }
            })
        }
    })
}

function sendMail(req, res) {
    var data = JSON.parse(req.swagger.params.data.value);
    //console.log(data);

    var mailOptions = {
        from: "Boško Škorić", // sender address
        to: data.adrese, // list of receivers
        subject: data.subject, // Subject line
        //text: "Hello world ✔", // plaintext body
        html: data.mailText // html body
    }
    smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
            console.log(error);
            res.end("error");
        } else {
            console.log(response.response.toString());
            console.log("Message sent: " + response.response.toString());
            res.json("sent");
        }
    });
}
