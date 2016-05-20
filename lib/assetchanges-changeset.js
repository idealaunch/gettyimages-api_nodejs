"use strict";

var querystring = require("querystring");
var SdkException = require("./sdkexception");
var WebHelper = require("./webhelper.js");
var GettyApiRequest = require("./baseclasses/gettyApiRequest.js");

class AssetChangesChangeset extends GettyApiRequest {

    constructor(credentials, hostName) { 
        super(credentials, hostName);          
        this.channelId = null;
        this.batchSize = null;
    }

    withChannelId (value) {
        this.channelId = value;
        return this;
    }

    withBatchSize (value) {
        this.batchSize = value;
        return this;
    }

    execute (next) {

        var path = "/v3/asset-changes/change-sets";
        var params = null;

        if (!this.channelId) {
            throw new SdkException("must specify a channel id");
        } else {
            params = {};
            params.channel_id = this.channelId;
        }

        if (this.batchSize) {
            params.batch_size = this.batchSize;
        }

        if (params) {
            path += "?" + querystring.stringify(params);
        }

        var webHelper = new WebHelper(this.credentials, this.hostName);
        webHelper.withAuthentication().atPath(path).put(null, function (err, response) {
            if (err) {
                next(err, null);
            } else {
                next(null, response);
            }
        });
    }

}

module.exports = AssetChangesChangeset;