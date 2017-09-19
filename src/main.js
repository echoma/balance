const argv = require('./global_init');

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
