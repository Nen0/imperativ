var tipov = Ext.create('Ext.data.Store', {
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
var clients = Ext.create('Ext.data.Store', {
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
    //autoload: true
});
//clients.load();
var aaaa = Ext.create('Ext.data.Store', {
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

function render(value, m, rec) {
    return rec.data.text;
}

function renderClients(value, m, rec) {
    return rec.data.name;
}
Ext.define('ImperativBaza.view.Projekti.PrForm', {
    extend: 'Ext.form.Panel',
    requires: [
        'Ext.form.Panel'
    ],
    initComponent: function(config) {
        this.ProjektDocStore = Ext.create('ImperativBaza.store.ProjektDocStore');
        this.items = [{
            fieldLabel: "Naziv projekta",
            required: true,
            xtype: 'textfield',
            allowBlank: false,
            name: 'name'
        }, {

            fieldLabel: 'Klijent',
            name: 'client_id',
            xtype: 'combo',
            store: clients,
            displayField: 'name',
            valueField: 'id',
            renderer: renderClients,
        }, {
            fieldLabel: "Tip projekta",
            name: 'tip',
            renderer: render,
            xtype: 'combo',
            store: tipov,
            displayField: 'text',
            valueField: 'id'
        }, {
            fieldLabel: "Status",
            name: 'status',
            renderer: render,
            xtype: 'combo',
            store: aaaa,
            displayField: 'text',
            valueField: 'id'
        }, {
            fieldLabel: "Vrijednost (u kn sa PDV-om)",
            name: 'vrijednost',
            xtype: 'numberfield',
            allowBlank: false,
            decimalPrecision : 2,
            maxValue: 99999999,
            blankText: 'Ovo polje je obavezno',
            hideTrigger: true
        }]
        this.callParent(arguments)
    },
    id: 'PrForm',
    defaults: {
        labelWidth: 200,
        width: 700,
        padding: '7px'
    }
})
