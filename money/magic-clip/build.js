const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

const srcDir = __dirname;
const buildDir = path.join(__dirname, '.build');
const outZip = path.join(__dirname, 'neoclip-release.zip');

const foldersToCopy = ['background', 'content', 'icons', 'lens', 'libs', 'popup'];
const filesToCopy = ['manifest.json'];

async function copyRecursiveSync(src, dest) {
    if (fs.existsSync(src)) {
        const stats = fs.statSync(src);
        if (stats.isDirectory()) {
            if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
            fs.readdirSync(src).forEach(file => {
                copyRecursiveSync(path.join(src, file), path.join(dest, file));
            });
        } else {
            fs.copyFileSync(src, dest);
        }
    }
}

async function minifyFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            await minifyFiles(fullPath);
        } else if (fullPath.endsWith('.js') && !fullPath.includes('dexie.min.js') && !fullPath.includes('jszip.min.js')) {
            console.log(`Minifying: ${fullPath}`);
            const code = fs.readFileSync(fullPath, 'utf8');
            const result = await minify(code, {
                mangle: {
                    toplevel: false, // Prevent renaming global functions to fix cross-file calls
                },
                compress: {
                    drop_console: true, // Remove console.logs
                    passes: 2
                }
            });
            fs.writeFileSync(fullPath, result.code);
        }
    }
}

async function build() {
    console.log('--- NeoClip Build Started ---');

    // 1. Clean build dir
    if (fs.existsSync(buildDir)) fs.rmSync(buildDir, { recursive: true, force: true });
    fs.mkdirSync(buildDir);

    // 2. Copy files
    console.log('Copying files...');
    for (const folder of foldersToCopy) {
        copyRecursiveSync(path.join(srcDir, folder), path.join(buildDir, folder));
    }
    for (const file of filesToCopy) {
        copyRecursiveSync(path.join(srcDir, file), path.join(buildDir, file));
    }

    // 3. Minify & Obfuscate
    console.log('Obfuscating JavaScript...');
    await minifyFiles(buildDir);

    // 4. Zip the build folder
    console.log('Creating ZIP archive...');
    if (fs.existsSync(outZip)) fs.rmSync(outZip);
    
    const { execSync } = require('child_process');
    try {
        execSync(`powershell -command "Compress-Archive -Path '${buildDir}\\*' -DestinationPath '${outZip}'"`);
        console.log(`Build complete! File saved as: ${outZip}`);
    } catch (e) {
        console.error('Failed to create zip:', e.message);
    }

    console.log('Cleaning up...');
    fs.rmSync(buildDir, { recursive: true, force: true });
}

build().catch(err => {
    console.error('Build failed:', err);
});
