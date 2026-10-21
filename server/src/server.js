const env = require('./config/env');
const { connectDb } = require('./config/db');
const app = require('./app');

async function start() {
  await connectDb();
  app.listen(env.port, () => {
    console.log(`Civora API running on port ${env.port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
