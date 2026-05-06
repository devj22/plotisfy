import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buildApp() {
  try {
    // Import Vite dynamically
    const { build } = await import('vite');
    
    // Build the application
    await build({
      configFile: resolve(__dirname, '../vite.config.ts'),
      mode: 'production',
    });
    
    console.log('✅ Build complete');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildApp(); 