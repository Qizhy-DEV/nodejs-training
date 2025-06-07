import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

export class MailService {
    public static async sendEmail({
        email,
        subject,
        html,
    }: {
        email: string;
        subject: string;
        html: string;
    }): Promise<void> {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject,
            html,
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch (error) {
            const err = error as Error;
            throw new Error(err.message);
        }
    }
}
