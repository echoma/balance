const ToolDlg = require('../tool_dlg');
const LayoutMng = require('../../layout/layout_mng');

// The order action dialog
class OrderActDlg extends ToolDlg {

    // Get the default title
    static get defaultTitle() { return 'Order Input/Amend'; }

    constructor(id, prop={}, layout={}) {
        super(id, prop, layout);
    }

    // Create the UI instance
    createUI(layout) {
        const blessed = require('blessed');
        // main dialog
        let attr = Object.assign(layout, {
            width: 34, height: 20,
        });
        let dlg = this.createWindow(this.title, attr);
        // layout variables
        this._ = new Object();
        this._.row_top = 1;
        this._.row_step = 2;
        this._.txt_col_r = 24;
        this._.input_col_l = 10;
        this._.r = new Object();//store rows elements
        // input element
        this.createTextInputRow(dlg, 'Acc.');
        this.createTextInputRow(dlg, 'Symbol');
        this.createTextInputRow(dlg, 'Px.');
        this.createTextInputRow(dlg, 'Qty.');
        this._.rset_left = 0;
        this.createRadioSetRow(dlg, 'Type', ['Limit', 'Market'])
        this._.rset_left = 14;
        this.createRadioSetRow(dlg, 'L/S', ['Long', 'Short'], 'longshort')
        this._.row_top += 7;
        // submit button
        this._.btn_bid = this.createBtn('Bid', {
            parent: dlg, align:'center',
            top:this._.row_top, right: parseInt(attr.width/2)+2
        });
        this._.btn_bid.on('press', ()=>{ dlg.submit(); });
        this._.btn_ask = this.createBtn('Ask', {
            parent: dlg, align:'center',
            top:this._.row_top, left: parseInt(attr.width/2)+2
        });
        this._.btn_ask.on('press', ()=>{ dlg.submit(); });
        // on submit
        dlg.on('submit', (data)=>{
            bilog(JSON.stringify(data));
        });
        return dlg;
    }

    // create a row of text+input
    createTextInputRow(dlg, txt, name=null) {
        if (null==name)
            name = txt.toLowerCase();
        this._.r[name] = new Object();
        this._.r[name].txt = this.createStaticText(txt, {
            parent: dlg,
            top:this._.row_top, right: this._.txt_col_r
        });
        this._.r[name].input = this.createInput('', {
            parent: dlg, name: name,
            left: this._.input_col_l, right:2, top:this._.row_top,
            height: 1,
        });
        this._.row_top += this._.row_step;
    }

    // create a row of radio set
    createRadioSetRow(dlg, txt, options, name=null) {
        if (null==name)
            name = txt.toLowerCase();
        this._.r[name] = new Object();
        let left = this._.rset_left;
        let rset = 
        this._.r[name].set = this.createRadioSet(txt, {
            parent: dlg,
            top:this._.row_top, left:left+2,
            width: 14, height: 'shrink'
        });
        for (let idx in options) {
            let opt = options[idx];
            this.createRadio(opt, {
                parent: rset, checked: 0==idx,
                name: name+'_'+idx,
                top:1+idx*this._.row_step
            })
        }
    }
}

ToolDlg.registerDialogClass('OrderActDlg', OrderActDlg);

module.exports = OrderActDlg;