const installButton = document.getElementById('install-button');

installButton.addEventListener('click', async () => {
  const response = await window.electronAPI.getLatestBuild();
  console.log('log from renderer');
});
