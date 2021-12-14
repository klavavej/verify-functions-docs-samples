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
  const { content } = JSON.parse(event.body);
  console.log(`Sending PDF report to kristen-test@netlify.com}`);

  const report = Buffer.from(
    new jsPDF().text(content, 10, 10).output('arraybuffer'),
  );
  const info = await transporter.sendMail({
    from: process.env.MAILGUN_SENDER,
    to: process.env.MAILGUN_DESTINATION,
    subject: 'Your report is ready!',
    text: 'See attached report PDF',
    attachments: [
      {
        filename: `report-${new Date().toDateString()}.pdf`,
        content: report,
        contentType: 'application/pdf',
      },
    ],
  });

  console.log(`PDF report sent: ${info.messageId}`);
};