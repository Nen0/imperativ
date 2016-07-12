
Ext.define('ImperativBaza.store.DocStore', {    
    extend: 'Ext.data.Store',
    model:'BazaProjekata.store.ProjektListModel',
    alias: 'store.DocStore',    
    proxy: {
        type: 'rest',
        url: 'http://127.0.0.1:10010/documentList',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    },
    autoLoad: true,
    autoSync: true
});
Ext.define('BazaProjekata.store.DocStoreModel',{
    extend:'Ext.data.Model',
    fields: [
        { name: 'id' },
        { name: 'docname' },
        { name: 'filename' }
    ],
});
