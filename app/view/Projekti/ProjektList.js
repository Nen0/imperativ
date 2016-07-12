  var kStore = Ext.create('Ext.data.Store', {
     fields: [
         { name: 'id' },
         { name: 'name' }
     ],
     proxy: {
         type: 'rest',
         url: 'http://127.0.0.1:10010/clientCombo',
         reader: {
             type: 'json',
             rootProperty: 'data'
         }
     },
     autoload: true
 });
 Ext.Loader.setConfig({ enabled: true });

 Ext.Loader.setPath('Ext.ux', '../ux');
 var encode = false;
 var local = true;
 var filters = {
     ftype: 'filters',
     // encode and local configuration options defined previously for easier reuse
     //encode: encode, // json encode the filter query
     local: local, // defaults to false (remote filtering)
     //
     //// Filters are most naturally placed in the column definition, but can also be
     // added here.
     // filters: [{
     //      type: 'boolean',
     //     dataIndex: 'visible'
     // }]
 };
 var kStore = Ext.create('Ext.data.Store', {
     fields: [
         { name: 'id' },
         { name: 'name' }
     ],
     proxy: {
         type: 'rest',
         url: 'http://127.0.0.1:10010/clientCombo',
         reader: {
             type: 'json',
             rootProperty: 'data'
         }
     },
     autoload: true
 });

 var tipoviStore = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'id' },
        { name: 'text' }
    ],
    data: [
        { id: 1, text: 'Strateški' },
        { id: 2, text: 'Lokalni' }
    ],
    autoload: true
});

 function renderKlijent(a, b, c, d) {
    a = c.data.client_id;    
     b = kStore.findRecord('id', a)     
     console.log(kStore)
     if (tip) {
         return tip.data.name
     } else {
         return ''
     }
 }
 function renderTip(a,b,c,d){
    a = c.data.tip;
     tip = tipoviStore.findRecord('id', a)     
     if (tip) {
         return tip.data.text
     } else {
         return ''
     }
 }

 function renderStatusa(a, b, c, d) {
     a = c.data.status;
     tip = statusStore.findRecord('id', a)
     if (tip) {
         return tip.data.text
     } else {
         return ''
     }
 }
 var statusStore = Ext.create('Ext.data.Store', {
     fields: [
         { name: 'id' },
         { name: 'text' }
     ],
     data: [
         { id: 1, text: 'Pokrenut' },
         { id: 2, text: 'Prekinut' },
         { id: 3, text: 'Završen' }
     ],
     autoload: true
 });
 Ext.define('ImperativBaza.view.Projekti.ProjektList', {
     extend: 'Ext.grid.Panel',
     requires: [
         'Ext.grid.Panel',
         'Ext.ux.grid.FiltersFeature',
     ],
     xtype: 'grid',
     features: [filters],
     scrollable: true,
     id: 'ProjektiGrid',
     store: {
         type: 'ProjektList'
     },
     columns: [{
             text: 'id',
             flex: 1,
             dataIndex: 'id',
             hidden: true
         }, {
             text: "Naziv projekta",
             flex: 3,
             dataIndex: 'name',
             filter: {
                 type: 'string'
             }
         }, {
             flex: 2,
             hidden:true,
             text: "Klijent",
             dataIndex: 'client_id',
            // renderer: renderKlijent,
             field: {
                 xtype: 'combo',
                 store: kStore,

                 displayField: 'name',
                 valueField: 'id'
             },
             filter: {
                 type: 'string'                 
             }

         }, {
             flex: 2,
             text: "Tip projekta",
             dataIndex: 'tip',
             renderer: renderTip,             
             field: {
                 xtype: 'combo',
                 store: tipoviStore,
                 displayField: 'text',
                 valueField: 'id'
             },
             filter: {
                 type: 'list',
                 store: tipoviStore                 
             }
         }, {
             flex: 2,
             text: "Status",
             dataIndex: 'status',
             renderer: renderStatusa,
             field: {
                 xtype: 'combo',
                 store: statusStore,
                 displayField: 'text',
                 valueField: 'id'
             },
             filter: {
                 type: 'list',
                 store: statusStore
             }
         }, {
             flex: 2,
             text: "Vrijednost",
             dataIndex: 'vrijednost',
             filter: {
                 type: 'numeric'
             }
         }

     ]
 })
