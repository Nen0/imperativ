Ext.define('ImperativBaza.view.Biljeske.Biljeska', {
    extend: 'Ext.form.Panel',
    requires: [
        'Ext.form.Panel'
    ],
    defaults: {
        labelWidth: 100,
        padding:'10px'
    },
    items: [{
        xtype: 'datefield',
        name: 'datum',
        format:'d.m.Y',
        fieldLabel: 'Datum kontakta',
        required: true,
        allowBlank: false

    }, {
        xtype: 'textareafield',
        grow: true,
        name: 'note',
        height: 180,
        fieldLabel: 'Bilješka',
        anchor: '90%'
    }]

})
