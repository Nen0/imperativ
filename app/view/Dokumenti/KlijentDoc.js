Ext.define('ImperativBaza.view.Dokumenti.KlijentDoc', {
    extend: 'Ext.form.Panel',
    requires: [
        'Ext.form.Panel'
    ],
    initComponent: function(config) {
        this.asd = this.paramId;
        this.DocStore = Ext.create('ImperativBaza.store.DocStore');
        this.DocStore.getProxy().extraParams = {
            'id': this.asd
        }
        this.items = [{
            xtype: 'grid',
            id: 'KlijentDokumentiGrid',
            plugins: [cellEditing],
            store: this.DocStore,
            columns: [{
                text: 'Id',
                dataIndex: 'id',
                flex: 1,
                hidden: true
            }, {
                text: 'Naziv dokumenta',
                dataIndex: 'docname',
                flex: 2,
                field: {
                    xtype: 'textfield',
                    allowBlank: false
                }
            }, {
                text: 'Naziv datoteke',
                dataIndex: 'filename',
                flex: 2
            }, {
                xtype: 'actioncolumn',
                text: 'Prijenos',
                icon: 'ext/examples/classic/shared/icons/fam/folder_go.png',
                handler: function(grid, rowIndex, colIndex) {
                    Ext.create('Ext.window.Window', {
                        height: 200,
                        width: 400,
                        modal: true,
                        fixedcenter: true,
                        items: [{
                            xtype: 'form',
                            id: 'formItem',
                            items: [{
                                xtype: 'filefield',
                                id: 'filefield',
                                fieldLabel: 'Dokument:',
                                name: 'file',
                                labelWidth: 100,
                                anchor: '100%',
                                buttonText: 'Odaberi datoteku...',
                                allowBlank: false
                            }]
                        }],
                        buttons: [{
                            text: 'Dodaj datoteku',
                            handler: function() {
                                var myField = Ext.getCmp('formItem');
                                var forma = myField.getForm();
                                //console.log(forma.getValues());
                                if (forma.isValid()) {
                                    var domFileItem = document.getElementById(this.up(".window").down('.filefield').fileInputEl.id);
                                    var uploadFile = domFileItem.files[0];
                                    var formData = new FormData();
                                    formData.append('file', uploadFile, uploadFile.name);
                                    xhr = new XMLHttpRequest();
                                    var window = this.up('.window');
                                    xhr.open('POST', ImperativBaza.Constants.ip+'uploadDoc/', true);
                                    xhr.onload = function() {
                                        if (xhr.status === 200) {
                                            window.destroy();
                                            var filename = xhr.responseText;
                                            rec = grid.getStore().getAt(rowIndex);
                                            rec.set('filename', filename.slice(1, -1));

                                        } else {
                                            alert('An error occurred!');
                                        }
                                    };
                                    xhr.send(formData);
                                }
                            }
                        }]
                    }).show();

                }
            }, {
                text: 'Preuzimanje',
                xtype: 'actioncolumn',
                flex: 1,
                items: [{
                    icon: 'ext/examples/classic/shared/icons/fam/folder_go.png',
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = grid.getStore().getAt(rowIndex);
                        filename = rec.get('filename');
                        if (filename) {
                            window.open(ImperativBaza.Constants.ip+'downdoc/' + filename + '');
                        } else {
                            alert('Odabrani dokument nema spremljenu ni jednu datoteku')
                        }

                    }
                }]
            }],
        }]
        this.callParent(arguments)
    },
    width: 980,
    tbar: [{
        text: 'Dodaj novi dokument',
        buttonAlign: 'left',
        icon: 'ext/examples/classic/shared/icons/fam/add.gif',
        handler: 'noviDokument'
    }, {
        text: 'Obriši',
        buttonAlign: 'right',
        handler: 'deleteDokument'
    }]
})
