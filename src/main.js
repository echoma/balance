let argv = require('minimist')(process.argv.slice(2));

if (argv.h) {
    let help = `Help:
    -h: print help infomation.
    -l: load this layout data file. Default layout will be used if not speicified.
    -d: debug log file path name.

Shortcuts:
    Ctrl+g: bring the 'Global Management Dialog' to front.
    `;
    console.log(help);
    process.exit(0);
}

require('./global_func');

// initialize UI
const blessed = require('blessed');
let screen = blessed.screen({
    tput: true,
    smartCSR: true,
    autoPadding: true,
});
const LayoutMng = require('./layout/layout_mng');
let layoutMng = new LayoutMng(screen, screen);

let layoutDataFile = argv.l? argv.l : '';
layoutMng.init(layoutDataFile);

// bind Ctrl-C for quit action
screen.key(['C-c'], function(ch, key) {
    screen.destroy();
    return process.exit(0);
});
