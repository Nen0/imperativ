Ext.define('ImperativBaza.view.Projekti.PrFormController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.PrFormController',

    init: function() {
        var grid = Ext.ComponentQuery.query('#ProjektiGrid')[0];
        store = grid.store;
        var selection = grid.getView().getSelectionModel().getSelection()[0];
        var id = selection.data.id;
        var form = Ext.ComponentQuery.query('#PrForm')[0]

        Ext.Ajax.request({
            url: ImperativBaza.Constants.ip+'noviProjekt/' + id + '',
            method: 'GET',
            success: function(data) {
                data = JSON.parse(data.responseText);
                //console.log(data);
                form.getForm().setValues(data);
            }
        })

    },
    noviDokument: function() {
        var grid = Ext.ComponentQuery.query('#ProjektdokumentiGrid')[0];
        store = grid.store;
        var r = Ext.create('BazaProjekata.store.DocStoreModel');
        //console.log(r)
        store.insert(0, r);
    },
    deleteDokument: function() {
        var grid = Ext.ComponentQuery.query('#ProjektdokumentiGrid')[0];
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

});
