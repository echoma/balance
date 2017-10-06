const argv = require('minimist')(process.argv.slice(2));
global.argv_array=function(){
    return argv;
}

if (argv.h) {
    let help = `
Balance is a security trading frontend.

Options:
    -h: print help infomation.
    -l: load this layout data file. Default layout will be used if not speicified.
    -d: debug log file path name.
    -s: backend RPC server host, default is localhost:9527.

Shortcuts:
    Ctrl+g: bring the 'Global Management Dialog' to front.
    Ctrl+f: bring the dialog with the specified id to the front.
    `;
    console.log(help);
    process.exit(0);
}

/**
 * our own log function: 
 *      bilog: level info
 *      bwlog: level warning
 */
const winston = require('winston');

// register our own log function
global.bilog=function(){
    var args = Array.prototype.slice.call(arguments);
    //args.unshift('[INFO] ')
    //args.push(' #'+getLogCaller()+'\n');
    //require('fs').appendFileSync(log_path_name, args.join(''));
    args.push(' #'+getLogCaller());
    logger.info(args.join(''))
}
global.bwlog=function(){
    var args = Array.prototype.slice.call(arguments);
    //args.unshift('[WARN] ')
    //args.push(' #'+getLogCaller()+'\n');
    //require('fs').appendFileSync(log_path_name, args.join(''));
    args.push(' #'+getLogCaller());
    logger.warn(args.join(''))
}
// get the caller infomation. it's used in bilog.
function getLogCaller()
{
    var e = new Error();
    var lines=e.stack.split('\n');
    return lines[3].trim();
}

const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.File)({
            filename: argv.d? argv.d : '/dev/null',
            //maxsize: 10*1024,
            //maxFiles: 2,
            handleExceptions: true,
            humanReadableUnhandledException: true,
            json: false,
            formatter: function(options){
                let date = new Date();
                let txt = `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}][${options.level}]: ${options.message ? options.message : ''}`;
                if (options.meta && options.meta.stack && Array.isArray(options.meta.stack)) {
                    options.meta.stack.forEach((s)=>{
                        txt += '\n  '+s;
                    });
                }
                return txt;
            }
        })
    ]
});
logger.exitOnError = true;
setTimeout(()=>{
    logger.exitOnError = false;
}, 3000);
bilog(`
**************************
*       BLANCE 0.1       *
**************************
`);

/**
 * parameter type checker.
 * @param {String} param the parameter reference.
 * @param {type} type what type the parameter should be.
 *                    it support standard javascript data types and extended types.
 *                    'int': integer,
 *                    '+int': positive interger,
 *                    'array': an array,
 *                    '+array': an non-empty array,
 *                    'jsonobj': JSON object, exclude class instance.
 *                    '+jsonobj': non-empty JSON object, it has at least one property.
 *                    'classobj': class instance(non-NULL, non-JSON, non-Array object)
 * @param {String} name If given, when error occurred, the error text will include this name.
 */
global.checkParam=(param, type, name='')=>{
    let res = false;
    if ('int'==type) {
        res = Number.isInteger(param);
    } else if ('+int'==type) {
        res = Number.isInteger(param) && param>0;
    } else if ('array'==type) {
        res = Array.isArray(param);
    } else if ('array'==type) {
        res = Array.isArray(param) && param.length>0;
    } else if ('jsonobj'==type) {
        res = null!=param && 'object'==typeof(param) && 'Object'==param.constructor.name
            && !Array.isArray(param);
    } else if ('+jsonobj'==type) {
        res = null!=param && 'object'==typeof(param) && 'Object'==param.constructor.name
            && !Array.isArray(param) && !isEmpty(param);
    } else if ('classobj'==type) {
        res = null!=param && 'object'==typeof(param) && 'Object'!=param.constructor.name
            && !Array.isArray(param);
    } else {
        res = type == typeof(param);
    }
    if (!res) {
        let real_type = typeof(param);
        if (null==param) {
            real_type = 'null';
        } else if(Array.isArray(param)) {
            real_type = 'array';
        } else if('number'==typeof(param)) {
            if (Number.isInteger(param)) {
                if (param<=0) {
                    real_type = 'none-positive';
                }
            } else {
                real_type = 'non-integer';
            }
        } else if('object'==typeof(param)) {
            if('Object'==param.constructor.name) {
                if(isEmpty(param)) {
                    real_type = 'empty-json';
                }
            } else {
                real_type = `Class(${param.constructor.name})`;
            }
        }
        throw new Error(`a ${real_type} value is given`
            + (name.length>0?` as '${name}'`:'')
            + `, should be a '${type}'.`
        );
    }
}
global.isEmpty=function(param)
{
    if (null==param)
        return true;
    if ('undefined'==typeof(param))
        return true;
    if (Number.isInteger(param) && (0==param || Number.isNaN(param)))
        return true;
    if (Array.isArray(param) && 0==param.length)
        return true;
    if ('string'==typeof(param) && 0==param.length)
        return true;
    if ('object'==typeof(param)) {
        for (let n in param) {
            if (param.hasOwnProperty(n))
                return false;
        }
        return true;
    }
    return false;
}

//checkParam(0, '+int', 'Qty');
//checkParam({}, 'array', 'List');
//checkParam(null, 'array', 'List');
//checkParam({}, 'jsonobj', 'List');
//checkParam({}, '+jsonobj', 'List');
//checkParam(new Map(), '+jsonobj', 'List');
//checkParam(new Map(), 'classobj', 'List');


/**
 * covertion between json object and map
 */
global.json2map=function(jsonobj) {
    let m = new Map();
    for(let n in jsonobj) {
        m.set(n, jsonobj[n]);
    }
    return m;
}
global.map2json=function(mapobj) {
    let j = new Object();
    for(let [k, v] of mapobj) {
        j[k] = v;
    }
    return j;
}


/**
 * make abbreviation(缩写) for a string
 * @param integer max max length of the final abbr
 * @param ArrayOrInteger wordMax max length of each word in the string
 */
String.prototype.abbr=function(max=100, partMax=4) {
    // 计算每一个单词的最大长度
    let maxArr = [];
    partMax = Number.isInteger(partMax)? partMax : 4;
    for (let i=0; i<100; ++i) {
        maxArr.push(partMax);
    }
    for (let i=0; i<max.length; ++i) {
        maxArr[i] = partMax[i];
    }
    // 开始按词分块
    let parts = this.split(/[\s\.\-\_]/);
    if (parts.length==1) {
        // 如果只有一个单词，则直接返回这个单词的裁剪部分。
        return parts[0].substr(0,max);
    }
    let ret = '';
    for (let i=0; i<parts.length; ++i) {
        if (parts[i].length==0)
            return;
        ret += (ret.length>0?'.':'') + parts[i].substr(0, maxArr[i]);
    }
    return ret.substr(0,max);
}

module.exports = argv;