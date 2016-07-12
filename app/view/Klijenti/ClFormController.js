Ext.define('ImperativBaza.view.Klijenti.ClFormController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.ClFormController',

    init: function() {
        
        var grid = Ext.ComponentQuery.query('#KlijentiGrid')[0];
        store = grid.store;
        var selection = grid.getView().getSelectionModel().getSelection()[0];
        var id = selection.data.id;
        var form = Ext.ComponentQuery.query('#ClForm')[0]

        Ext.Ajax.request({
            url: ImperativBaza.Constants.ip+'noviKlijent/' + id + '',
            method: 'GET',
            success: function(data) {
                data = JSON.parse(data.responseText);
                //console.log(data);
                form.getForm().setValues(data);
            }
        })

    }

});
