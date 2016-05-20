"use strict";

var WebHelper = require("./webhelper.js");
var GettyApiRequest = require("./baseclasses/gettyApiRequest.js");

class AssetChangesChannels extends GettyApiRequest {

    execute (next) {

        var path = "/v3/asset-changes/channels";

        var webHelper = new WebHelper(this.credentials, this.hostName);
        webHelper.withAuthentication().atPath(path).get(function (err, response) {
            if (err) {
                next(err, null);
            } else {
                next(null, response);
            }
        });
    }

}

module.exports = AssetChangesChannels;