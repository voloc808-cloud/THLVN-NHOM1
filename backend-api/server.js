const mongoose = require('mongoose');
const { getEnv } = require('./src/config/env');
const { createApp } = require('./src/app');
async function start() {
  const env = getEnv();
  const app = createApp(env.origin);
  await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 10000 });
  await Promise.all(Object.values(mongoose.models).map((model) => model.init()));
  const server = app.listen(env.port, () =>
    console.log('API sẵn sàng tại http://localhost:' + env.port + '/api'),
  );
  for (const signal of ['SIGINT', 'SIGTERM'])
    process.on(signal, () =>
      server.close(async () => {
        await mongoose.disconnect();
        process.exit(0);
      }),
    );
}
start().catch((error) => {
  console.error('Không khởi động được API:', error.message);
  process.exitCode = 1;
});
