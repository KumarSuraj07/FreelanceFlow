const Invoice = require('../models/Invoice');
const { generateInvoicePDF, sendInvoiceEmail } = require('../utils/invoiceService');

exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.user._id }).populate('clientId', 'name email company');
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, userId: req.user._id }).populate('clientId');
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createInvoice = async (req, res) => {
  try {
    const invoiceNumber = `INV-${Date.now()}`;
    const invoice = await Invoice.create({ 
      ...req.body, 
      invoiceNumber,
      userId: req.user._id 
    });
    await invoice.populate('clientId', 'name email company');
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    ).populate('clientId', 'name email company');
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.generatePDF = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, userId: req.user._id }).populate('clientId');
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    const pdfBuffer = await generateInvoicePDF(invoice, req.user);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendEmail = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, userId: req.user._id }).populate('clientId');
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    await sendInvoiceEmail(invoice, req.user);
    res.json({ message: 'Invoice sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};