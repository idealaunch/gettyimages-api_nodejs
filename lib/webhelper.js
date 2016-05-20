"use strict";

var https = require("https");
var os = require("os");
var pjson = require("../package.json");
var SdkException = require("./sdkexception.js");
var GettyApiRequest = require("./baseclasses/gettyApiRequest.js");

class WebHelper extends GettyApiRequest {

    constructor(credentials, hostName) {
        super(credentials, hostName);
        this.mustAuthenticate = false;
        this.path = null;
    }

    withAuthentication (value) {
                
        if(!this.credentials.apiKey || !this.credentials.apiSecret) {
            throw new SdkException("credentials must have a key and a secret to authenticate");
        }

        this.mustAuthenticate = (typeof value === "undefined" ? true : value);
        return this;
    }

    atPath (value) {
        this.path = value;
        return this;
    }

    get (next) {

        var options = {
            hostname: this.hostName,
            method: "GET",
            path: this.path,
            port: 443,
            headers: {
                "Accept": "application/json"
            }
        };

        authenticateRequest.call(this, options, function(err, options) {
            if (err) {
                return next(err);
            }
            var request = beginRequest(options, next);
            request.end();
        });

    }

    post (postData, next) {

        var options = {
            hostname: this.hostName,
            method: "POST",
            path: this.path,
            port: 443,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
                "Content-Length": (postData ? postData.length : 0)
            }
        };

        authenticateRequest.call(this, options, function(err, options) {
            if (err) {
                return next(err);
            }
            var request = beginRequest(options, next);
            if (postData) {
                request.write(postData);
            }
            request.end();
        });

    }

    put (putData, next) {

        var options = {
            hostname: this.hostName,
            method: "PUT",
            path: this.path,
            port: 443,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Content-Length": (putData ? putData.length : 0)
            }
        };

        authenticateRequest.call(this, options, function(err, options) {
            if (err) {
                return next(err);
            }
            var request = beginRequest(options, next);
            if (putData) {
                request.write(putData);
            }
            request.end();
        });

    }

    delete (next) {

        var options = {
            hostname: this.hostName,
            method: "DELETE",
            path: this.path,
            port: 443,
            headers: {
                "Accept": "application/json"
            }
        };

        authenticateRequest.call(this, options, function(err, options) {
            if (err) {
                return next(err);
            }
            var request = beginRequest(options, next);
            request.end();
        });

    }

}

module.exports = WebHelper;

function authenticateRequest (options, next) {
    var self = this;
    if (this.mustAuthenticate && !options.headers.Authorization) {
        this.credentials.getAccessToken(function (err, response) {
            if (err) {
                next(err, null);
            } else {
                if (response.access_token) {
                    options.headers["Api-Key"] = self.credentials.apiKey;
                    options.headers.Authorization = "Bearer " + response.access_token;
                }
                next(null, options);
            }
        });
    } else {
        next(null, options);
    }
}

function beginRequest (options, next) {

    addUserAgentString(options);

    return https.request(options, function (response) {

        response.setEncoding("utf8");
        var str = "";

        response.on("data", function (chunk) {
            str += chunk;
        });
        response.on("end", function () {
            if (response.statusCode === 404) {
                var err = new Error("Not Found");
                err.statusCode = response.statusCode;
                next(err, null);
                
            } else {                
                next(null, (str.length > 0) ? JSON.parse(str) : null);
            }
        });
        response.on("error", function (err) {
            next(err, null);
        });
    });
}

function addUserAgentString (options) {
    options.headers["User-Agent"] = "GettyImagesApiSdk/" + pjson.version + " (" + os.type() + " " + os.release() + "; " + "Node.js " + process.version + ")";
}
