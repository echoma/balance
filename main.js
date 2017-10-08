#!/usr/bin/env node

const argv = require('./global_init');

// initialize text UI
const blessed = require('blessed');
let screen = blessed.screen({
    tput: true,
    smartCSR: true,
    autoPadding: true,
});
    //them
const Theme = require('./theme/theme');
const theme = new Theme();
const themeName = argv.t && 'string'==typeof(argv.t)? argv.t : 'default';
theme.init(themeName);
    //layout
const LayoutMng = require('./layout/layout_mng');
const layoutMng = new LayoutMng(screen, screen);
const layoutDataFile = argv.l? argv.l : '';
layoutMng.init(layoutDataFile);

// bind Ctrl-C for quit action
screen.key(['C-c'], function(ch, key) {
    screen.destroy();
    return process.exit(0);
});
