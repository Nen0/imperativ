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
    ProjektDokumentiList: ProjektDokumentiList,
    noviDokument: noviDokument,
    uploadDoc: uploadDoc,
    downloadDoc: downloadDoc,
    deleteDokument: deleteDokument,
    izmjenaDokument: izmjenaDokument
};

function ProjektDokumentiList(req, res) {
    var client = new pg.Client(conString);
    var projekt_id = undefined || req.swagger.params.id.value;
    if (projekt_id === undefined) {
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
                    projektdokumenti d
                    join sadrzaj s on s.id=d.id
                  where  s.active = 1 and d.projekt_id='` + projekt_id + `' `;               
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
}

function noviDokument(req, res) {
    var projekt_id = req.swagger.params.id.value;
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
             values ('Novi dokument',NOW(),5) RETURNING id, name`;
            console.log(query)
            client.query(query, function(err, result) {
                if (err) {
                    return console.error('error running query', err);
                    client.end();
                } else {
                    var id = result.rows[0].id;
                    var name = result.rows[0].name;
                    query = `insert into projektdokumenti
                     (id,projekt_id, docname)
                      values (` + id + `, ` + projekt_id + `, '` + name + `')`;
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

function deleteDokument(req, res) {
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

function uploadDoc(req, res) {
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
    var path = '/var/www/ImperativBaza/BackendREST/documents/projekti/' + name + '';
    var buffer = new Buffer(file.buffer);
    var random = new Date().getTime();
    fs.readFile(path, function(err, data) {
        if (err) {
            path = path

        } else if (data) {
            var changeName = name.split('.');
            var newName = changeName[0] + random + '.' + changeName[1];
            path = '/var/www/ImperativBaza/BackendREST/documents/projekti/' + newName + '';
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

function izmjenaDokument(req, res) {

    var id = req.swagger.params.id.value;
    var data = JSON.parse(req.swagger.params.docname.value);
    var query = '';
    if (data.docname) {
        query = `Update projektdokumenti set 
                docname = '` + data.docname + `'                
            where id =` + id + ` `;
    }
    if (data.filename) {
        query = `Update projektdokumenti set 
                filename = '` + data.filename + `'                
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

function downloadDoc(req, res) {
    var filename = req.swagger.params.filename.value;
    var img = fs.readFileSync('/var/www/ImperativBaza/BackendREST/documents/projekti/' + filename + '');

    var file_extension = path.extname(filename).substring(1);
    // console.log(file_extension);
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
