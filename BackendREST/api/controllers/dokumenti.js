'use strict';
var util = require('util');
var pg = require('pg');
var config = require('../helpers/config');
var fs = require('fs');
var path = require('path');

var conString = {
    host: config.db.host,
    user: config.db.username,
    database: config.db.database
}

module.exports = {
    KlijentDokumentiList: KlijentDokumentiList,
    noviDokumenet: noviDokumenet,
    upload: upload,
    download: download,
    deleteDoc: deleteDoc,
    izmjenaDokumenta: izmjenaDokumenta
};

function KlijentDokumentiList(req, res) {
    var client = new pg.Client(conString);
    var client_id = undefined || req.swagger.params.id.value;
    if (client_id === undefined) {
        //console.log('greska')
        res.json('Nema id-a')
    } else {
        client.connect(function(err) {
            if (err) {
                return console.error('could not connect to postgres', err);
                client.end();
            } else {
                var query = `select     
                    s.id,                                        
                    d.docname,
                    d.filename                    
                 from
                    dokumenti d
                    join sadrzaj s on s.id=d.id
                  where  s.active = 1 and d.klijent_id='` + client_id + `' `;
                console.log(query);
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
}

function noviDokumenet(req, res) {
    var client_id = req.swagger.params.id.value;
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
                vrsta_id) 
             values ('Novi dokument',NOW(),4) RETURNING id, name`;
            console.log(query)
            client.query(query, function(err, result) {
                if (err) {
                    return console.error('error running query', err);
                    client.end();
                } else {
                    var id = result.rows[0].id;
                    var name = result.rows[0].name;
                    query = `insert into dokumenti
                     (id,klijent_id, docname)
                      values (` + id + `, ` + client_id + `, '` + name + `')`;
                    console.log(query)
                    client.query(query, function(err, result) {
                        if (err) {
                            return console.error('error running query', err);
                            client.end();
                        } else {

                        }
                    })
                    res.json([{ 'id': id, 'docname': name }]);
                    client.end();

                }
            })
        }
    })
}

function deleteDoc(req, res) {
    var id = req.swagger.params.id.value;
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if (err) {
            client.end();
            return console.error('could not connect to postgres', err);
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

function upload(req, res) {
    var file = req.swagger.params.file.value;
    var fileName = file.originalname;
    fileUpload(fileName, file, function(err, success, filename22) {
        if (err) {

        } else {
            //console.log(filename22);
            res.json(filename22);
            
        }

    })
}

function fileUpload(name, file, cb) {
    var path = '/var/www/ImperativBaza/BackendREST/documents/' + name + '';
    var buffer = new Buffer(file.buffer);
    var random = new Date().getTime();
    fs.readFile(path, function(err, data) {
        if (err) {
            path = path

        } else if (data) {
            var changeName = name.split('.');
            var newName = changeName[0] + random + '.' + changeName[1];
            path = '/var/www/ImperativBaza/BackendREST/documents/' + newName + '';
            name = newName
                //fileUpload(name, file, cb)
        }

        // spremanje file-a na server
        fs.open(path, 'w', function(err, fd) {
            if (err) {
                throw 'error opening file: ' + err;
            }
            fs.write(fd, buffer, 0, buffer.length, null, function(err) {
                if (err) throw 'error writing file: ' + err;
                fs.close(fd, function() {
                    cb(false, true, name)
                })
            });
        });
    })
}

function izmjenaDokumenta(req, res) {

    var id = req.swagger.params.id.value;
    var data = JSON.parse(req.swagger.params.docname.value);
    var query = '';
    if (data.docname) {
        query = `Update dokumenti set 
                docname = '` + data.docname + `'                
            where id =` + id + ` `;
    }
    if(data.filename){
    	query = `Update dokumenti set 
                filename = '` + data.filename + `'                
            where id =` + id + ` `;

    }
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if (err) {
            client.end();
            return console.error('could not connect to postgres', err);
        } else {
            console.log(query);
            client.query(query, function(err, result) {
                if (err) {
                    client.end();
                    return console.error('error running query', err);
                } else {
                    res.json(result);
                    client.end();
                }
            })
        }
    })
}

function download(req, res) {
    var filename = req.swagger.params.filename.value;
    var img = fs.readFileSync('/var/www/ImperativBaza/BackendREST/documents/' + filename + '');

    var file_extension = path.extname(filename).substring(1);
    console.log(file_extension);
    var ctype = "";

    switch (file_extension) {
        case "pdf":
            ctype = "application/pdf";
            break;
        case "htm":
            ctype = "text/html";
            break;
        case "exe":
            ctype = "application/octet-stream";
            break;
        case "zip":
            ctype = "application/zip";
            break;
        case "doc":
            ctype = "application/msword";
            break;
        case "xls":
            ctype = "application/vnd.ms-excel";
            break;
        case "ppt":
            ctype = "application/vnd.ms-powerpoint";
            break;
        case "gif":
            ctype = "image/gif";
            break;
        case "png":
            ctype = "image/png";
            break;
        case "jpeg":
            $ctype = "image/jpg";
            break;
        case "jpg":
            ctype = "image/jpg";
            break;
        default:
            ctype = "application/force-download";
    }

    //console.log("Sending...");
    res.setHeader('Content-Type', ctype);
    res.end(img);

}
