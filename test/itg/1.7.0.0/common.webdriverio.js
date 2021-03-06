'use strict';
var client;
var webdriverio = require('webdriverio');
var globals = require('./globals.webdriverio');

var options = {
    logLevel: 'silent',
    waitForTimeout: 5000,
    desiredCapabilities: {
        browserName: 'chrome'
	},
	port: 4444
};

function initCommands(client) {
    client.addCommand('signinBO', function(cb) {
		this.selector = globals.selector;
		client
			.url('http://' + URL + '/admin-dev')
			.waitForExist(this.selector.login, 5000)
            .setValue(this.selector.login, 'guillaume.marsille@prestashop.com')
            .setValue(this.selector.password, 'guillaume95')
            .click(this.selector.login_btn)
			.call(cb);
    });
	
	client.addCommand('signinFO', function(cb) {
		this.selector = globals.selector;
        client
			.url('http://' + URL)
			.waitForExist(this.selector.access_loginFO, 5000)
			.click(this.selector.access_loginFO)
			.waitForExist(this.selector.loginFO, 5000)
            .setValue(this.selector.loginFO, 'pub@prestashop.com')
            .setValue(this.selector.passwordFO, '123456789')
            .click(this.selector.login_btnFO)
            .call(cb);
    });

	client.addCommand('signoutBO', function(cb) {
		this.selector = globals.selector;
        client
			.waitForExist(this.selector.profil, 10000)
			.click(this.selector.profil)
			.click(this.selector.logout)
			.call(cb);
	});
	
	client.addCommand('signoutBO2', function(cb) {
		this.selector = globals.selector;
        client
			.waitForExist(this.selector.new_profil, 10000)
			.click(this.selector.new_profil)
			.click(this.selector.logout)
			.call(cb);
	});
	
	client.addCommand('signoutFO', function(cb) {
		this.selector = globals.selector;
        client
			.waitForExist(this.selector.logoutFO, 5000)
			.click(this.selector.logoutFO)
			.waitForExist(this.selector.access_loginFO, 5000)
			.call(cb);
	});
	
	client.addCommand('click', function(cb, done){
		client.click(cb, function(err){
			if (err){
				var date_time = new Date().getTime();
				client.saveScreenshot('./screenshots/' + date_time + '.png');
				console.log('Screenshot as taken with name : ' + date_time + '.png')
			}
		});
		client.call(done);
	});
	
	client.addCommand('setValue', function(element,value, done){
		client.setValue(element,value, function(err){
			if (err){
				var date_time = new Date().getTime();
				client.saveScreenshot('./screenshots/' + date_time + '.png', function (err, result){
					if (err) {
					}else{
						console.log('Error, screenshot as taken with name : ' + date_time + '.png');
					}
				});
			}
		});
		client.call(done);
	});
	
}
module.exports = {
    getClient: function () {
        if (client) {
            return client;
        } else {
            client = webdriverio
                .remote(options)
                .init()
				.windowHandleMaximize()			

            initCommands(client);

            return client;
        }
    },
    after: function (done) {
            done();
    },
    initMocha: function () {
        this.timeout(50000);
        this.slow(30000);
    }
};