var express = require('express');
var router = express.Router();
var authenticationService = require('../lib/authentication_service').singleton;
var AWS = require('aws-sdk');
var config = require('config');
var s3Singleton = require('../lib/s3_helper').singleton;


AWS.config.region = 'us-west-2';
// The bucket to use for file upload.
var bucketName = config.get('s3.bucket.name');


// For the first time check if the upload bucket exists, if it doesn't then create one.
var s3 = new AWS.S3(); // this is the default setting


router.get('/:token', function (req, res, next) {
    var deviceToken = req.params.token;

    authenticationService.isTokenValid(deviceToken, function (error, isValid) {
        if (error) {
            return res.status(500).json({
                message: 'Unable to create presigned request',
                timestamp: new Date().toJSON()
            });
        } else {
            if (isValid) {
                s3Singleton.createPutObjectSignedUrl(bucketName, 900, function (error, url) {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({
                            message: 'Unable to create presigned request',
                            timestamp: new Date().toJSON()
                        });
                    } else {
                        // We have a url
                        return res.status(500).json({
                            url: url,
                            timestamp: new Date().toJSON()
                        });
                    }
                })
            }
        }
    });


});


module.exports = router;