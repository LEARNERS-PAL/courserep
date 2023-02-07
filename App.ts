import { Client } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

const client = new Client({ puppeteer: { headless: true } });

// GLOBAL VARIABLES
let qr_code = null as string | null;


client.on('qr', (qr: string) => {
    // Generate and scan this code with your phone
    qr_code = qr;
    console.log("QR RECEIVED", qr);
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});


client.on('message', message => {
    console.log(message);
    if (message.body === '!ping') {
        message.reply('pong🚀');
    }
});

client.initialize();
