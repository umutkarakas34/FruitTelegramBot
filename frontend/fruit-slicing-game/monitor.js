const { exec } = require('child_process');

// npm start komutunu çalıştıran bir fonksiyon
function startApp() {
  console.log('Starting React app...');
  const process = exec('npm start', { shell: true });

  // Uygulamanın çıktısını terminale yönlendir
  process.stdout.on('data', (data) => {
    console.log(data);
  });

  process.stderr.on('data', (data) => {
    console.error(`Error: ${data}`);
  });

  process.on('close', (code) => {
    console.log(`React app closed with code ${code}. Restarting...`);
    startApp(); // Tekrar başlat
  });
}

// React uygulamasını başlat
startApp();
