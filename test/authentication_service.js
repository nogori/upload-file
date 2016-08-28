/**
 * Created by efi on 27/08/16.
 */

var chai = require('chai');
var AuthenticationService = require('../lib/authentication_service').AuthenticationService;





describe("AuthenticationService tests", function () {


    it("#isTokenValid check error returned in case of empty token", function (done) {

        var authObj = new AuthenticationService("address.com", null);
        authObj.isTokenValid(null, function (error, result) {
            chai.expect(error).to.be.an('error');
            done();
        });
    });

    it("#isTokenValid request returns error, verify we intercept it", function (done) {

        var authObj = new AuthenticationService("address.com", function(options, cb) {
            cb(new Error("error"), null, null);
        });

        authObj.isTokenValid("token", function (error, result) {
            chai.expect(error.message).to.be.equal('error');
            done();
        });
    });

    it("#isTokenValid request is valid, however server returned error, verify we intercept it", function (done) {

        var authObj = new AuthenticationService("address.com", function(options, cb) {
            cb(null, {statusCode: 400}, {body:'bla'});
        });

        authObj.isTokenValid("token", function (error, result) {
            chai.expect(error.message).to.be.equal('Invalid status code');
            done();
        });
    });

    it("#isTokenValid request is valid, hand server indicates that token is valid", function (done) {

        var authObj = new AuthenticationService("address.com", function(options, cb) {
            cb(null, {statusCode: 200}, null);
        });

        authObj.isTokenValid("token", function (error, result) {
            chai.expect(result).to.be.true;
            done();
        });
    });
});