Ext.define('ImperativBaza.store.KlijentList', {
    requires:[
        'ImperativBaza.model.klijentiModel'
    ],
    model:'ImperativBaza.model.klijentiModel',
    extend: 'Ext.data.Store',
    alias: 'store.KlijentList',    
    proxy: {
        type: 'rest',
        reader: {
            type: 'json'
        },
        url: 'http://127.0.0.1:10010/KlijentList'
    },    
    autoLoad: true,
    autoSync: true
});
