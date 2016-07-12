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
    ProjektList: ProjektList,
    noviProjekt: noviProjekt,
    deleteProjekt: deleteProjekt,
    uploadProject: uploadProject,
    saveNoviProjekt: saveNoviProjekt,
    getProjekt: getProjekt,
    updateProjekt: updateProjekt
};

function ProjektList(req, res) {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if (err) {
            client.end();
            return console.error('could not connect to postgres', err);
        } else {
            var query = `select     
                    s.id,
                    p.name,                    
                    p.tip,
                    p.client_id,
                    p.status,
                    p.vrijednost                   
                 from
                    projekti p
                    join sadrzaj s on s.id=p.id
                  where  s.active = 1`;
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
};

function noviProjekt(req, res) {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if (err) {
            return console.error('could not connect to postgres', err);
            client.end();
        } else {
            var query = `insert
                into sadrzaj
                (name,                
                kreiran_ts,                
                vrsta_id ) 
             values ('Novi projekt',NOW(), 2) RETURNING id, name`;
            client.query(query, function(err, result) {
                if (err) {
                    return console.error('error running query', err);
                    client.end();
                } else {
                    var id = result.rows[0].id;
                    var name = result.rows[0].name;
                    query = `insert into projekti(id,
                    name) values 
                    (` + id + `, '` + name + `')`;
                    console.log(query);
                    client.query(query, function(err, result) {
                        if (err) {
                            client.end();
                            return console.error('error running query', err);
                        } else {
                        }
                    })
                    res.json({ 'id': id, 'name': name });
                    client.end();
                }
            })
        }
    })
};

function deleteProjekt(req, res) {
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
};

function uploadProject(req, res) {
    var id = req.swagger.params.id.value;
    var data = JSON.parse(req.swagger.params.docname.value);
    var name = data.name;
    var tip = data.tip;
    var status = data.status;
    var vrijednost = data.vrijednost;
    var client_id = data.client_id;
    var query = '';
    if (data.name) {
        query = `Update projekti set 
                name = '` + name + `'                
            where id =` + id + ` `;
    }
    if (data.tip) {
        query = `update projekti set 
            tip = ` + tip + `
            where id =` + id + ` `;
    }
    if (data.status) {
        query = `update projekti set 
            status = ` + status + `
            where id =` + id + ` `;
    }
    if (data.vrijednost) {
        query = `update projekti set 
            vrijednost = ` + vrijednost + `
            where id =` + id + ` `;
    }
    if (data.client_id) {
        query = `update projekti set 
            client_id = ` + client_id + `
            where id =` + id + ` `;
    }
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if (err) {
            return console.error('could not connect to postgres', err);
            client.end();
        } else {
            console.log(query);
            client.query(query, function(err, result) {
                if (err) {
                    return console.error('error running query', err);
                    client.end();
                } else {
                    res.json(result);
                    client.end();
                }
            })
        }
    })
}

function saveNoviProjekt(req, res) {

    var data = JSON.parse(req.swagger.params.data.value);
    var client = new pg.Client(conString);
    var sadrzajId = client.connect(function(err) {
        if (err) {
            client.end();
            return console.error('could not connect to postgres', err);
        } else {
            //console.log(podaci);
            var query = `insert
                into sadrzaj
                (name,                
                kreiran_ts,                
                vrsta_id
                ) 
             values ('` + data.name + `',NOW(),2) RETURNING id`;
            //console.log(query);
            client.query(query, function(err, result) {
                if (err) {
                    client.end();
                    return console.error('error running query', err);
                } else {
                    var id = result.rows[0].id;
                    data['id'] = id;
                    console.log(data);
                    for (var prop in data) {
                        if (data[prop] === '') {
                            if (prop === 'client_id' || prop === 'tip' || prop === 'status' || prop === 'vrijednost') {
                                data[prop] = null;
                            }
                        }
                    }
                    query = `insert  into projekti
                          (id,
                          name,
                          client_id,
                          tip,
                          status,
                          vrijednost                          
                          )
                          values(` + id + `,
                          '` + data.name + `',                                                  
                          ` + data.client_id + `,
                          ` + data.tip + `,
                          ` + data.status + `,
                          ` + data.vrijednost + `                          
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

function getProjekt(req, res) {
    var id = req.swagger.params.id.value;
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if (err) {
            client.end();
            return console.error('could not connect to postgres', err);
        } else {
            var query = `select                                         
                    p.*       
            from projekti p join
            sadrzaj s on s.id= p.id
            where s.id = ` + id + ``;
            console.log(query);
            client.query(query, function(err, result) {
                if (err) {
                    client.end();
                    return console.error('error running query', err);
                } else {
                    // console.log(result.rows[0]);
                    res.json(result.rows[0]);
                    client.end();
                }                
            })
        }
    })
}
function updateProjekt(req, res) {
    var data = JSON.parse(req.swagger.params.data.value);
    var id = req.swagger.params.id.value;
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if (err) {
            client.end();
            return console.error('could not connect to postgres', err);
        } else {
            var query = `update
                    sadrzaj set
                name = '` + data.name + `',
                izmjenjen_ts = NOW()        
             where id = ` + id + ` `;
            //console.log(query);
            client.query(query, function(err, result) {
                if (err) {
                    client.end();
                    return console.error('error running query', err);
                } else {
                    for (var prop in data) {
                        if (data[prop] === '') {
                            if (prop === 'client_id' || prop === 'tip' || prop === 'status' || prop === 'vrijednost') {
                                data[prop] = null;
                            }
                        }
                    }
                    query = `update  projekti set                           
                          name = '` + data.name + `',
                          client_id = ` + data.client_id + `,
                          tip =  ` + data.tip + `,                          
                          status = ` + data.status + ` ,                          
                          vrijednost = ` + data.vrijednost + `                         
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
