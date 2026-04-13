import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, '.env'),
});

import connectDB from './db/index.js';
import { app } from './app.js';

connectDB()
  .then(() => {
    app.on('error', (error) => {
      console.log('Server Error:', error);
    });

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log('MongoDB Connection Failed:', err);
  });