"use strict";

var SdkException = require("./sdkexception");
var WebHelper = require("./webhelper.js");
var GettyApiRequest = require("./baseclasses/gettyApiRequest.js");

class AssetChangesConfirm extends GettyApiRequest {

    constructor(credentials, hostName) { 
        super(credentials, hostName);          
        this.Id = null;
    }

    withId (value) {
        this.Id = value;
        return this;
    }

    execute (next) {

        var path = "/v3/asset-changes/change-sets";
        var params = null;

        if (!this.Id) {
            throw new SdkException("must specify a change set id");
        } else {
            path += "/" + this.Id;
        }

        var webHelper = new WebHelper(this.credentials, this.hostName);
        webHelper.withAuthentication().atPath(path).delete(function (err, response) {
            if (err) {
                next(err, null);
            } else {
                next(null, response);
            }
        });

    }

}

module.exports = AssetChangesConfirm;