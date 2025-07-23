import { App } from './app';

/**
 * Application entry point
 */
const startServer = (): void => {
  try {
    const app = new App();
    app.start();
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer(); 