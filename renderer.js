const installButton = document.getElementById('install-button');
const lastCommit = document.getElementById('last-commit');
const buildDate = document.getElementById('build-date');
const buildNumber = document.getElementById('build-number');
const installationFolder = document.getElementById('installation-folder');

installButton.addEventListener('click', async () => {
  const response = await window.electronAPI.getLatestBuild();
  lastCommit.innerText = `${response.commitMsg}`;
  buildDate.innerText = `${response.buildDate}`;
  buildNumber.innerText = `${response.buildNumber}`;
  installationFolder.innerText = `${response.installationPath}`;
  // console.log(response);
});
