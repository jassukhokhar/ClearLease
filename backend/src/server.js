import dotenv from 'dotenv';
dotenv.config();

import dns from 'dns';
// Use public DNS resolvers for SRV lookups. Some local/ISP DNS servers refuse
// the `mongodb+srv` SRV query, causing `querySrv ECONNREFUSED` against Atlas.
dns.setServers(['8.8.8.8', '1.1.1.1']);

import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(
      `🚀 ClearLease API running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`
    );
  });
};

start();

// Crash safety nets.
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
});
