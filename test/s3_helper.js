/**
 * Created by efi on 27/08/16.
 */

var chai = require('chai');
var S3Helper = require('../lib/s3_helper').S3Helper;


/**
 * Represents a simple mock object. Setup the data and error that will be passed to any callback.
 */
var s3Mock = {
    data: Object,
    error: Error,
    listObjects: function (conf, cb) {
        cb(this.error, this.data);
    },
    createBucket: function(conf, cb) {
        cb(this.error, this.data);
    },
    getSignedUrl: function(action, conf,cb) {
        cb(this.error, this.data);
    }
};

describe("s3Helper tests", function () {

    beforeEach(function () {
        s3Mock.error = null;
        s3Mock.data = null;
    });

    it("#isBucketExists check error returned in case of empty bucket", function (done) {

        var s3Obj = new S3Helper(s3Mock);
        s3Obj.isBucketExist(null, function (error, data) {
            chai.expect(error).to.be.an('error');
            done();
        });
    });

    it("#isBucketExists aws returns error, verify we intercept it", function (done) {

        var s3Obj = new S3Helper(s3Mock);
        s3Mock.error = new Error("error");
        s3Obj.isBucketExist("bucket", function (error, data) {
            chai.expect(error.message).to.be.equal('error');
            done();
        });
    });

    it("#isBucketExists Bucket is not found in list returned from server", function (done) {

        var s3Obj = new S3Helper(s3Mock);

        s3Mock.error = null;
        s3Mock.data = {
            Buckets: [
                {
                    Name: "NoName"
                }
            ]
        };

        s3Obj.isBucketExist("bucket", function (error, data) {
            chai.expect(data).to.be.false;
            done();
        });
    });


    it("#isBucketExists Bucket is found in list returned from server", function (done) {

        var s3Obj = new S3Helper(s3Mock);

        s3Mock.error = null;
        s3Mock.data = {
            Buckets: [
                {
                    Name: "bucket"
                }
            ]
        };

        s3Obj.isBucketExist("bucket", function (error, data) {
            chai.expect(data).to.be.true;
            done();
        });
    });


    it("#createBucket check error returned in case of empty bucket", function (done) {

        var s3Obj = new S3Helper(s3Mock);
        s3Obj.createBucket(null, function (error, data) {
            chai.expect(error).to.be.an('error');
            done();
        });
    });

    it("#createBucket aws returns error, verify we intercept it", function (done) {

        var s3Obj = new S3Helper(s3Mock);
        s3Mock.error = new Error("error");
        s3Obj.createBucket("bucket", function (error) {
            chai.expect(error.message).to.be.equal('error');
            done();
        });
    });

    it("#createPutObjectSignedUrl aws returns error, verify we intercept it", function (done) {

        var s3Obj = new S3Helper(s3Mock);
        s3Mock.error = new Error("error");
        s3Obj.createPutObjectSignedUrl("bucket", 100,function (error) {
            chai.expect(error.message).to.be.equal('error');
            done();
        });
    });

    it("#createPutObjectSignedUrl check error returned in case of empty bucket", function (done) {

        var s3Obj = new S3Helper(s3Mock);
        s3Obj.createPutObjectSignedUrl(null, 100,function (error, data) {
            chai.expect(error).to.be.an('error');
            done();
        });
    });

    it("#createPutObjectSignedUrl check error returned in case of invalid expire", function (done) {

        var s3Obj = new S3Helper(s3Mock);
        s3Obj.createPutObjectSignedUrl('bucket', -1,function (error, data) {
            chai.expect(error).to.be.an('error');
            done();
        });
    });

    it("#createPutObjectSignedUrl check that a valid url is returned in case all is valid", function (done) {

        s3Mock.data = "my-url";
        var s3Obj = new S3Helper(s3Mock);
        s3Obj.createPutObjectSignedUrl('bucket', 100,function (error, data) {
            chai.expect(data).to.equal("my-url");
            done();
        });
    });


});
