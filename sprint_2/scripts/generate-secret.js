const crypto = require('crypto');

function generateSecret() {
    let size = Number(process.argv.slice(2)[0]);
    if (!size || Number.isNaN(size)) {
        size = 128;
    }
    const buffer = crypto.randomBytes(size);
    const hex = buffer.toString('hex');
    console.log(hex);
}

generateSecret();