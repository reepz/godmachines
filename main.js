const { app, dialog, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const https = require('https');
const AdmZip = require('adm-zip');
const createDesktopShortcut = require('create-desktop-shortcuts');

async function getPackageData() {
  let metaData = {
    buildNumber: '',
    commitMsg: '',
    buildDate: '',
  };

  const request = await axios.get(
    'https://build-api.cloud.unity3d.com/api/v1/orgs/859214/projects/fd8f1dd8-7e95-406d-8d66-acea7b4cb33c/buildtargets/_all/builds',
    {
      headers: {
        Authorization: 'Basic ' + '05558b7ab61bb7aedeb0c95d4157ea91',
      },
    }
  );

  metaData.commitMsg = request.data[0].changeset[0].message;
  metaData.buildDate = request.data[0].changeset[0].timestamp;
  metaData.buildNumber = request.data[0].build;
  return metaData;
}

async function deployPackage() {
  let metaData = {
    installationPath: '',
  };

  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });
  if (canceled) {
    return;
  } else {
    metaData.installationPath = `${filePaths[0]}\\God Machines`;

    const dir = `${metaData.installationPath}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    const request = await axios.get(
      'https://build-api.cloud.unity3d.com/api/v1/orgs/859214/projects/fd8f1dd8-7e95-406d-8d66-acea7b4cb33c/buildtargets/_all/builds',
      {
        headers: {
          Authorization: 'Basic ' + '05558b7ab61bb7aedeb0c95d4157ea91',
        },
      }
    );

    // console.log(request.data[0]);
    // metaData.installationPath = `${__dirname}\\bin`;

    const url = request.data[0].links.download_primary.href;

    https.get(url, (res) => {
      const path = `${metaData.installationPath}/latest.zip`;
      const filePath = fs.createWriteStream(path);
      res.pipe(filePath);
      filePath.on('finish', () => {
        filePath.close();
        console.log('Download Completed');

        if (fs.existsSync(`${metaData.installationPath}/latest.zip`)) {
          fs.rmSync(`${metaData.installationPath}/God Machines`, {
            recursive: true,
            force: true,
          });
          const zip = new AdmZip(`${metaData.installationPath}/latest.zip`);
          zip.extractAllTo(
            /*target path*/ `${metaData.installationPath}/God Machines`,
            /*overwrite*/ true
          );
          console.log('extracted to /God Machines');

          if (fs.existsSync(`${metaData.installationPath}/latest.zip`)) {
            fs.rmSync(`${metaData.installationPath}/latest.zip`, {
              recursive: true,
              force: true,
            });
          }
          const shortcutsCreated = createDesktopShortcut({
            windows: {
              filePath: `${metaData.installationPath}/God Machines/win64.exe`,
              name: `God Machines`,
            },
          });
          console.log('shortcut created');
        }
      });
    });
    return metaData;
  }
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    // frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile('index.html');
  win.webContents.openDevTools();
};

app.whenReady().then(() => {
  // dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] });
  ipcMain.handle('get-package-info', getPackageData);
  ipcMain.handle('get-build-from-unity', deployPackage);
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
