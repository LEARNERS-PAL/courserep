import qrcode from 'qrcode-terminal';

import { Client } from 'whatsapp-web.js';
const client = new Client({ puppeteer: { headless: true } });

client.on('qr', (qr: string) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();
