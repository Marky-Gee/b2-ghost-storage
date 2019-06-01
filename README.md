#  Backblaze(B2) - Ghost Storage 

This library works with current version of Ghost 2.x.x

B2 Ghost Storage allows ghost to save images to Backblaze B2, with options of creating subfolders in their B2 buckets and if the files are saved using /Year/Month/Filename.png or just filename.png


# Installation

Via NPM
```
npm i b2-ghost-storage
mkdir  -p  ./content/adapters/storage
cp  -r  ./node_modules/ghost-storage-adapter-b2  ./content/adapters/storage/b2-ghost-storage
```

Via GIT
```
mkdir  -p  ./content/adapters/storage/b2-ghost-storage
cd  content/adapters/storage/b2-ghost-storage
git  clone  git@github.com:Marky-Gee/b2-ghost-storage.git  .
npm  install

```

## Configuration

Add this in `config."GHOST_ENVIRONMENT".js` file

```
"storage": {
	"active": "b2-ghost-storage",
	"b2-ghost-storage": {
		"accountId": "MASTERKEY_ID",
		"applicationKey": "MASTER_APPLICATION_KEY",
		"bucketId": "YOUR_BUCKET_ID",
		"bucketName": "YOUR_BUCKET_NAME",
		"subFolder": "OPTIONAL_SUBFOLDER",
		"useDatedFolder":TRUE_OR_FALSE
	}
}
```

If you don't have an account, you can create your account [here](https://www.backblaze.com) and then create your bucket.