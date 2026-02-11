const fs = require('fs');
const os = require('os');

function getLocalIP() {
    // 1. Check if Docker passed us the Host IP via environment variable
    if (process.env.REACT_NATIVE_PACKAGER_HOSTNAME) {
        return process.env.REACT_NATIVE_PACKAGER_HOSTNAME;
    }

    // 2. Fallback for local development (not in Docker)
    const interfaces = os.networkInterfaces();
    for (const devName in interfaces) {
        const iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return 'localhost';
}

const computerIP = getLocalIP();
const PORT = process.env.BACKEND_PORT || '3000';

const content = `
import { Platform } from 'react-native';

const COMPUTER_IP = '${computerIP}';
const PORT = '${PORT}';

// Decide the base URL based on platform and environment
const getBaseUrl = () => {
  if (Platform.OS === 'android' && !Platform.isDevice) {
    return \`http://10.0.2.2:\${PORT}\`;
  }
  return \`http://\${COMPUTER_IP}:\${PORT}\`;
};

export const API_BASE_URL = getBaseUrl();

console.log('🔗 API URL:', API_BASE_URL);
`;

fs.writeFileSync('./config.js', content);
console.log(`✅ Config generated with IP: ${computerIP}`);