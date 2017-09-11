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
            width: 42, height: 13,
        });
        let dlg = this.createFormWindow(this.title, attr);
        let form = dlg.insideForm;
        // layout variables
        this._ = new Object();
        this._.row_w = form.width-2;
        this._.row_w_half = parseInt(this._.row_w/2);
        this._.row_w_quater = parseInt(this._.row_w/4);
        this._.row_top = 1;
        this._.row_step = 2;
        this._.text_max_w = 7;
        this._.input_w = this._.row_w_half - this._.text_max_w - 2;
        this._.c = []; // position data of component in each column
        this._.c.push(new Object()); // 1st column
        this._.c[0].input_l = this._.row_w_half - 1 - this._.input_w; // input component's left position
        this._.c[0].txt_r = this._.row_w_half + 1 + this._.input_w + 1; // text component's right position
        this._.c.push(new Object()); // 2nd column
        this._.c[1].input_l = this._.row_w - 1 - this._.input_w; // input component's left position
        this._.c[1].txt_r = 1 + this._.input_w + 1; // text component's right position
        this._.nm = new Object(); // name => form-element mapping
        //process.exit(0);
        // input element
        this.createTextInputRow(dlg, form, 0, 'Acc.', 'acc');
        this.createTextSelRow(dlg, form, 1, 'Market', new Map([
            ['HK','HK'], ['US','US']
        ]), null);
        this._.row_top += this._.row_step;
        this.createTextInputRow(dlg, form, 0, 'Symbol');
        this.createTextInputRow(dlg, form, 1, 'Qty.', 'quantity');
        this._.row_top += this._.row_step;
        this.createTextInputRow(dlg, form, 0, 'Px.', 'price');
        this.createTextInputRow(dlg, form, 1, 'Stp.Px.', 'stopPrice');
        this._.row_top += this._.row_step;
        this.createTextSelRow(dlg, form, 0, 'Type', new Map([
            ['limit','Limit'], ['market','Market'],
            ['stopLimit','Stop Limit(Stp.L)'], ['stopMarket','Stop Market(Stp.M)'],
            ['trailStopLimit','Trail Stop Limit(T.S.L)'], ['trailStopMarket','Trail Stop Market(T.S.M)']
        ]));
        this.createTextSelRow(dlg, form, 1, 'TIF', new Map([
            ['day','DAY'], ['ioc','IOC'], 
            ['fok','FOK'], ['atCross','At Crossing(Cross)']
        ]));
        this._.row_top += this._.row_step;
        this.createTextSelRow(dlg, form, 0, 'L/S', new Map([
            ['long','Long'], ['short','Short']
        ]), null, 'longShort');
        // submit button
        this._.btn_open = this.createBtn('Open', {
            parent: form, name: 'open', align:'center',
            top:this._.row_top, right: 10
        });
        this._.btn_open.on('press', ()=>{ form.submit(); });
        this._.btn_close = this.createBtn('Close', {
            parent: form, name: 'close', align:'center',
            top:this._.row_top, right: 1
        });
        this._.btn_close.on('press', ()=>{ form.submit(); });
        // on submit
        form.on('submit', (data)=>{
            bilog(JSON.stringify(data));
        });
        return dlg;
    }

    // create a text+input component pair in the specified column.
    createTextInputRow(dlg, form, columnIdx, txt, name=null) {
        if (null==name)
            name = txt.toLowerCase();
        this._.nm[name] = new Object();
        this._.nm[name].txt = this.createStaticText(txt, {
            parent: form,
            top:this._.row_top,
            right: this._.c[columnIdx].txt_r,
            height: 1,
        });
        this._.nm[name].form = this.createInput('', {
            parent: form, name: name,
            top:this._.row_top,
            left: this._.c[columnIdx].input_l, 
            width: this._.input_w, 
            height: 1,
        });
    }
    // create a text+selection component pair in the specified column.
    createTextSelRow(dlg, form, columnIdx, txt, optionMap, defaultOption=null, name=null) {
        if (null==name)
            name = txt.toLowerCase();
        this._.nm[name] = new Object();
        this._.nm[name].txt = this.createStaticText(txt, {
            parent: form,
            top:this._.row_top,
            right: this._.c[columnIdx].txt_r,
            height: 1,
        });
        this._.nm[name].sel = this.createSelect(optionMap, defaultOption,
            {
                parent: form, name: name,
                left:this._.c[columnIdx].input_l, 
                top:this._.row_top,
                width: this._.input_w
            },
            {
                parent: dlg,
                left:this._.c[columnIdx].input_l,
                top:this._.row_top+1,
            }
        );
    }

    // create a row of radio set
    createRadioSetRow(container, txt, options, name=null) {
        if (null==name)
            name = txt.toLowerCase();
        this._.r[name] = new Object();
        let left = this._.rset_left;
        let rset = 
        this._.r[name].set = this.createRadioSet(txt, {
            parent: container,
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