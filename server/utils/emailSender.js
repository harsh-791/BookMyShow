const nodemailer = require('nodemailer');
const fs = require("fs");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();

const { SENDGRID_API_KEY } = process.env;

function replaceContent(content, creds) {
    let allkeysArr = Object.keys(creds);
    allkeysArr.forEach(function (key) {
        content = content.replace(`#{${key}}`, creds[key]);
    })

    return content;
}
async function EmailHelper(templateName, reciverEmail, creds) {
    // console.log(templateName, reciverEmail, creds)
    try {
        const templatePath = path.join(__dirname, "email_templates", templateName);
        let content = await fs.promises.readFile(templatePath, "utf-8");
        const emailDetails = {
            to: reciverEmail,
            from: 'Your Email', // Change to your verified sender;
            subject: 'RESET OTP',
            text: `Hi ${creds.name} this your reset otp ${creds.otp}`,
            html: replaceContent(content, creds),
        }
        const transportDetails = {
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: "Your Email",
                pass: "your pass"
            }
        }

        const transporter = nodemailer.createTransport(transportDetails);
        await transporter.sendMail((emailDetails))
        console.log("email sent")
    } catch (err) {
        console.log(err)
    }

}

module.exports = EmailHelper;