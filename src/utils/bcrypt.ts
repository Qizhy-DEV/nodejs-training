import bcrypt from 'bcrypt';

export async function encryptPassword(plainPassword: string) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
}

export async function verifyPassword(plainPassword: string, hashedPassword: string) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}
