#!/usr/bin/env node

module.exports = function (context) {
        var fs = require('fs'),
        path = require('path');
        var platformRoot = path.join(context.opts.projectRoot, 'platforms/android/app/src/main'),
        manifestFile = path.join(platformRoot, 'AndroidManifest.xml');

    if (fs.existsSync(manifestFile)) {
        fs.readFile(manifestFile, 'utf8', function (err, data) {
            if (err) {
                throw new Error('Unable to find AndroidManifest.xml: ' + err);
            }
            if (!(/<application[^>]*\bandroid:banner/).test(data)) {
                console.log('Adding banner attribute');
                data = data.replace(/<application/g, '<application android:banner="@drawable/banner"');
            }
            if (!(/<application[^>]*\bandroid:isGame/).test(data)) {
                console.log('Adding isGame attribute');
                data = data.replace(/<application/g, '<application android:isGame="false"');
            }
            fs.writeFile(manifestFile, data, 'utf8', function (err) {
                if (err) throw new Error('Unable to write into AndroidManifest.xml: ' + err);
            })
			

        });
		var bannerRootSrc = path.join(context.opts.projectRoot, 'resources/android/custom');
		var bannerFileSrc = path.join(bannerRootSrc, 'banner.png');
		
		var bannerRootDest = path.join(context.opts.projectRoot, 'platforms/android/app/src/main/res/drawable');
		var bannerFileDest = path.join(bannerRootDest, 'banner.png');
		
		copyFile(bannerFileSrc, bannerFileDest);
		
		var notificationsRootSrc = path.join(context.opts.projectRoot, 'resources/android/custom');
		var notificationsFileSrc = path.join(notificationsRootSrc, 'notification_icon.png');
		
		var notificationsRootDest = path.join(context.opts.projectRoot, 'platforms/android/app/src/main/res/drawable');
		var notificationsFileDest = path.join(notificationsRootDest, 'notification_icon.png');
		
		copyFile(notificationsFileSrc, notificationsFileDest);
	}else {
		throw new Error('Unable to find AndroidManifest.xml: ' + manifestFile);
	}


	function copyFile(src, dest) {

	  let readStream = fs.createReadStream(src);

	  readStream.once('error', (err) => {
		console.log(err);
	  });

	  readStream.once('end', () => {
		console.log('done copying');
	  });

	  readStream.pipe(fs.createWriteStream(dest));
	}
};
