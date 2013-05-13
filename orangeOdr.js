/**
 * Orange ODR
 *
 */

var accountNumber, casper = require("casper").create({
  verbose: false,
  logLevel: 'debug'
});

if( casper.cli.args.length === 0 /*&& Object.keys(casper.cli.options).length === 0*/ ) {
  casper.echo("Please provide an internet account number").exit();
}

accountNumber = casper.cli.get(0);

casper.start('http://www.suiviodr.orange.fr', function() {
  this.evaluate(function(accountNumber) {
    var doc = frames[name='main'].document;
    var form = doc.querySelector('#frm');
    var inputInternet = doc.querySelector('#cpt_internet').value = accountNumber;
    form.submit();
  }, accountNumber);
});

casper.then(function() {
  var zoneInfo = this.evaluate(function() {
    var doc = frames[name='main'].document;
    var zoneElts = doc.querySelectorAll("div[id^=zone_0]");
    __utils__.echo('### ' + new Date().toISOString());
    return Array.prototype.forEach.call(zoneElts, function(zone) {
      var infoElts = doc.querySelectorAll("div[id^=zone_0] div p.petit_texte_noir_gras");
      Array.prototype.forEach.call(infoElts, function(i) {
        __utils__.echo(i.innerText);
      });
    });
  });
});

casper.run();
