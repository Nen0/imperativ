Ext.define('inova.store.KlijentBiljeske', {
    fields: [
        'id', 'datum', 'note'
    ],
    param:false,
    extend: 'Ext.data.Store',
    alias: 'store.KlijentBiljeske',
    proxy: {
        type: 'rest',               
        reader: {
            type: 'json'
        },
        url: 'http://127.0.0.1:10010/KlijentBiljeske/'
    },    
    autoLoad: true,
    autoSync: true
});