/**
 * our own log function: 
 *      bilog: level info
 *      bwlog: level warning
 */

// register our own log function
global.bilog=function(){
    var args = Array.prototype.slice.call(arguments);
    args.unshift('[INFO] ')
    args.push(' #'+getLogCaller()+'\n');
    require('fs').appendFileSync(log_path_name, args.join(''));
}
global.bwlog=function(){
    var args = Array.prototype.slice.call(arguments);
    args.unshift('[WARN] ')
    args.push(' #'+getLogCaller()+'\n');
    require('fs').appendFileSync(log_path_name, args.join(''));
}
// get the caller infomation. it's used in bilog.
function getLogCaller()
{
    var e = new Error();
    var lines=e.stack.split('\n');
    return lines[3].trim();
}

let argv = require('minimist')(process.argv.slice(2));
let log_path_name = argv.d? argv.d : './test.log';
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
function isEmpty(param)
{
    for (let n in param) {
        if (param.hasOwnProperty(n))
            return false;
    }
    return true;
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