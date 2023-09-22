import config from 'config'
import nodemailer, { SendMailOptions } from 'nodemailer'
import log from './logger'

// async function createCreds() {
//     const creds = await nodemailer.createTestAccount()
//     console.log({creds})
// }

// createCreds()

const smtp = config.get<{
    user: string,
    pass: string,
    host: string,
    port: number,
    secure: boolean,
}>('smtp')

const transporter = nodemailer.createTransport({
    ...smtp,
    auth: { user: smtp.user, pass: smtp.pass },
    // tls: {
    //     ciphers: "SSLv3"
    // },
})

async function sendEmail(payload: SendMailOptions) {
    transporter.sendMail(payload, (e, info) => {
        if (e) {
            log.error(e, "Error sending email")
        }

        log.info(`Preview Url: ${nodemailer.getTestMessageUrl(info)}`)
    })
}

export async function getEmail(payload: SendMailOptions) {
    return new Promise<string | false>((resolve, reject) => {
        transporter.sendMail(payload, (e, info) => {
            if (e) {
                log.error(e, "Error sending email");
                reject(e);
            } else {
                const previewUrl = nodemailer.getTestMessageUrl(info);
                if (previewUrl) {
                    // log.info(`Preview Url: ${previewUrl}`);
                    resolve(previewUrl);
                } else {
                    // log.warn('No preview URL available. Not using the test email service.');
                    resolve(false); // Resolve with `false` if there's no preview URL
                }
            }
        });
    });
}



export default sendEmail