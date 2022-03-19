const installButton = document.getElementById('install-button');
const lastCommit = document.getElementById('last-commit');
const buildDate = document.getElementById('build-date');
const buildNumber = document.getElementById('build-number');
const installationFolder = document.getElementById('installation-folder');

installButton.addEventListener('click', async () => {
  // installButton.innerText = 'INSTALLING';
  const response = await window.electronAPI.getLatestBuild();
  installationFolder.innerText = `${response.installationPath}`;
});

window.addEventListener('load', async () => {
  const response = await window.electronAPI.getDataFromUnity();
  lastCommit.innerText = `${response.commitMsg}`;
  buildDate.innerText = `${response.buildDate}`;
  buildNumber.innerText = `${response.buildNumber}`;
});
