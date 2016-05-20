"use strict";

var SdkException = require("./sdkexception.js");
var WebHelper = require("./webhelper.js");
var GettyApiRequest = require("./baseclasses/gettyApiRequest.js");

class Usage extends GettyApiRequest {
    constructor(credentials, hostName) {
        super(credentials, hostName);
        this.batchId = null;
        this.batchAssets = [];
    }

    withBatchId (value) {
        this.batchId = value;
        return this;
    }

    addUsage (assetId, quantity, usageDate) {
        this.batchAssets[this.batchAssets.length] = { asset_id: assetId, quantity: quantity, usage_date: usageDate };
        return this;
    }

    execute (next) {

        if (!this.batchId) {
            throw new SdkException("must specify a batch id");
        }

        if (!this.batchAssets.length) {
            throw new SdkException("must have a payload of assets to report in the batch");
        }

        var path = "/v3/usage-batches/";
        path += this.batchId;

        var usages = JSON.stringify({ asset_usages: this.batchAssets });

        var webHelper = new WebHelper(this.credentials, this.hostName);
        webHelper.withAuthentication().atPath(path).put(usages, function (err, response) {
            if (err) {
                next(err, null);
            } else {
                next(null, response);
            }
        });
    }
}

module.exports = Usage;