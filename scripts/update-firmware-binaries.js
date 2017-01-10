// @flow

const fs = require('fs');
const github = require('github');
const mkdirp = require('mkdirp');
const request = require('request');
const rmfr = require('rmfr');
const settings = require('../src/settings');

const GITHUB_USER = 'spark';
const GITHUB_REPOSITORY = 'firmware';
const SETTINGS_FILE = settings.BINARIES_DIRECTORY + '/settings.json';

// This default is here so that the regex will work when updating these files.
const DEFAULT_SETTINGS = {
  knownApps: {
		'deep_update_2014_06': true,
		'cc3000': true,
		'cc3000_1_14': true,
		'tinker': true,
		'voodoo': true
	},
	knownPlatforms: {
		'0': 'Core',
		'6': 'Photon',
		'8': 'P1',
		'10': 'Electron',
		'88': 'Duo',
		'103': 'Bluz'
	},
	updates: {
		'2b04:d006': {
			systemFirmwareOne: 'system-part1-0.6.0-photon.bin',
			systemFirmwareTwo: 'system-part2-0.6.0-photon.bin'
		},
		'2b04:d008': {
			systemFirmwareOne: 'system-part1-0.6.0-p1.bin',
			systemFirmwareTwo: 'system-part2-0.6.0-p1.bin'
		},
		'2b04:d00a': {
			// The bin files MUST be in this order to be flashed to the correct memory locations
			systemFirmwareOne:   'system-part2-0.6.0-electron.bin',
			systemFirmwareTwo:   'system-part3-0.6.0-electron.bin',
			systemFirmwareThree: 'system-part1-0.6.0-electron.bin'
		}
	},
};

const exitWithMessage = message => {
	console.log(message);
	process.exit(0);
};

const cleanBinariesDirectory = () => {
	return rmfr(settings.BINARIES_DIRECTORY);
};

const exitWithJSON = json => {
	exitWithMessage(JSON.stringify(json, null, 2));
}

const downloadFile = url => {
	return new Promise((resolve, reject) => {
		const filename = url.match(/.*\/(.*)/)[1];
		console.log('Downloading ' + filename + '...');
		const file = fs.createWriteStream(
      settings.BINARIES_DIRECTORY +
      '/' +
      filename
    );
    file.on('finish', () => file.close(() => resolve(filename)));
		request(url).pipe(file).on('error', exitWithJSON);
	});
};

const downloadFirmwareBinaries = assets => {
	return Promise.all(assets.map(asset => {
		if (asset.name.match(/^system-part/)) {
			return downloadFile(asset.browser_download_url);
		}
	}).filter(item => item));
};

const updateSettings = () => {
	let versionNumber = versionTag;
	if (versionNumber[0] === 'v') {
		versionNumber = versionNumber.substr(1);
	}

  if (!fs.exists(SETTINGS_FILE)) {
    fs.writeFileSync(
      SETTINGS_FILE,
      JSON.stringify(DEFAULT_SETTINGS, null, 2),
      { flag: 'wx' }
    );
  }

	let settings = fs.readFileSync(SETTINGS_FILE, 'utf8');
  const settingsBinaries = [];
	settings = settings.replace(
    /(system-part\d-).*(-.*.bin)/g,
    (filename, part, device) => {
  		var newFilename = part + versionNumber + device;
  		settingsBinaries.push(newFilename);
  		return newFilename;
  	}
  );


	fs.writeFileSync(SETTINGS_FILE, settings, 'utf8');
	console.log('Updated settings.js');

  return settingsBinaries;
};

const verifyBinariesMatch = data => {
	const downloadedBinaries = data.downloadedBinaries.sort();
	const settingsBinaries = data.settingsBinaries.sort();
	if (JSON.stringify(downloadedBinaries) !== JSON.stringify(settingsBinaries)) {
		console.log(
      '\n\nWARNING: the list of downloaded binaries doesn\'t match the list ' +
        'of binaries in settings.js'
    );
		console.log('Downloaded:  ' + downloadedBinaries);
		console.log('settings.js: ' + settingsBinaries);
	}
}

// Start running process. If you pass `0.6.0` it will install that version of
// the firmware.
let versionTag = process.argv[2];
if (versionTag && versionTag[0] !== 'v') {
	versionTag = 'v' + versionTag;
}

const githubAPI = new github();

const promise = process.argv.length !== 3
  ? githubAPI.repos.getLatestRelease({
    owner: GITHUB_USER,
    repo: GITHUB_REPOSITORY
  })
  : githubAPI.repos.getReleaseByTag({
    owner: GITHUB_USER,
    repo: GITHUB_REPOSITORY,
    tag: versionTag,
  });

promise.then(release => {
  versionTag = release.tag_name;
  return cleanBinariesDirectory()
    .then(() => {
      if (!fs.existsSync(settings.BINARIES_DIRECTORY)) {
        mkdirp.sync(settings.BINARIES_DIRECTORY);
      }
      return downloadFirmwareBinaries(release.assets);
    });
})
.then(downloadedBinaries => ({
  downloadedBinaries,
  settingsBinaries: updateSettings(),
}))
.then(fileData => verifyBinariesMatch(fileData))
