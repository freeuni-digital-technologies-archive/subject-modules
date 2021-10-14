import nodemailer from 'nodemailer'
require('dotenv').config()

const email = process.env.GMAIL_ID
const pass = process.env.GMAIL_PASS

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: email,
        pass: pass
    }
});

export function sendEmails(emails :Array<any>, interval :number) {
    emails.forEach((email :any, index :number) => {
        setTimeout(() => {
            sendEmail(email.to, email.subject, email.text, email.callback, email.attachments)
        }, index*interval)
    })
}

// TODO fix these types
export function sendEmail(to :string, subject :string, text :string, callback :any, attachments :any) {
    const mailOptions = {
        from: email,
        to: to,
        subject: subject,
        text: text,
        attachments: undefined
    };
    if (attachments) {
        mailOptions.attachments = attachments
    }
    console.log('sending email to ', to)
    // callback()
    transporter.sendMail(mailOptions, function (error, info: any) {
        if (error) {
            console.log(error);
        } else {
            if (info.response.Error) {
                console.log('error while sending email to', to, info.response)
            }
            else {
                console.log('Email sent to: ' + to + '\n' + info.response);
                callback()
            }
        }
    })

}
