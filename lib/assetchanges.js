"use strict";

var AssetChangesChannels = require("./assetchanges-channels");
var AssetChangesChangeset = require("./assetchanges-changeset");
var AssetChangesConfirm = require("./assetchanges-confirm");
var GettyApiRequest = require("./baseclasses/gettyApiRequest.js");

class AssetChanges extends GettyApiRequest {
    constructor(credentials, hostName) {
        super(credentials,hostName);
        
        if (!credentials.username) {
            throw new SdkException("must specify a username");
        }

        if (!credentials.password) {
            throw new SdkException("must specify a password");
        }

    }

    channels() {
        return new AssetChangesChannels(this.credentials, this.hostName);
    }

    changeset() {
        return new AssetChangesChangeset(this.credentials, this.hostName);
    }

    confirm() {
        return new AssetChangesConfirm(this.credentials, this.hostName);
    }

}

module.exports = AssetChanges;