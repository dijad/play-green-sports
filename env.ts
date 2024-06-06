import * as fs from 'fs';

export const loadEnv = () => {
    try {
        const envFile = fs.readFileSync('.env', 'utf8');
        const envLines = envFile.split(/\r?\n/);

        envLines.forEach((line) => {
            const envPair = line.match(/^\s*([\w\.\-]+)\s*=\s*(.*)?\s*$/);
            if (envPair !== null) {
                const key = envPair[1];
                const value = envPair[2] || '';
                process.env[key] = value;
            }
        });
    } catch (err) {
        console.error('Error al cargar el archivo .env:', err);
    }
};