Ext.define('ImperativBaza.view.Klijenti.KlijentDocController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.KlijentDocController',

    noviDokument: function() {
        var grid = Ext.ComponentQuery.query('#KlijentDokumentiGrid')[0];
        store = grid.store;
        var r = Ext.create('BazaProjekata.store.DocStoreModel');
        //      console.log(r)
        store.insert(0, r);
    },

    deleteDokument: function() {
        var grid = Ext.ComponentQuery.query('#KlijentDokumentiGrid')[0];
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
            Ext.Msg.alert('Greška', 'Potrebno je izabrati redak');
        }
    }

})
