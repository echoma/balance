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
        if ('string'!=typeof(layoutFilePath))
            throw new Error(`a string should be given as layoutFilePath, but a '${typeof(layoutFilePath)}' is given.`);
        let layoutData = this.loadDefaultLayoutData();
        this.clear();
        for (let layoutDlgData of layoutData.dlgDataList) {
            let cls = ToolDlg.findDialogClassByName(layoutDlgData.className);
            let dlg = new cls(layoutDlgData.id);
            dlg.appendTo(this.uiParent);
            this.dlgList.push(dlg);
        }
        this.screen.render();
        this.layoutFilePath = layoutFilePath;
    }

    save(layoutFilePath = '') {
        if ('string'!=typeof(layoutFilePath))
            throw new Error(`a string should be given as layoutFilePath, but a '${typeof(layoutFilePath)}' is given.`);
        if (layoutFilePath.length<=0)
            throw new Error('empty string given for layoutFilePath');
        let layoutData = this.generateLayoutData();
        let content = layoutData.serialize();
        require('fs').writeFile(layoutFilePath, content, (err)=>{
            ToolDlg.showMsg(err?'Failed!':'Success!');
            if (err) bilog(err);
        });
    }

    // Remove and destroy the specified dialog
    remove(the_dlg) {
        for (let idx in this.dlgList) {
            let dlg = this.dlgList[idx];
            if (the_dlg==dlg)
            {
                dlg.removeFrom(this.uiParent);
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
            dlg.removeFrom(this.uiParent);
            dlg.destroy();
        }
        this.dlgList = [];
        this.screen.render();
    }

    // Load default layout data and return it
    loadDefaultLayoutData() {
        // if default layout data not exists, create it.
        if (null==LayoutMng.defaultLayoutData)
        {
            LayoutMng.defaultLayoutData = new LayoutData('Default Layout');
            const ToolDlg = require('../tools/tool_dlg');
            ToolDlg.loadAllBuiltIn();
            // add a global manager dialog
            let clsName = 'GlobalMngDlg';
            let cls = ToolDlg.findDialogClassByName(clsName);
            let layoutDlgData = new LayoutDlgData(1, clsName, {}, {})
            layoutDlgData.prop.title = cls.defaultTitle;
            LayoutMng.defaultLayoutData.dlgDataList.push(layoutDlgData);
        }
        return LayoutMng.defaultLayoutData;
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