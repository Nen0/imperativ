Ext.Loader.setConfig({
    enabled: true
});
Ext.Loader.setPath('Ext.ux', '../ux');
var klijentList = Ext.create('ImperativBaza.view.Klijenti.ClientList');
var projektList = Ext.create('ImperativBaza.view.Projekti.ProjektList');
var kategorijeStore = Ext.create('Ext.data.Store', {
    fields: ['kategorija'],
    data: [{
        "kategorija": "Ime",
        "value": "name"
    }, {
        "kategorija": "OIB",
        "value": "oib"
    }, {
        "kategorija": "Adresa",
        "value": "ulica"
    }, {
        "kategorija": "Grad",
        "value": "grad"
    }, {
        "kategorija": "Županija",
        "value": "zupanija"
    }, {
        "kategorija": "Telefon",
        "value": "telefon"
    }]
})
var tipovi = Ext.create('Ext.data.Store', {
    fields: [{
        name: 'id'
    }, {
        name: 'text'
    }],
    data: [{
        id: 1,
        text: 'Izbor a'
    }, {
        id: 2,
        text: 'Izbor b'
    }],
    autoload: true
});
var clients = Ext.create('Ext.data.Store', {
    fields: [{
        name: 'id'
    }, {
        name: 'name'
    }],
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
clients.load()
var statusiStore = Ext.create('Ext.data.Store', {
    fields: [{
        name: 'id'
    }, {
        name: 'text'
    }],
    data: [{
        id: 1,
        text: 'a'
    }, {
        id: 2,
        text: 'b'
    }],
    autoload: true
});

function renderTip(a, b, c, d) {
    tip = c.data.tip;;
    tip = tipovi.findRecord('id', tip)
    if (tip) {
        return tip.data.text
    } else {
        return ''
    }
}

function renderClient(a, b, c, d) {
    klijenName = clients.findRecord('id', c.data.client_id)
    if (klijenName) {
        return klijenName.data.name
    } else {
        return ''
    }
}

function renderStatus(a, b, c, d) {
    status = c.data.status;
    statusrender = statusiStore.findRecord('id', status)
    if (statusrender) {
        return statusrender.data.text
    } else {
        return ''
    }
}
var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
    clicksToEdit: 1
});
Ext.define('BazaProjekata.view.main.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'app-main',
    requires: [
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',

        'BazaProjekata.view.main.MainController',
        'BazaProjekata.view.main.MainModel',
        'BazaProjekata.view.main.List',
        // 'Ext.ux.grid.FiltersFeature',
        //'BazaProjekata.store.KlijentList',
        'Ext.data.proxy.Rest'
    ],
    controller: 'main',
    viewModel: 'main',
    ui: 'navigation',

    tabBarHeaderPosition: 1,
    titleRotation: 0,
    tabRotation: 0,

    header: {
        layout: {
            align: 'stretchmax'
        },
        title: {
            bind: {
                text: 'Imperativ'
            },
            flex: 0
        },
        iconCls: 'fa-th-list'
    },

    tabBar: {
        flex: 1,
        layout: {
            align: 'stretch',
            overflowHandler: 'none'
        }
    },
    responsiveConfig: {
        tall: {
            headerPosition: 'top'
        },
        wide: {
            headerPosition: 'left'
        }
    },
    defaults: {
        bodyPadding: 20,
        tabConfig: {
            plugins: 'responsive',
            responsiveConfig: {
                wide: {
                    iconAlign: 'left',
                    textAlign: 'left'
                },
                tall: {
                    iconAlign: 'top',
                    textAlign: 'center',
                    width: 120
                }
            }
        }
    },
    items: [{
        layout: 'fit',
        title: 'Evidencija klijenata',
        iconCls: 'fa-users',
        items: [{
            xtype: 'panel',
            layout: 'fit',
            //scrollable:'true',
            title: 'Evidencija kontakata, korisnika/ potencijalnih klijenata',
            tbar: [{
                text: 'Dodaj novog klijenta',
                buttonAlign: 'left',
                icon: 'ext/examples/classic/shared/icons/fam/user_add.png',
                handler: 'DodajKlijenta'
            }, {
                text: 'Detalji',
                buttonAlign: 'right',
                icon: 'ext/examples/classic/shared/icons/fam/user.png',
                handler: 'DetaljiKontkta'
            }, {
                text: 'Briši',
                buttonAlign: 'right',
                icon: 'ext/examples/classic/shared/icons/fam/user_delete.png',
                handler: 'BrišiKontakt'
            }, {
                text: 'Dokumenti',
                buttonAlign: 'right',
                icon: 'ext/examples/classic/shared/icons/fam/book.png',
                handler: 'Dokumenti'
            }, {
                text: 'Povijest komunikacije',
                buttonAlign: 'right',
                icon: 'ext/examples/classic/shared/icons/fam/add_note.png',
                handler: 'biljeskeKorisniciList'
            }, {
                text: 'Pošalji mail svim korisnicima iz tablice',
                buttonAlign: 'right',
                icon: 'ext/examples/classic/shared/icons/fam/mail.png',
                handler: 'sendMail'
            }, {
                text: 'Poništi sve filere',
                buttonAlign: 'right',
                icon: 'ext/examples/classic/shared/icons/fam/mail.png',
                handler: 'filterDisable'
            }],
            items: [klijentList]
        }]
    }, {
        title: 'Evidencija projekata',
        iconCls: 'fa-users',
        layout: 'fit',
        items: [{
            xtype: 'panel',
            title: 'Baza podataka projekata',
            tbar: [{
                text: 'Dodaj novi projekt',
                buttonAlign: 'left',
                icon: 'ext/examples/classic/shared/icons/fam/user_add.png',
                handler: 'DodajProjekt'
            }, {
                text: 'Detalji',
                buttonAlign: 'right',
                icon: 'ext/examples/classic/shared/icons/fam/user.png',
                handler: 'DetaljiProjekta'
            }, {
                text: 'Briši',
                buttonAlign: 'right',
                icon: 'ext/examples/classic/shared/icons/fam/user_delete.png',
                handler: 'BrišiProjekt'
            }, {
                text: 'Dokumenti',
                buttonAlign: 'right',
                icon: 'ext/examples/classic/shared/icons/fam/book.png',
                handler: 'ProjektDokumenti'
            }, {
                text: 'Poništi sve filere',
                buttonAlign: 'right',
                icon: 'ext/examples/classic/shared/icons/fam/mail.png',
                handler: 'filterDisableProjektis'
            }],
            items: [projektList]
        }]
    }]
});