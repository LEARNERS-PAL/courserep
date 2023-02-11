import WAWebJS, { Client, LocalAuth, RemoteAuth } from 'whatsapp-web.js';

import DBCONNECT from './mongodb/_init';
import { MongoStore } from 'wwebjs-mongo';
import mongoose from 'mongoose';
import qrcode from 'qrcode-terminal';

let qr_code = null as string | null;
let isDevMode = false;


(async () => {
    await DBCONNECT();
    const store = new MongoStore({ mongoose: mongoose });
    const client = new Client({
        puppeteer: {
            headless: isDevMode ? false : true,
            args: isDevMode ? [] : [
                "--no-sandbox",
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
            ]
        },
        authStrategy: new RemoteAuth({
            store: store,
            backupSyncIntervalMs: 300000
        })
        // authStrategy: new LocalAuth()
    });

    const connection = mongoose.connection;

    // client  on qr
    client.on('qr', (qr) => {
        qr_code = qr;
        qrcode.generate(qr, { small: true });
    });

    // client on ready
    client.on('ready', async () => {
        console.log('Client is ready!');
        console.log(await client.getWWebVersion());
        qr_code = "Done";

        const allChats = await client.getChats();
        const chat = allChats.find((chat) => {
            return chat.name.toLocaleLowerCase().includes(isDevMode ? "testing" : 'github');
        });


        const startMessage = await chat?.sendMessage("I am back online ✅")
        const botContact = await startMessage?.getContact()
        console.log(botContact);
    })

    // client on authenticated
    client.on("authenticated", () => {
        console.log("AUTHENTICATED");
    });

    client.on("auth_failure", (msg) => {
        // Fired if session restore was unsuccessful
        console.error("AUTHENTICATION FAILURE", msg);
    });


    connection.once("open", async () => {
        console.log(">> Mongo database connection established successfully <<");
        // await initModels();
    });
    connection.on("error", () => {
        console.error.bind(console, ">> connection error <<");
    });

    // ping client
    client.on('message', async (message) => {
        if(message.body === '!ping') {
            client.sendMessage(message.from, 'pong pong pong🚀');
        }
    })

    // INIT CLIENT
    client.initialize();


})();

