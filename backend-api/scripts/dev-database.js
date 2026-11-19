// Database local cho phát triển, dữ liệu nằm trong backend-api/.local/mongo.
const fs = require('node:fs');
const path = require('node:path');
const { MongoMemoryReplSet } = require('mongodb-memory-server');
async function start() {
  const dbPath = path.resolve(__dirname, '../.local/mongo');
  fs.mkdirSync(dbPath, { recursive: true });
  const replica = await MongoMemoryReplSet.create({
    binary: { version: '8.0.5' },
    instanceOpts: [{ port: 27018, dbPath }],
    replSet: { count: 1, name: 'rs0', storageEngine: 'wiredTiger' },
  });
  console.log('MongoDB phát triển sẵn sàng: mongodb://127.0.0.1:27018/phone_store?replicaSet=rs0');
  console.log('Dữ liệu được giữ trong backend-api/.local/mongo. Ctrl+C để dừng.');
  let stopping = false;
  for (const signal of ['SIGINT', 'SIGTERM'])
    process.on(signal, async () => {
      if (stopping) return;
      stopping = true;
      await replica.stop({ doCleanup: false });
      process.exit(0);
    });
}
start().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
