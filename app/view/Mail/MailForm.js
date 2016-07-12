Ext.define('ImperativBaza.view.Mail.MailForm', {
    extend: 'Ext.form.Panel',
    requires: [
        'Ext.form.Panel'
    ],
    items: [{
        xtype: 'form',
        //id: 'mailForm',
        layout: 'fit',
        items: [{
                xtype: 'textfield',
               // id:'adresaId',
                fieldLabel: 'Mail adresa',
                readOnly: true,
                //value: address,
                padding: '5',
                name: 'adrese'
            },
            /*{
                           xtype: 'multiselect',
                           fieldLabel: 'Mail adresa',
                           store: clients,
                           displayField: 'name',
                           valueField: 'id',
                           renderer: renderClients

                       },*/
            {
                xtype: 'textfield',
                fieldLabel: 'Subject',
                name: 'subject',
                padding: '5'
            }, {
                xtype: 'container',
                items: [{
                    xtype: 'htmleditor',
                    name: 'mailText',
                    height: 380,
                    border: 1
                }]

            }
        ]
    }],
})
