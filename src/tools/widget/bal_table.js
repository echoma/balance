const blessed = require('blessed');
const stripAnsi = require('strip-ansi');
const UIComp = require('../ui_comp');

// blessed的listtable太弱，blessed-contrib的表格组件又一堆bug，只好自己写一个。
class BalTable extends UIComp {
    /**
     * constructor
     * @param {Object} parent the parent component
     * @param {Array} tableOptions table options.
     * {
     *   parent: parent component.
     *   columns: a list of column settings, each elements is a array as [column-header-text, column-max-width-in-chars, text-align]
     *   cellPad: spaces between cells. default is 1.
     * }
     * @param {Object} boxOptions options for the outter box of this table
     * @param {Object} listOptions options for the inner list of this table
     */
    constructor(tableOptions, boxOptions, listOptions) {
        super();
        this._ = new Object();
        this._.o = new Object();
        this._.o.boxOptions = boxOptions;
        this._.o.listOptions = listOptions;
        this._.o.columnCount = tableOptions.columns.length;
        this._.o.headerTxt = [];
        this._.o.columnWidth = [];
        this._.o.columnTextAlign = [];
        for (let n in tableOptions.columns) {
            let o = tableOptions.columns[n];
            this._.o.headerTxt.push(o[0]);
            this._.o.columnWidth.push(o[1]);
            let ta = 0;
            if (o.length>=3) {
                ta = o[2];
                if (ta=='center')
                    ta = 1;
                else if (ta=='right')
                    ta = 2;
                else
                    ta = 0;
            }
            this._.o.columnTextAlign.push(ta);
        }
        this._.o.cellPad = tableOptions.cellPad || 1;
        this._.o.cellPadTxt = '';
        for (let i=0; i<this._.o.cellPad; ++i) {
            this._.o.cellPadTxt += ' ';
        }
        this.ui = this.createUI();
        this.appendTo(tableOptions.parent);
    }

    createUI() {
        // the outter box
        let boxAttr = Object.assign(new Object(), this._.o.boxOptions);
        let box = this._.box = blessed.box(boxAttr);
        // the insider list
        let listAttr = Object.assign(new Object(), this._.o.listOptions, {
            parent: box, tags: false,
            left: 0, right: 0, 
            top: 1, scrollbar: true,
            shrink: undefined, 
            border: undefined,
            items: []
        });
        let list = this._.list = blessed.list(listAttr);
        // generate table header
        box.setContent(this.calRowText(this._.o.headerTxt));
        return box;
    }

    // Get the list component
    get listComp() { return this._.list; }

    // Clear all record in the table
    clear() {
        this._.list.clearItems();
    }

    // insert one record in the specified position
    insertRecord(i, record) {
        this._.list.insertItem(i, this.calRowText(record));
    }

    // append one record (at the tail)
    appendRecord(record) {
        this._.list.addItem(this.calRowText(record));
    }

    // refresh the table with this record set
    setRecordSet(recordList) {
        this.clear();
        let items = recordList.map((record)=>{
            return this.calRowText(record); 
        });
        this._.list.setItems(items);
    }

    // Calculate one record in to list text.
    calRowText(record) {
        let cn = this._.o.columnCount;
        let cp = this._.o.cellPad;
        let cellTexts = [];
        // Calculate final text of each cell
        for (let n=0; n<cn; ++n) {
            // For n'th cell
            let ft = ''; // the finanl text
            let w = this._.o.columnWidth[n]; // cell width
            let t = stripAnsi(record[n].toString()); // cell original text
            if (t.length>w) {
                // Text too long, truncate.
                ft = t.substr(0, w);
            } else if (t.length==w) {
                // Text just fit
                ft = t;
            } else if (t.length<w) {
                // Text too short, pad with space.
                // Calculate the left and right pad count.
                let ta = this._.o.columnTextAlign[n];
                let lp = 0, rp = 0;
                if (0==ta) {
                    rp = w-t.length;
                } else if (2==ta) {
                    lp = w-t.length;
                } else { // if (1==ta) 
                    lp = parseInt((w-t.length)/2);
                    rp = w - lp - t.length;
                }
                // Pad with space.
                for (let i=0; i<lp; ++i) {
                    ft += ' ';
                }
                ft += t;
                for (let i=0; i<rp; ++i) {
                    ft += ' ';
                }
            }
            cellTexts.push(ft);
        }
        return cellTexts.join(this._.o.cellPadTxt)
    }
}

module.exports = BalTable;