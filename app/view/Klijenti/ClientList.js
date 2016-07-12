Ext.Loader.setConfig({ enabled: true });
Ext.Loader.setPath('Ext.ux', '../ux');
var encode = false;
var local = true;
var asd = Ext.create('ImperativBaza.store.KlijentList')
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
var pravniOblik = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'id' },
        { name: 'text' }
    ],
    data: [
        { id: 1, text: 'Obrt' },
        { id: 2, text: 'Društvo s ograničenom odgovornošću (d.o.o.)' },
        { id: 3, text: 'Dioničko društvo (d.d.)' },
        { id: 4, text: 'Javno trgovačko društvo (j.d.d)' },
        { id: 5, text: 'Komanditno društvo (k.d.)' },
        { id: 6, text: 'Gospodarsko interesno udruženje (GIU)' },
        { id: 7, text: 'Predstavništvo' }
    ],
    autoload: true
});
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
function renderZup(a, b, c, d) {
    a = c.data.zupanija;
    tip = zupanijaStore.findRecord('id', a)
    if (tip) {
        return tip.data.text
    } else {
        return ''
    }
}


function renderPrOblik(a, b, c, d) {
    a = c.data.pravnioblik;
    tip = pravniOblik.findRecord('id', a)
    if (tip) {
        return tip.data.text
    } else {
        return ''
    }
}
var edkategorijaStore = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'id' },
        { name: 'text' }
    ],
    data: [
        { id: 1, text: 'Bosko' },
        { id: 2, text: 'Ivan' }
    ],
    autoload: true
});

function renderED(a, b, c, d) {
    a = c.data.edkategorija;
    tip = edkategorijaStore.findRecord('id', a)
    if (tip) {
        return tip.data.text
    } else {
        return ''
    }
}
var vrstapaketaStore = Ext.create('Ext.data.Store', {
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
vrstapaketaStore.load()

function renderPaket(a, b, c, d) {
    a = c.data.vrstapaketa;
    tip = vrstapaketaStore.findRecord('id', a)
    if (tip) {
        return tip.data.text
    } else {
        return ''
    }
}
Ext.define('ImperativBaza.view.Klijenti.ClientList', {
    extend: 'Ext.grid.Panel',
    requires: [
        'Ext.grid.Panel',
        'Ext.ux.grid.FiltersFeature',
    ],
    features: [filters],
    scrollable: true,
    itemId: 'KlijentiGrid',
    store: asd,
    columns: [{
        text: 'id',
        flex: 1,
        dataIndex: 'id',
        hidden: true
    }, {
        text: "Naziv klijenta",
        minWidth: 200,
        flex: 3,
        dataIndex: 'name',
        filter: {
            type: 'string'
        }
    }, {
        flex: 2,
        text: "E-mail",
        minWidth: 200,
        dataIndex: 'email',
        filter: {
            type: 'string'
        }
    }, {
        flex: 2,
        text: "Adresa",
        minWidth: 150,
        dataIndex: 'ulica',
        filter: {
            type: 'string'
        }
    }, {
        width: 200,
        text: "Poštanski broj",
        minWidth: 100,
        dataIndex: 'postanskibroj',
        hidden: true,
        filter: {
            type: 'string'
        }
    }, {
        flex: 2,
        text: "Grad",
        minWidth: 100,
        dataIndex: 'grad',
        filter: {
            type: 'string'
        }
    }, {
        flex: 2,
        text: "Županija",
        filter: {
            type: 'list',
            store: zupanijaStore
        },
        minWidth: 200,
        dataIndex: 'zupanija',
        displayField: 'zupanija',
        valueField:'id',
        renderer: renderZup
    }, {
        text: 'Bilješka',
        xtype: 'actioncolumn',
        flex: 1,
        items: [{
            icon: 'ext/examples/classic/shared/icons/fam/add_note.png',
            handler: 'DodajBiljesku'
        }]
    }, {
        text: 'E-mail',
        xtype: 'actioncolumn',
        flex: 1,
        items: [{
            icon: 'ext/examples/classic/shared/icons/fam/mail.png',
            handler: 'PosaljiMailKorisniku'
        }]
    }, {
        text: "Pravni oblik subjekta",
        dataIndex: 'pravnioblik',
        minWidth: 200,
        renderer: renderPrOblik,
        store: pravniOblik,
        valueField: 'id',
        displayField: 'text',
        hidden: true,
        filter: {
            type: 'list',
            store: pravniOblik
        }
    }, {
        minWidth: 200,
        text: "Telefon",
        dataIndex: 'telefon',
        hidden: true,
        filter: {
            type: 'string'
        }
    }, {
        minWidth: 200,
        text: "Fax",
        dataIndex: 'fax',
        hidden: true,
        filter: {
            type: 'string'
        }
    }, {
        minWidth: 200,
        text: "Web stranica",
        dataIndex: 'web',
        hidden: true,
        filter: {
            type: 'string'
        }
    }, {
        flex: 2,
        minWidth: 200,
        text: "Broj stanovnika u općini/gradu sjedišta subjekta",
        dataIndex: 'broj_stanovnika',
        filter: {
            type: 'numeric'
        },
        hidden: true
    }, {
        flex: 2,
        minWidth: 200,
        text: "Kategorija subjekta prema ED klasifikaciji",
        dataIndex: 'edkategorija',
        hidden: true,
        renderer: renderED,
        store: edkategorija,
        valueField: 'id',
        displayField: 'text',
        filter: {
            type: 'list',
            store: edkategorija
        }
    }, {
        flex: 2,
        text: "Vrsta paketa",
        minWidth: 200,
        dataIndex: 'vrstapaketa',
        hidden: true,
        renderer: renderPaket,
        store: vrstapaketaStore,
        filter: {
            type: 'list',
            store: vrstapaketaStore
        },
        valueField: 'id',
        displayField: 'text',
    }, {
        flex: 2,
        text: "Napomena",
        minWidth: 300,
        dataIndex: 'napomena',
        hidden: true,
        filter: {
            type: 'string'
        }   
    }]
})
