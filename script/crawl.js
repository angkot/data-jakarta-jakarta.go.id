var casper = require('casper').create(),
    fs = require('fs');

var idx = casper.cli.args[0];
if (!idx) idx = 0;
var url = 'http://www.jakarta.go.id/web/index.php/bus/index/0/--/1/'+idx+'/';
casper.echo('URL: ' + url);

var routes = [],
    target = 'routes.json';

casper.start(url, function() {
});

function getRoutes() {
  var ths = document.querySelectorAll('th');
  var s = undefined;
  for (var i=0; i<ths.length; i++) {
    var th = ths[i];
    if (th.innerText === 'Jenis Angkutan') {
      s = th;
      break;
    }
  }
  if (!s) return null;

  var p = s.parentNode;
  var row = p.nextSibling;
  var res = [];

  while (row) {
    var e = [];
    for (var i=0; i<row.childElementCount; i++) {
      e.push(row.childNodes[i].innerText);
    }
    res.push(e);
    row = row.nextSibling;
  }

  return res;
};

casper.then(function() {
  routes = this.evaluate(getRoutes);
});

casper.then(function() {
  var last = idx + routes.length - 1;
  target = 'routes-' + idx + '-' + last + '.json';
  fs.write(target, JSON.stringify(routes), 'w');
});

casper.run(function() {
  this.echo(routes.length + ' routes found: ' + target);
  for (var i=0; i<routes.length; i++) {
    this.echo('- ' + routes[i][0] + ' ' + routes[i][1] + ' ' + routes[i][2]);
  }
  this.exit(routes.length);
});

