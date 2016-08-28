/**
 * Created by efi on 26/08/16.
 */

var AWS = require('aws-sdk');


AWS.config.region = 'us-west-2';

function S3Helper(s3) {
    this.s3 = s3;
}

/**
 * Check if bucket exist.
 * @param bucketName - Name of the bucket to search for. Cannot be empty.
 * @param cb - A callback function:
 *      first argument is error object
 *      second argument is boolean true if bucket is found, false otherwise
 */
S3Helper.prototype.isBucketExist = function (bucketName, cb) {
    if (!bucketName) {
        cb(new TypeError("Bucket name is empty"), null)
    } else {

        this.s3.listObjects({}, function (err, data) {
            if (err) {
                cb(err, null);
            } else {
                var found = false;
                for (var i = 0; i < data.Buckets.length; i++) {
                    if (data.Buckets[i].Name == bucketName) {
                        found = true;
                        break;
                    }
                }

                cb(null, found);
            }
        });
    }
};

/**
 * Create a bucket in S3
 * @param bucketName - Create a bucket with this name. Cannot be empty
 * @param cb - A callback function::
 *      first argument is error object
 */
S3Helper.prototype.createBucket = function (bucketName, cb) {
    if (!bucketName) {
        cb(new TypeError("Bucket name is empty"))
    } else {

        var params = {
            Bucket: bucketName,
            ACL: 'private'
        };
        this.s3.createBucket(params, function (err, data) {
            cb(err);
        })
    }
};

/**
 * Create a signed url fir putObject action.
 * @param bucketName - Name of the bucket to create a signed url for
 * @param expires - When the signed url will expire
 * @param cb - CB function:
 *      Err - error object
 *      url - the actual signed url
 */
S3Helper.prototype.createPutObjectSignedUrl = function (bucketName, expires, cb) {
    if (!bucketName) {
        cb(new TypeError("Bucket name is empty"));
    } else if (!isNumeric(expires) || expires <= 0) {
        cb(new TypeError("expires is NaN or negative"));
    }
    else {

        var params = {
            Bucket: bucketName,
            Key: bucketName + 'key',
            Expires: expires
        };

        this.s3.getSignedUrl('putObject', params, cb);
    }
};

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

var singletonS3Helper = new S3Helper(new AWS.S3());

exports.singleton = singletonS3Helper;
exports.S3Helper = S3Helper;