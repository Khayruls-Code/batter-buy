const nodeMailer = require("nodemailer")

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
      user: process.env.OFFICIAL_EMAIL,
      pass: process.env.OFFICIAL_EMAIL_PASS
    }
  })

  const transportOptions = {
    form: process.env.OFFICIAL_EMAIL,
    to: options.email,
    subject: options.subject,
    text: options.message
  }

  await transporter.sendMail(transportOptions)
}

module.exports = sendEmail;