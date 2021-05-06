import { pbkdf2Sync, randomBytes } from 'crypto';

const SALT_SIZE = 64;
const PASSWORD_SIZE = 256;
const ITERATIONS = 10000;

export const hashSaltFactory = (password: string, salt: string | null = null): string => {
    let saltBytes: Buffer;
    if (!salt) {
        saltBytes = randomBytes(SALT_SIZE);
        salt = saltBytes.toString('base64');
    } else {
        saltBytes = Buffer.from(salt, 'base64');
    }
    const hash = pbkdf2Sync(password, saltBytes, ITERATIONS, PASSWORD_SIZE, 'sha512').toString('base64');
    return `${hash} ${salt}`;
}
