const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const axios = require('axios');

const request = async (method, url, headers, data) => {
  try {
    return await axios({
      method: method,
      url: url,
      headers: headers,
      data: data,
    });
  } catch (error) {}
};

(async () => {
  var response = await request('GET', 'https://google.com', {
    'user-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
  });

  if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
    });
  } else {
    console.log(
      response.status,
      `processed by worker: ${process.pid}`
    );
    process.exit();
  }
})();
