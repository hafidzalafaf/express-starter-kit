import 'module-alias/register';
import App from './app';

// Create logs directory if it doesn't exist
import fs from 'fs';
import path from 'path';

const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Start the application
const app = new App();
app.start().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
