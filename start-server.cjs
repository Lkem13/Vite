const { exec } = require('child_process');

const serverProcess = exec('nodemon src/services/miniapi/index.ts');

serverProcess.stdout.on('data', (data) => {
  console.log(data);
});

serverProcess.stderr.on('data', (data) => {
  console.error(data);
});
