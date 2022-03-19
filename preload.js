const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getLatestBuild: () => ipcRenderer.invoke('get-build-from-unity'),
  getDataFromUnity: () => ipcRenderer.invoke('get-package-info'),
});

// window.addEventListener('DOMContentLoaded', () => {
//   const replaceText = (selector, text) => {
//     const element = document.getElementById(selector);
//     if (element) element.innerText = text;
//   };

// const instalButton = document.getElementById('install-button');
//   instalButton.addEventListener(
//     'click',
//     replaceText('install-button', 'INSTALLING...')
//   );
// });
