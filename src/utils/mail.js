import nodemailer from "nodemailer";

async function sendEmail(email, subject, title, body, url, urlText ) {

  const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"E7gezly Team" <${process.env.MAIL_USER}>`, // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    text: `${url}`, // plain text body
    html: ``, // html body
  });

  console.log("Message sent: %s", info.messageId);
}

export default sendEmail;
