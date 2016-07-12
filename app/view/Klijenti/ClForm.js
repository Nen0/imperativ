var zupanijaStore = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'id' },
        { name: 'text' }
    ],
    data: [
        { id: 1, text: 'Bjelovarsko-bilogorska županija' },
        { id: 2, text: 'Brodsko-posavska županija' },
        { id: 3, text: 'Dubrovačko-neretvanska županija ' },
        { id: 4, text: 'Istarska županija' },
        { id: 5, text: 'Karlovačka županija' },
        { id: 6, text: 'Koprivničko-križevačka županija' },
        { id: 7, text: 'Krapinsko-zagorska županija ' },
        { id: 8, text: 'Ličko-senjska županija' },
        { id: 9, text: 'Međimurska županija ' },
        { id: 10, text: 'Osječko-baranjska županija' },
        { id: 11, text: 'Požeško-slavonska županija' },
        { id: 12, text: 'Primorsko-goranska županija ' },
        { id: 13, text: 'Sisačko-moslavačka županija' },
        { id: 14, text: 'Splitsko-dalmatinska županija' },
        { id: 15, text: 'Varaždinska županija' },
        { id: 16, text: 'Virovitičko-podravska županija' },
        { id: 17, text: 'Vukovarsko-srijemska županija' },
        { id: 18, text: 'Zadarska županija ' },
        { id: 19, text: 'Zagrebačka županija' },
        { id: 20, text: 'Šibensko-kninska županija' },
        { id: 21, text: 'Grad Zagreb' }
    ],
    autoload: true
});
var edkategorija = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'id' },
        { name: 'text' }
    ],
    data: [
        { id: 1, text: 'Kategorija 1' },
        { id: 2, text: 'Kategorija 2' }
    ],
    autoload: true
});
var vrstapaketa = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'id' },
        { name: 'text' }
    ],
    data: [
        { id: 1, text: 'Izbor a' },
        { id: 2, text: 'Izbor b' }
    ],
    autoload: true
});
var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
    clicksToEdit: 1
});

function render(value, m, rec) {
    return rec.data.text;
}
Ext.define('ImperativBaza.view.Klijenti.ClForm', {
    paramId: false,
    initComponent: function(config) {       
        this.items = [{
            xtype: 'textfield',
            name: 'name',
            fieldLabel: 'Naziv',
            required: true,
            allowBlank: false,
            padding: '7px'
        }, {
            xtype: 'container',
            width: 900,
            layout: {
                type: 'hbox'
            },
            defaults: {
                flex: 1,
                labelWidth: 200,
                padding: '5px'
            },
            items: [{
                xtype: 'combo',
                name: 'pravnioblik',
                renderer: render,
                store: pravniOblik,
                valueField: 'id',
                displayField: 'text',
                fieldLabel: 'Pravni oblik subjekta'
            }, {
                xtype: 'numberfield',
                fieldLabel: 'OIB',
                hideTrigger: true,
                minLength: 11,
                maxLength: 11,
                name: 'oib',
                required: true

            }]
        }, {
            xtype: 'container',
            layout: {
                type: 'hbox'
            },
            defaults: {
                flex: 1,
                labelWidth: 200,
                padding: '5px'
            },
            items: [{
                xtype: 'textfield',
                fieldLabel: 'Ulica i broj',
                name: 'ulica'

            }, {
                xtype: 'textfield',
                fieldLabel: 'Telefon',
                name: 'telefon',
                hideTrigger: true
            }]
        }, {
            xtype: 'container',
            layout: {
                type: 'hbox'
            },
            defaults: {
                flex: 1,
                labelWidth: 200,
                padding: '5px'
            },
            items: [{
                xtype: 'numberfield',
                fieldLabel: 'Poštanski broj',
                name: 'postanskibroj',
                hideTrigger: true
            }, {
                xtype: 'textfield',
                fieldLabel: 'Faks',
                name: 'fax',
                hideTrigger: true
            }]
        }, {
            xtype: 'container',
            layout: {
                type: 'hbox'
            },
            defaults: {
                flex: 1,
                labelWidth: 200,
                padding: '5px'
            },
            items: [
            {
                xtype: 'combo',
                fieldLabel: 'Županija',
                store: zupanijaStore,
                valueField: 'id',
                displayField: 'text',
                name: 'zupanija'
            }, {
                xtype: 'textfield',
                fieldLabel: 'E-mail',
                vtype: 'email',
                name: 'email'
            }, ]
        }, {
            xtype: 'container',
            layout: {
                type: 'hbox'
            },
            defaults: {
                flex: 1,
                labelWidth: 200,
                padding: '5px'
            },
            items: [{
                xtype: 'textfield',
                fieldLabel: 'Grad / Općina',
                name: 'grad'
            }, {
                xtype: 'textfield',
                fieldLabel: 'Web stranica',
                name: 'web'
            }]
        }, {
            xtype: 'fieldset',
            width: 980,
            title: 'Važni datumi',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {
                padding: '5px',
                labelWidth: 180
            },

            items: [{
                xtype: 'datefield',
                format: "d.m.Y",
                fieldLabel: 'Datum zadnjeg kontakta',
                name: 'zadnjikontakt',
                flex: 1
            }, {
                xtype: 'datefield',
                format: "d.m.Y",
                fieldLabel: 'Datum uključenja',
                name: 'datumukljucenja',
                flex: 1
            }, {
                xtype: 'datefield',
                format: "d.m.Y",
                fieldLabel: 'Datum isteka usluge',
                name: 'datumisteka',
                flex: 1
            }]
        }, {
            xtype: 'numberfield',
            fieldLabel: 'Broj stanovnika u općini/gradu sjedišta subjekta',
            name: 'broj_stanovnika',
            hideTrigger: true
        }, {
            xtype: 'combo',
            name: 'edkategorija',
            renderer: render,
            store: edkategorija,
            valueField: 'id',
            displayField: 'text',
            fieldLabel: 'Kategorija subjekta prema ED klasifikaciji',
            width: 900
        }, {
            xtype: 'combo',
            renderer: render,
            store: vrstapaketa,
            valueField: 'id',
            displayField: 'text',
            name: 'vrstapaketa',
            fieldLabel: 'Vrsta paketa',
            width: 900
        }, {
            xtype: 'textfield',
            fieldLabel: 'Vezane objave za klijenta',
            name: 'objaveklijent',
            width: 900
        }, {
            xtype: 'textfield',
            fieldLabel: 'Napomena',
            name: 'napomena',
            width: 900
        }]
        this.callParent(arguments)
    },
    extend: 'Ext.form.Panel',
    paramId: false,
    requires: [
        'Ext.form.Panel'
    ],
    defaults: {
        labelWidth: 200,
        width: 900
    },
    id: 'ClForm'
})
