/**
 * Created by efi on 27/08/16.
 */
var request = require('request');
var config = require('config');

function AuthenticationService(serviceAddress, request) {
    this.request = request;
    this.serviceAddress = serviceAddress
}


AuthenticationService.prototype.isTokenValid = function (token, cb) {
    if (!token) {
        cb(new TypeError('Token is invalid'), false);
    } else {

        var options = {
            uri: this.serviceAddress + '/token/v1/' + token,
            headers: {'Content-Type': 'application/json'},
            json: true
        };

        this.request(options, function (error, response, body) {
            if (error) {
                cb(error, false);
            } else if (response.statusCode >= 400) {
                cb(new Error("Invalid status code"), {statusCode: response.statusCode, body: body});
            } else {
                cb(null, true);
            }
        });
    }
};

var singletonAuthenticationService = new AuthenticationService(config.get('services.authentication.address'), request);

exports.singleton = singletonAuthenticationService;
exports.AuthenticationService = AuthenticationService;