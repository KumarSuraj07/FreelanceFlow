const nodemailer = require('nodemailer');
const Invoice = require('../models/Invoice');

const createTransporter = () => nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = async (email, otp, type = 'signup') => {
  const isReset = type === 'reset';
  await createTransporter().sendMail({
    from: `"FreelanceFlow" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: isReset ? 'Reset your FreelanceFlow password' : 'Your FreelanceFlow verification code',
    html: `
      <div style="font-family:sans-serif;max-width:400px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px">
        <h2 style="color:#2563eb;margin-bottom:8px">${isReset ? 'Reset your password' : 'Verify your email'}</h2>
        <p style="color:#6b7280;margin-bottom:24px">${isReset ? 'Use the code below to reset your password.' : 'Use the code below to complete your signup.'} It expires in <strong>10 minutes</strong>.</p>
        <div style="font-size:36px;font-weight:700;letter-spacing:8px;color:#111827;text-align:center;padding:16px;background:#f3f4f6;border-radius:8px">${otp}</div>
        <p style="color:#9ca3af;font-size:12px;margin-top:24px">If you didn't request this, you can safely ignore this email.</p>
      </div>`,
  });
};

const sendPaymentReminders = async () => {
  try {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const overdueInvoices = await Invoice.find({
      status: 'Unpaid',
      dueDate: { $lte: threeDaysFromNow },
    }).populate('clientId userId');

    const transporter = createTransporter();

    for (const invoice of overdueInvoices) {
      const isOverdue = new Date(invoice.dueDate) < new Date();
      const subject = isOverdue
        ? `Overdue Invoice ${invoice.invoiceNumber}`
        : `Payment Reminder: Invoice ${invoice.invoiceNumber}`;
      const text = isOverdue
        ? `Your invoice ${invoice.invoiceNumber} for $${invoice.total} is overdue. Please make payment as soon as possible.`
        : `This is a friendly reminder that invoice ${invoice.invoiceNumber} for $${invoice.total} is due on ${new Date(invoice.dueDate).toLocaleDateString()}.`;

      await transporter.sendMail({
        from: `"FreelanceFlow" <${process.env.EMAIL_USER}>`,
        to: invoice.clientId.email,
        subject,
        text,
      });

      if (isOverdue) {
        await Invoice.findByIdAndUpdate(invoice._id, { status: 'Overdue' });
      }
    }

    console.log(`Sent ${overdueInvoices.length} payment reminders`);
  } catch (error) {
    console.error('Error sending payment reminders:', error);
  }
};

module.exports = { sendOtpEmail, sendPaymentReminders };
