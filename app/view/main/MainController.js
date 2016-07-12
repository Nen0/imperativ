/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('BazaProjekata.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main',
    DodajKlijenta: function() {
        console.log(ImperativBaza.Constants.ip); 
        var klijentForm = Ext.create('ImperativBaza.view.Klijenti.ClForm');
        var noviKlijent = Ext.create('Ext.window.Window', {
            height: 500,
            title: "Novi klijent",
            width: 1000,
            modal: true,
            items: [klijentForm],
            scrollable: true,
            buttons: [{
                text: 'Spremi',
                handler: function() {
                    var prozor = this.up('window');
                    var form = this.up('window').down('form');
                    var data = form.getForm().getValues();
                    console.log(data);
                    if (form.isValid()) {
                        Ext.Ajax.request({
                                url: ImperativBaza.Constants.ip+'noviKlijent',
                                method: 'POST',
                                jsonData: data,
                                success: function(response) {
                                    data = Ext.decode(response.responseText);
                                    form.getForm().setValues(data);
                                    Ext.Msg.alert('Kreiran novi klijent', 'Uspješno kreiran novi klijent');
                                    prozor.destroy();
                                    var grid = Ext.ComponentQuery.query('#KlijentiGrid')[0];
                                    store = grid.store;
                                    store.load();
                                }
                            })
                            // console.log(data);
                    }
                }

            }]
        })
        noviKlijent.show();
    },
    BrišiKontakt: function() {
        var grid = Ext.ComponentQuery.query('#KlijentiGrid')[0];
        store = grid.store;
        var selection = grid.getView().getSelectionModel().getSelection()[0];
        if (selection) {
            Ext.Msg.show({
                title: 'Brisanje',
                message: 'Jeste li sigurni da želite obrisati odabranu stavku?',
                buttons: Ext.Msg.YESNO,
                buttonText: {
                    yes: "Da",
                    no: "Ne"
                },
                icon: Ext.Msg.QUESTION,
                fn: function(btn) {
                    if (btn === 'yes') {
                        store.remove(selection);
                    }
                }
            });

        } else {
            Ext.Msg.alert('Greška', 'Potrebno je izabrati redak iz tablice');
        }
    },
    DetaljiKontkta: function() {
        var grid = Ext.ComponentQuery.query('#KlijentiGrid')[0];
        store = grid.store;
        var selection = grid.getView().getSelectionModel().getSelection()[0];
        if (selection) {
            id = selection.data.id;
            var klijentForm = Ext.create('ImperativBaza.view.Klijenti.ClForm', { paramId: id });
            var detalji = Ext.create('Ext.window.Window', {
                requires: [
                    'ImperativBaza.view.Klijenti.ClFormController'
                ],
                controller: 'ClFormController',
                height: 500,
                title: "Detalji projekta",
                width: 1000,
                modal: true,
                scrollable: true,
                items: [klijentForm],
                buttons: [{
                    text: 'Spremi promjene',
                    handler: function() {
                        var prozor = this.up('window');
                        var form = this.up('.window').down('.form');
                        var data = form.getForm().getValues();
                        if (form.isValid()) {
                            Ext.Ajax.request({
                                url: ImperativBaza.Constants.ip+'noviKlijent/' + id + '',
                                method: 'POST',
                                jsonData: data,
                                success: function(data) {
                                    data = JSON.parse(data.responseText);
                                    form.getForm().setValues(data);
                                    Ext.Msg.alert('Uspješno', 'Podaci uspješno promijenjeni');
                                    prozor.destroy();
                                    var grid = Ext.ComponentQuery.query('#KlijentiGrid')[0];
                                    store = grid.store;
                                    store.load();
                                }
                            })
                        }
                    }
                }]

            }).show()

        } else {
            Ext.Msg.alert('Greška', 'Potrebno je izabrati redak iz tablice.');
        }
    },
    Dokumenti: function() {
        var grid = Ext.ComponentQuery.query('#KlijentiGrid')[0];
        store = grid.store;
        var selection = grid.getView().getSelectionModel().getSelection()[0];
        if (selection) {
            id = selection.data.id;
            var docForm = Ext.create('ImperativBaza.view.Dokumenti.KlijentDoc', { paramId: id });
            var detalji = Ext.create('Ext.window.Window', {
                controller: 'KlijentDocController',
                height: 500,
                title: "Dokumenti",
                width: 1000,
                modal: true,
                scrollable: true,
                items: [docForm]

            }).show()

        } else {
            Ext.Msg.alert('Greška', 'Potrebno je izabrati redak iz tablice.');
        }
    },
    DodajProjekt: function() {
        /*

                var grid = Ext.ComponentQuery.query('#ProjektiGrid')[0];
                store = grid.store;
                var r = Ext.create('BazaProjekata.store.ProjektListModel');
                //console.log(r)
                store.insert(0, r);*/
        var projektForm = Ext.create('ImperativBaza.view.Projekti.PrForm');
        var noviProjekt = Ext.create('Ext.window.Window', {
            height: 400,
            title: "Novi projekt",
            width: 800,
            modal: true,
            items: [projektForm],
            scrollable: true,
            buttons: [{
                text: 'Spremi',
                handler: function() {
                    var prozor = this.up('window');
                    var form = this.up('window').down('form');
                    var data = form.getForm().getValues();
                    //console.log(data);
                    if (form.isValid()) {
                        Ext.Ajax.request({
                                url: ImperativBaza.Constants.ip+'noviProjekt',
                                method: 'POST',
                                jsonData: data,
                                success: function(response) {
                                    data = Ext.decode(response.responseText);
                                    form.getForm().setValues(data);
                                    Ext.Msg.alert('Dodan novi projekt', 'Uspješno kreiran novi projekt');
                                    prozor.destroy();
                                    var grid = Ext.ComponentQuery.query('#ProjektiGrid')[0];
                                    store = grid.store;
                                    store.load();
                                }
                            })
                            // console.log(data);
                    } else {
                        Ext.Msg.alert('Greška', 'Molimo popuniti obavezna polja');
                    }

                }

            }]
        })
        noviProjekt.show();
    },
    BrišiProjekt: function() {
        var grid = Ext.ComponentQuery.query('#ProjektiGrid')[0];
        store = grid.store;
        var selection = grid.getView().getSelectionModel().getSelection()[0];
        if (selection) {
            Ext.Msg.show({
                title: 'Brisanje',
                message: 'Jeste li sigurni da želite obrisati odabranu stavku?',
                buttons: Ext.Msg.YESNO,
                buttonText: {
                    yes: "Da",
                    no: "Ne"
                },
                icon: Ext.Msg.QUESTION,
                fn: function(btn) {
                    if (btn === 'yes') {
                        store.remove(selection);
                    }
                }
            });

        } else {
            Ext.Msg.alert('Greška', 'Molimo izabrati redak koji želite obrisati');
        }
    },
    DetaljiProjekta: function() {
        var grid = Ext.ComponentQuery.query('#ProjektiGrid')[0];
        store = grid.store;
        var selection = grid.getView().getSelectionModel().getSelection()[0];
        if (selection) {
            id = selection.data.id;
            var projektForm = Ext.create('ImperativBaza.view.Projekti.PrForm', { paramId: id });
            var detalji = Ext.create('Ext.window.Window', {
                requires: [
                    'ImperativBaza.view.Projekti.PrFormController'
                ],
                controller: 'PrFormController',
                height: 400,
                title: "Detalji projekta",
                width: 800,
                modal: true,
                scrollable: true,
                items: [projektForm],
                buttons: [{
                    text: 'Spremi promjene',
                    handler: function() {
                        var prozor = this.up('window');
                        var form = this.up('.window').down('.form');
                        var data = form.getForm().getValues();
                        Ext.Ajax.request({
                            url: ImperativBaza.Constants.ip+'noviProjekt/' + id + '',
                            method: 'POST',
                            jsonData: data,
                            success: function(data) {
                                data = JSON.parse(data.responseText);
                                form.getForm().setValues(data);
                                Ext.Msg.alert('Uspješno', 'Podaci uspješno promijenjeni');
                                prozor.destroy();
                                var grid = Ext.ComponentQuery.query('#ProjektiGrid')[0];
                                store = grid.store;
                                store.load();
                            }
                        })
                    }
                }]

            }).show()

        } else {
            Ext.Msg.alert('Greška', 'Potrebno je izabrati redak iz tablice');
        }
    },
    DodajBiljesku: function(a, rowIdx, c, d) {
        var biljeskaForm = Ext.create('ImperativBaza.view.Biljeske.Biljeska');
        var biljeska = Ext.create('Ext.window.Window', {
            height: 350,
            title: "Dodavanje nove bilješke",
            width: 500,
            modal: true,
            items: [biljeskaForm],
            scrollable: true,
            buttons: [{
                text: 'Dodaj bilješku',
                handler: function() {
                    var grid = Ext.ComponentQuery.query('#KlijentiGrid')[0];
                    store = grid.store;
                    rec = store.getAt(rowIdx);
                    id = rec.data.id;
                    //console.log(id);
                    var prozor = this.up('window');
                    var form = this.up('.window').down('.form');
                    var data = form.getForm().getValues();
                    Ext.Ajax.request({
                        url: ImperativBaza.Constants.ip+'addNote/' + id + '',
                        method: 'POST',
                        jsonData: data,
                        success: function(data) {
                            Ext.Msg.alert('Bilješka dodana', 'Pregled bilješki nalazi se u polju "Povijest komunikacije"');
                            prozor.destroy();
                        }
                    })
                }
            }]
        })
        biljeska.show();
    },
    biljeskeKorisniciList: function() {
        var grid = Ext.ComponentQuery.query('#KlijentiGrid')[0];
        var selection = grid.getView().getSelectionModel().getSelection()[0];
        if (selection) {
            id = selection.data.id;
            var store3 = Ext.create('inova.store.KlijentBiljeske')
            store3.getProxy().extraParams = {
                'id': id
            }
            var biljeska = Ext.create('Ext.window.Window', {
                height: 500,
                title: "Bilješke za klijente",
                width: 800,
                modal: true,
                scrollable: true,
                items: [{
                    xtype: 'grid',
                    id: 'klijentBiljeske',
                    store: store3,
                    columns: [{
                        text: 'id',
                        flex: 1,
                        dataIndex: 'id',
                        hidden: true
                    }, {
                        text: "Datum",
                        flex: 1,
                        dataIndex: 'datum'
                    }, {
                        flex: 2,
                        text: "Bilješka",
                        dataIndex: 'opis'
                    }, {
                        text: 'Brisanje',
                        xtype: 'actioncolumn',
                        flex: 0.4,
                        items: [{
                            icon: 'ext/examples/classic/shared/icons/fam/delete.gif',
                            handler: function(a, rowIdx, c, d) {
                                var grid = Ext.ComponentQuery.query('#klijentBiljeske')[0];
                                store = grid.store;
                                rec = store.getAt(rowIdx)
                                id = rec.data.id;
                                Ext.Msg.show({
                                    title: 'Brisanje',
                                    message: 'Jeste li sigurni da želite obrisati odabranu stavku?',
                                    buttons: Ext.Msg.YESNO,
                                    buttonText: {
                                        yes: "Da",
                                        no: "Ne"
                                    },
                                    icon: Ext.Msg.QUESTION,
                                    fn: function(btn) {
                                        if (btn === 'yes') {
                                            store.remove(rec);
                                        }
                                    }
                                });
                            }
                        }]
                    }]
                }]
            })
            biljeska.show();

        } else {
            Ext.Msg.alert('Greška', 'Molimo izabrati redak iz tablice');

        }
    },
    sendMail: function() {
        var mailForm = Ext.create('ImperativBaza.view.Mail.MailForm');
        var grid1 = Ext.ComponentQuery.query('#KlijentiGrid')[0];
        store1 = grid1.store;
        var numberOfRows = store1.getCount();
        var add = '';
        for (i = 0; i <= numberOfRows - 1; i++) {
            var email = store1.getAt(i).data.email
            if (email || 0 !== email.length) {
                //console.log(email);
                add = add + ',' + email;
            }
        }
        address = add.substring(1);
        adressField = mailForm.items.items[0].items.items[0] /// bolje ne pitaj sta je ovo
        adressField.setValue(address)

        //provjera je li pronađena ijedna mail adresa u gridu
        if (address || 0 !== address.length) {
            var mailWindow = Ext.create('Ext.window.Window', {
                height: 500,
                width: 800,
                title: 'Slanje maila',
                defaults: {
                    width: 750
                },
                items: [mailForm],
                buttons: [{
                    text: 'Pošalji',
                    handler: function() {
                        var form = this.up('window').down('form');
                        var data = form.getForm().getValues();

                        Ext.Ajax.request({
                                url: ImperativBaza.Constants.ip+'sendMail',
                                method: 'POST',
                                jsonData: data,
                                success: function(response) {
                                    Ext.Msg.alert('Mail poslan', 'Email je uspješno poslan');
                                    mailWindow.close();
                                }
                            })
                            //console.log(data);
                    }
                }]
            })
            mailWindow.show();
        } else {
            Ext.MessageBox.show({
                title: 'Nije pronađena ni jedna mail adresa',
                msg: 'Molimo provjerite filtrirane podatke o klijentima',
                icon: Ext.MessageBox.ERROR,
                buttons: Ext.Msg.OK
            })
        }
    },
    PosaljiMailKorisniku: function(a, rowIdx, c, d) {
        var mailForm = Ext.create('ImperativBaza.view.Mail.MailForm');
        var grid1 = Ext.ComponentQuery.query('#KlijentiGrid')[0];
        store1 = grid1.store;
        rec = store1.getAt(rowIdx);
        address = rec.data.email;

        //provjera je li pronađena ijedna mail adresa u gridu
        if (address || 0 !== address.length) {
            adressField = mailForm.items.items[0].items.items[0]
            adressField.setValue(address);
            //console.log(mailForm.items.items[0].items.items[0]);
            var mailWindow = Ext.create('Ext.window.Window', {
                height: 500,
                width: 800,
                title: 'Slanje maila',
                defaults: {
                    width: 750
                },
                items: [mailForm],
                buttons: [{
                    text: 'Pošalji',
                    handler: function() {
                        var form = this.up('window').down('form');
                        var data = form.getForm().getValues();

                        Ext.Ajax.request({
                                url: ImperativBaza.Constants.ip+'sendMail',
                                method: 'POST',
                                jsonData: data,
                                success: function(response) {
                                    Ext.Msg.alert('Mail poslan', 'Mail uspješno poslan');
                                    mailWindow.close();
                                }
                            })
                            //console.log(data);
                    }
                }]
            })
            mailWindow.show();
        } else {
            Ext.MessageBox.show({
                title: 'Korisnik nema upisanu mail adresu',
                msg: 'Korisnik u bazi podataka nema spremljenu mail adresu',
                icon: Ext.MessageBox.ERROR,
                buttons: Ext.Msg.OK
            })
        }
    },
    ProjektDokumenti: function() {
        var grid = Ext.ComponentQuery.query('#ProjektiGrid')[0];
        store = grid.store;
        var selection = grid.getView().getSelectionModel().getSelection()[0];
        if (selection) {
            id = selection.data.id;
            var docForm = Ext.create('ImperativBaza.view.Dokumenti.ProjektiDoc', { paramId: id });
            var detalji = Ext.create('Ext.window.Window', {
                controller: 'ProjektDocController',
                height: 500,
                title: "Dokumenti",
                width: 1000,
                modal: true,
                scrollable: true,
                items: [docForm]

            }).show()

        } else {
            Ext.Msg.alert('Greška', 'Potrebno je izabrati redak iz tablice.');
        }
    },
    filterDisable: function(){
        var grid =  Ext.ComponentQuery.query('#KlijentiGrid')[0];        
        grid.filters.clearFilters();
        
    },
    filterDisableProjekti: function () {
    var grid =  Ext.ComponentQuery.query('#ProjektiGrid')[0];        
        grid.filters.clearFilters();
}

});


