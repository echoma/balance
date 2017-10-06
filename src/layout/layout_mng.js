const { LayoutData, LayoutDlgData } = require('./layout_data');
const ToolDlg = require('../tools/tool_dlg');
const blessed = require('blessed');

// The layout manager maintains a list of tool dialogs
class LayoutMng {

    static get singleton() { return LayoutMng._singleton; }
    static set singleton(s) { throw new Error('LayoutMng singleton can not be set'); }

    /**
     * The constructor.
     * @param {blessed.screen} screen the main screen which this layout manager should render.
     * @param {blessed.Element} uiParent the container element in which this layout manger should put its dialogs.
     */
    constructor(screen, uiParent = null) {
        if (null!=LayoutMng._singleton)
            throw new Error('LayoutMng must be used as singleton only');
        LayoutMng._singleton = this;
        this.layoutFilePath = '';
        this.layoutData = null;
        this.dlgList = [];
        this.screen = screen;
        this.uiParent = (uiParent==null) ? this.screen : uiParent;
    }

    /**
     * Load the layout data from specified file, create dialogs 
     * and layout them in the specified blessed element.
     * @param {String} layoutFilePath the layout data file path name. Empty string means using the default layout.
     */
    init(layoutFilePath = '') {
        // load dialog classes
        ToolDlg.loadAllBuiltIn();
        // load data
        checkParam(layoutFilePath, 'string', 'layoutFilePath');
        let layoutData = null;
        if (layoutFilePath.length<=0) {
            layoutData = this.loadDefaultLayoutData();
        } else {
            let expandTilde = require('expand-tilde');
            let text_buf = require('fs').readFileSync(expandTilde(layoutFilePath));
            let text = text_buf.toString();
            layoutData = LayoutData.parse(text);
            this.checkLayoutData(layoutData);
        }
        // clear all dialogs
        this.clear();
        // init
        let lastDlgId = -1;
        for (let layoutDlgData of layoutData.dlgDataList) {
            let cls = ToolDlg.findDialogClassByName(layoutDlgData.className);
            if (null==cls) {
                bilog(`class not found, className=${$layoutDlgData.className}, id=${layoutDlgData.id}`);
                continue;
            }
            let dlg = new cls(layoutDlgData.id, layoutDlgData.prop, layoutDlgData.layout);
            dlg.appendTo(this.uiParent);
            this.dlgList.push(dlg);
            lastDlgId = dlg.id;
        }
        if (lastDlgId>=0)
            this.bringToTop(lastDlgId);
        this.screen.render();
        this.layoutFilePath = layoutFilePath;
    }

    /**
     * Save current dialog layout to local file.
     * @param {String} layoutFilePath the file name path where to save the layout.
     */
    save(layoutFilePath = '') {
        checkParam(layoutFilePath, 'string', 'layoutFilePath');
        if (layoutFilePath.length<=0)
            throw new Error('empty string given for layoutFilePath');
        let expandTilde = require('expand-tilde');
        let layoutData = this.generateLayoutData();
        let content = LayoutData.serialize(layoutData);
        require('fs').writeFile(expandTilde(layoutFilePath), content, (err)=>{
            if (err) {
                bilog(err);
                ToolDlg.showError(`Failed!\n${err.message}`);
            } else {
               ToolDlg.showMsg('Success!');
            }
        });
    }

    bringToTop(number) {
        checkParam(number, 'int', 'number');
        for (let idx in this.dlgList) {
            let dlg = this.dlgList[idx];
            if (dlg.id==number) {
                dlg.ui.show();
                dlg.ui.setFront();
                dlg.ui.focus();
                this.screen.render();
                return dlg;
            }
        }
        return null;
    }

    // Remove and destroy the specified dialog
    remove(the_dlg) {
        for (let idx in this.dlgList) {
            let dlg = this.dlgList[idx];
            if (the_dlg==dlg)
            {
                dlg.destroy();
                this.dlgList.splice(idx, 1);
                this.screen.render();
                break;
            }
        }
    }

    // Clear all dialogs
    clear() {
        for (let idx in this.dlgList) {
            let dlg = this.dlgList[idx];
            dlg.destroy();
        }
        this.dlgList = [];
        this.screen.render();
    }

    // Add new dialog
    add(cls) {
        let id_set = new Set();
        for (let idx in this.dlgList) {
            id_set.add(this.dlgList[idx].id);
        }
        let new_id = 0;
        for (let i=1; i<999999; ++i) {
            if (!id_set.has(i)) {
                new_id = i;
                break;
            }
        }
        if (0==new_id) {
            throw new Error('Can not decide the id of new dialog');
        }
        let dlg = new cls(new_id);
        dlg.appendTo(this.uiParent);
        this.dlgList.push(dlg);
        this.screen.render();
        dlg.ui.focus();
        return dlg;
    }

    // Load default layout data and return it
    loadDefaultLayoutData() {
        // if default layout data not exists, create it.
        if (null==LayoutMng.defaultLayoutData)
        {
            LayoutMng.defaultLayoutData = new LayoutData('Default Layout');
            // add a global manager dialog
            let clsName = 'GlobalMngDlg';
            let cls = ToolDlg.findDialogClassByName(clsName);
            let layoutDlgData = new LayoutDlgData(1, clsName, {}, {})
            layoutDlgData.prop.title = cls.defaultTitle;
            LayoutMng.defaultLayoutData.dlgDataList.push(layoutDlgData);
        }
        return LayoutMng.defaultLayoutData;
    }

    // Check the specified layout data, make sure it has the basic dialogs.
    checkLayoutData(layoutData) {
        // check
        let hasGlobalMng = false;
        for (let idx in layoutData.dlgDataList) {
            if ('GlobalMngDlg'==layoutData.dlgDataList[idx].className) {
                hasGlobalMng = true;
                break;
            }
        }
        if (hasGlobalMng)
            return;
        bwlog('GlobalMngDlg is missing in the specified layout data, inserting new one.');
        // make sure
        let clsName = 'GlobalMngDlg';
        let cls = ToolDlg.findDialogClassByName(clsName);
        let layoutDlgData = new LayoutDlgData(1, clsName, {}, {})
        layoutDlgData.prop.title = cls.defaultTitle;
        layoutData.dlgDataList.push(layoutDlgData);
    }

    // Generate layout data for current dialogs
    generateLayoutData(layoutName) {
        let layoutData = new LayoutData(layoutName);
        this.dlgList.forEach((dlg)=>{
            let dlgDataJson = dlg.generateLayoutData();
            let dlgData = new LayoutDlgData(
                dlgDataJson.id,
                dlgDataJson.className,
                dlgDataJson.prop,
                dlgDataJson.layout
            );
            layoutData.dlgDataList.push(dlgData);
        });
        return layoutData;
    }
}

LayoutMng.defaultLayoutData = null;
LayoutMng._singleton = null;

module.exports = LayoutMng;