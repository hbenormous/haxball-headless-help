const puppeteer = require('puppeteer');
const fs = require('fs');

async function carregar(arquivo) {
    const nav = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const pag = await nav.newPage();
    
    try {
        await pag.goto('https://www.haxball.com/headless', {waitUntil: 'networkidle2'});
    }
    catch (e) {
        throw new Error('Não foi possível conectar ao Haxball Headless.');
    }
    await pag.evaluate(
        fs.readFileSync(arquivo, {encoding: 'utf-8'})
    );    
    await pag.waitForTimeout(1500);
    const a = await pag.$('iframe');
    const b = await a.contentFrame();
    const recaptcha = await b.$eval('#recaptcha', e => e.innerHTML);
    if (recaptcha) {
        throw new Error('O token é inválido ou expirou.');
    }   
    return await b.$eval('#roomlink a', e => {
        return e.getAttribute('href');
    });
}
const pegar = process.argv.slice(2);
if (pegar.length >= 1) {
    let arquivo = pegar[0];

    carregar(arquivo).then((roomLink) => {
        console.log('\x1b[32m%s\x1b[0m', 'Link: ' + roomLink);
    }).catch((e) => {
        console.error('\x1b[31m%s\x1b[0m', e)
        process.exit(1);
    });
}
else {
    console.error('Arquivo não encontrado.');
    process.exit(1);
}