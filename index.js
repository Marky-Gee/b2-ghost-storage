'use strict';

var fs = require('fs'),
    path = require('path'),
    Promise = require('bluebird'),
    util = require('util'),
    B2 = require('backblaze-b2'),
    BaseStore = require('ghost-storage-base'),
    request = Promise.promisify(require("request")),
    readFileAsync = Promise.promisify(fs.readFile);

class Store extends BaseStore {
    constructor(config) {
        super(config);
        var self = this;
        this.config = config;
        this.client = new B2({
            accountId: this.config.accountId,
            applicationKey: this.config.applicationKey
        });
        this.useDatedFolder = this.config.useDatedFolder;
        this.subFolder = (this.config.subFolder)? this.config.subFolder+"/" : ""

        this.client.authorize().then((data) => {
            self.downloadUrl = data.data.downloadUrl + '/file/' + self.config.bucketName + '/';
        });

        this.targetFilename = "";
    }

    delete(fileName, targetDir) {
    }

    exists(filename, targetDir) {
        const filepath = path.join(targetDir || this.getTargetDir(), filename);
        return request(this.getUrl(filepath))
            .then(res => (res.statusCode === 200))
            .catch(() => false);
    }

    read(options) {
    }

    save(image, targetDir) {
        const directory = targetDir || this.getTargetDir(this.pathPrefix)
        var self = this;

        return new Promise((resolve, reject) => {
            Promise.all([
                readFileAsync(image.path),
                this.getUniqueFileName(image, directory)
            ])
            .then(([file, filename]) => {
                this.file = file;
                
                this.targetFilename = (this.useDatedFolder)? this.subFolder + filename.replace(/\\/g,"/") : this.subFolder + image.originalname.replace(/\\/g,"/");
                 self.client.authorize().then((data) => {
                    self.client.getUploadUrl(self.config.bucketId).then((obj) => {
                        self.client.uploadFile({
                            uploadUrl: obj.data.uploadUrl,
                            uploadAuthToken: obj.data.authorizationToken,
                            filename: self.targetFilename,
                            data: this.file
                        })
                        .then(() => resolve(`${self.downloadUrl}${self.targetFilename}`))
                    })
                })

            })
            .catch(error => reject(error))
        }).finally(() => {}, () => {})
    }

    serve() {
        return (req, res, next) =>
        {
            next();
        }
    }

    getUrl(filename) {
        const config = this.config;
        return `${this.host}/${filename}`;
    }

}

module.exports = Store;