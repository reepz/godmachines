const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');
const util = require('util');
const stream = require('stream');
const fs = require('fs');
const https = require('https');

async function getZipFromUnityCloud() {
  const request = await axios.get(
    'https://build-api.cloud.unity3d.com/api/v1/orgs/859214/projects/fd8f1dd8-7e95-406d-8d66-acea7b4cb33c/buildtargets/_all/builds',
    {
      headers: {
        Authorization: 'Basic ' + '05558b7ab61bb7aedeb0c95d4157ea91',
      },
    }
  );
  console.log(request.data[0].links.download_primary.href);

  const url = request.data[0].links.download_primary.href;

  https.get(url, (res) => {
    // Image will be stored at this path
    const path = `${__dirname}/files/aaa.zip`;
    const filePath = fs.createWriteStream(path);
    res.pipe(filePath);
    filePath.on('finish', () => {
      filePath.close();
      console.log('Download Completed');
    });
  });
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile('index.html');
  win.webContents.openDevTools();
};

app.whenReady().then(() => {
  ipcMain.handle('get-build-from-unity', getZipFromUnityCloud);
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
