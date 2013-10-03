var casper = require('casper').create();
var fs = require('fs');

var config = fs.read('config.yml').split(/\r\n|\r|\n/g);

var email = config[0];
var password = config[1];
var userId = config[2];

casper.start('http://www.unotelly.com/quickstart2/login.php', function() {
    this.fill('form', {
        'email':      email,
        'password2':  password
    }, true);
});

casper.thenOpen('http://quickstart3.unotelly.com/user/' + userId + '/dynamo', function () {
    this.fill('form', {
        'email':      email,
        'password':   password
    }, true);
});

casper.thenOpen('http://quickstart3.unotelly.com/user/' + userId + '/dynamo', function () {
    this.fill('form', {
        '4':      '2'
    });
});

casper.then(function () {
   this.capture('big-google.png');
});

casper.run();