//global log functions
function getLogCaller()
{
  var e = new Error();
	var lines=e.stack.split('\n');
	return lines[3];
}
global.bilog=function() {
  var args = Array.prototype.slice.call(arguments);
  args.push(getLogCaller()+'\n');
  require('fs').appendFileSync('./test.log', args.join(' '));
}

// initialize UI
const blessed = require('blessed');
let screen = blessed.screen({
  tput: true,
  smartCSR: true,
  autoPadding: true,
});
let box = blessed.box({parent:screen, widht:'100%', height:'100%'});
const LayoutMng = require('./layout/layout_mng');
let layoutMng = new LayoutMng(screen, box);

layoutMng.init();

// bind Ctrl-C for quit action
screen.key(['C-c'], function(ch, key) {
    screen.destroy();
    return process.exit(0);
  });
