// The data layer of layout
class LayoutData {
    constructor(name='Unnamed Layout') {
        this.name = name;
        this.dlg_list = [];
    }
}

// The configuration of one dialog in LayoutConfig
class LayoutDlgData {
    /**
     * create new layout dialog data
     * @param {int} id The id of this dialog instance.
     * @param {string} className The class name by which LayoutMng can re-create the instance.
     * @param {jsonObject} prop The properties of this dialog (ToolDlg.prop), such as title.
     * @param {jsonObject} layout The layout data of this dialog, such as size and position.
     */
    constructor(id, className, prop, layout) {
        this.id = id;
        this.className = className;
        this.prop = prop;
        this.layout = layout;
    }
}

const defaultLayoutData = new LayoutData('Default Layout');
function initDefaultLayout()
{
    const {ToolDlg} = require('../tools/tool_dlg');
    let {name} = require('../tools/helper/global_mng_dlg');
    let cls = ToolDlg.findDialogClassByName(name)
    var gmd = new LayoutDlgData(1, name, {}, {})
    gmd.prop.title = cls.defaultTitle;
    defaultLayoutData.dlg_list.push(gmd);
}
initDefaultLayout();

module.exports = {
    LayoutData: LayoutData,
    LayoutDlgData: LayoutDlgData,
    defaultLayoutData: defaultLayoutData
};