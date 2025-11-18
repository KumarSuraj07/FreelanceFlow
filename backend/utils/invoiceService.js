const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');

const generateInvoicePDF = async (invoice, user) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 40px; }
        .invoice-details { margin-bottom: 30px; }
        .client-info { margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f5f5f5; }
        .totals { text-align: right; }
        .total-row { font-weight: bold; font-size: 18px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>INVOICE</h1>
        <h2>${user.name}</h2>
      </div>
      
      <div class="invoice-details">
        <p><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
        <p><strong>Date:</strong> ${new Date(invoice.createdAt).toLocaleDateString()}</p>
        <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
      </div>
      
      <div class="client-info">
        <h3>Bill To:</h3>
        <p>${invoice.clientId.name}</p>
        <p>${invoice.clientId.company || ''}</p>
        <p>${invoice.clientId.email}</p>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Quantity</th>
            <th>Rate</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items.map(item => `
            <tr>
              <td>${item.description}</td>
              <td>${item.quantity}</td>
              <td>$${item.rate.toFixed(2)}</td>
              <td>$${item.amount.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="totals">
        <p>Subtotal: $${invoice.subtotal.toFixed(2)}</p>
        <p>Tax (${invoice.taxPercent}%): $${invoice.taxAmount.toFixed(2)}</p>
        <p class="total-row">Total: $${invoice.total.toFixed(2)}</p>
      </div>
    </body>
    </html>
  `;
  
  await page.setContent(html);
  const pdf = await page.pdf({ format: 'A4' });
  await browser.close();
  
  return pdf;
};

const sendInvoiceEmail = async (invoice, user) => {
  const transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const pdfBuffer = await generateInvoicePDF(invoice, user);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: invoice.clientId.email,
    subject: `Invoice ${invoice.invoiceNumber} from ${user.name}`,
    text: `Please find attached invoice ${invoice.invoiceNumber}. Due date: ${new Date(invoice.dueDate).toLocaleDateString()}`,
    attachments: [{
      filename: `invoice-${invoice.invoiceNumber}.pdf`,
      content: pdfBuffer
    }]
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { generateInvoicePDF, sendInvoiceEmail };