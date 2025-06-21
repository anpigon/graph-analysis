import fs from 'fs-extra';

async function copyManifest() {
  try {
    await fs.copy('manifest.json', 'dist/manifest.json');
    console.log('manifest.json copied to dist/');
  } catch (err) {
    console.error('Error copying manifest.json:', err);
    process.exit(1);
  }
}

copyManifest();
