/**
 * Orange ODR
 * Labat Guillaume 2013
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
  this.withFrame('main', function() {
    this.fill('#frm', {
      cpt_internet: accountNumber
    }, true);
  });
});

casper.then(function() {
  this.withFrame('main', function() {
    this.echo('### ' + new Date().toISOString(), 'INFO');

    // Ugly code
    this.evaluate(function() {
      var elements = __utils__.findAll('div[id^=zone_] div p');
      if( !elements || elements.length === 0 ) {
        __utils__.echo('No offer');
        return;
      }

      Array.prototype.forEach.call(elements, function(element) {
        __utils__.echo(element.innerText);
      })
    });
  });
});

casper.run(function() {
  this.exit();
});
