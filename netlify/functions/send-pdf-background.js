const { jsPDF } = require('jspdf');
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');

const transporter = nodemailer.createTransport(
  mg({
    auth: {
      api_key: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
    },
  }),
);

exports.handler = async function (event) {
  const { content, destination } = JSON.parse(event.body);
  console.log(`Sending PDF report to ${destination}`);

  const info = await transporter.sendMail({
    from: process.env.MAILGUN_SENDER,
    to: destination,
    subject: 'Your report is ready!',
    text: 'See attached report PDF',
  });

  console.log(`PDF report sent: ${info.messageId}`);
};
