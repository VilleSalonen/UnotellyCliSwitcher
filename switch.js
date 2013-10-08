var casper = require('casper').create({
    onLoadError: function() {
        console.log('Error loading Unotelly web page.');
        casper.exit();
    }
});

var fs = require('fs');

var config = fs.read('switch.cfg').trim().split(/\r\n|\r|\n/g);

if (config.length !== 3) {
    console.log("Invalid configuration format!");
    casper.exit();
}

var email = config[0];
var password = config[1];
var userId = config[2];

var countries = {
    'usa': 1,
    'can': 2,
    'gbr': 3,
    'irl': 5,
    'bra': 6,
    'mex': 8,
    'swe': 9,
    'nor': 18,
    'dnk': 19,
    'fin': 20,
    'nld': 27,
};

var keys = [];
for (var k in countries) keys.push(k.toUpperCase());

if (casper.cli.args.length !== 1) {
    console.log('Unotelly CLI Switcher');
    console.log('Usage: casperjs switch.js [country name]');
    console.log('Example: casperjs switch.js CAN');
    console.log('Valid country names: ' + keys.join(', '));
    casper.exit();
}

var countryName = casper.cli.args[0].toLowerCase();
var countryCode = countries[countryName];

if (typeof countryCode === 'undefined') {
    console.log('Invalid country name ' + countryName + '!');
    casper.exit();
}

casper.start('http://quickstart3.unotelly.com/login', function() {
    this.fill('form', {
        'email':      email,
        'password':   password
    }, true);
    this.wait(500);
});

casper.thenOpen('http://quickstart3.unotelly.com/user/' + userId + '/dynamo', function () {
    this.fill('form', {
        '4': countryCode + ''
    });
    this.waitForText('Netflix has been updated', function() {
        console.log("Switched to " + countryName.toUpperCase() + ".");    
    });
});

casper.run();
