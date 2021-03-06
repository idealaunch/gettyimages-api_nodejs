"use strict";
var SdkException = require("./sdkexception");
var DownloadsVideos = require("./downloads-videos");
var DownloadsImages = require("./downloads-images");
var GettyApiRequest = require("./baseclasses/gettyApiRequest.js");

class Downloads extends GettyApiRequest {    
    constructor(credentials, hostName) {
        super(credentials,hostName);
        
        if (!credentials.username) {
            throw new SdkException("must specify a username");
        }

        if (!credentials.password) {
            throw new SdkException("must specify a password");
        }

    }
    
    videos() {
        return new DownloadsVideos(this.credentials, this.hostName);  
    }
        
    images(){
        return new DownloadsImages(this.credentials, this.hostName);
    }   
}

module.exports = Downloads;