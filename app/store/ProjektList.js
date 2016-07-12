Ext.define('BazaProjekata.store.ProjektListModel',{
	extend:'Ext.data.Model',
    fields: [
        'id', 'name', 'tip','status','vrijednost'
    ]
});
Ext.define('BazaProjekata.store.ProjektList', {
	
	model: 'BazaProjekata.store.ProjektListModel',    
    extend: 'Ext.data.Store',
    alias: 'store.ProjektList',
    proxy: {
        type: 'rest',
        reader: {
            type: 'json'
        },
        url: 'http://127.0.0.1:10010/ProjektList'
    },
    autoLoad: true,
    autoSync: true
});
