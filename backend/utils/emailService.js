const nodemailer = require('nodemailer');
const Invoice = require('../models/Invoice');
const User = require('../models/User');

const sendPaymentReminders = async () => {
  try {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    
    const overdueInvoices = await Invoice.find({
      status: 'Unpaid',
      dueDate: { $lte: threeDaysFromNow }
    }).populate('clientId userId');

    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    for (const invoice of overdueInvoices) {
      const isOverdue = new Date(invoice.dueDate) < new Date();
      const subject = isOverdue 
        ? `Overdue Invoice ${invoice.invoiceNumber}` 
        : `Payment Reminder: Invoice ${invoice.invoiceNumber}`;
      
      const text = isOverdue
        ? `Your invoice ${invoice.invoiceNumber} for $${invoice.total} is overdue. Please make payment as soon as possible.`
        : `This is a friendly reminder that invoice ${invoice.invoiceNumber} for $${invoice.total} is due on ${new Date(invoice.dueDate).toLocaleDateString()}.`;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: invoice.clientId.email,
        subject,
        text
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

module.exports = { sendPaymentReminders };