class Loader {
    // The contructor
    constructor() {
        this.colorKey = null;
        this.colorComp = {};
    }

    // 加载主题文件并进行解析
    load(name='default') {
        // load json from file
        const fs = require('fs');
        let con = fs.readFileSync(`./theme/json/${name}.json`, 'utf-8');
        con = con.replace(/\/\/.*/g, '');
        con = JSON.parse(con);
        // load complete settings as merge source
        let dfCon = fs.readFileSync(`./theme/json/complete__.json`, 'utf-8');
        dfCon = dfCon.replace(/\/\/.*/g, '');
        dfCon = JSON.parse(dfCon);
        const deepExtend = require('deep-extend')
        con = deepExtend({}, dfCon, con);
        // save color key
        this.colorKey = Object.assign({}, con.colorKey);
        // calculate colors for common component
        this.colorComp.common = {
            "fore": this.calCompColor(con.colorComp.common.fore),
            "back": this.calCompColor(con.colorComp.common.back),
            "border": {
                "fore": this.calCompColor(con.colorComp.common.border.fore),
                "back": this.calCompColor(con.colorComp.common.border.back),
            }
        };
        // calculate colors for other component
        this.calColorForComp('window', con);
        this.calColorForComp('button', con);
        this.calColorForComp('input', con);
        this.calColorForComp('msg', con);
        this.calColorForComp('error', con);
        this.calColorForComp('comboBox', con);
        this.calColorForComp('table', con);
    }

    // 对json这个配置里，以compName的键的组件的颜色配置进行解析
    calColorForComp(compName, json) {
        let cfg = this.colorComp[compName] = {};
        this.parseColorObject(json['colorComp'][compName], cfg);
    }
    // json对象代表了一组配置，对其进行解析，解析结果按key-value保存到cfg对象中
    parseColorObject(json, cfg) {
        // 首先要继承默认组件的配置
        Object.assign(cfg, this.colorComp.common);
        // 遍历所有键，逐个解析
        for (let n in json) {
            if ('object'==typeof(json[n])) {
                // 该键是个对象，递归调用此函数进行解析
                cfg[n] = {};
                this.parseColorObject(json[n], cfg[n]);
            } else if ('string'==typeof(json[n])) {
                // 该键引用了颜色值
                cfg[n] = this.calCompColor(json[n]);
            } else {
                // 该键是普通数值
                cfg[n] = json[n];
            }
        }
    }
    // 如果字符串是颜色则直接返回，如果是以$开头的颜色关键字，则返回其代表的具体颜色
    calCompColor(name) {
        if (name[0]=='$')
            return this.valueOfColorKey(name.substr(1));
        return name;
    }
    // 获得指定颜色关键字代表的颜色
    valueOfColorKey(keyName) {
        let levels = keyName.split('.');
        let o = this.colorKey;
        for (let i=0; i<levels.length; ++i) {
            o = o[levels[i]];
        }
        return o;
    }
}

module.exports = Loader;