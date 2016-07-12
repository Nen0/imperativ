
Ext.define('ImperativBaza.store.ProjektDocStore', {    
    extend: 'Ext.data.Store',
    model:'BazaProjekata.store.ProjektListModel',
    alias: 'store.ProjektDocStore',    
    proxy: {
        type: 'rest',
        url: 'http://127.0.0.1:10010/documentLista',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    },
    autoLoad: true,
    autoSync: true
});

