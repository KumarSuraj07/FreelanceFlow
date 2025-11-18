const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Client = require('../models/Client');
const Project = require('../models/Project');
const Invoice = require('../models/Invoice');
const Note = require('../models/Note');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Clear existing data
    await User.deleteMany({});
    await Client.deleteMany({});
    await Project.deleteMany({});
    await Invoice.deleteMany({});
    await Note.deleteMany({});

    // Create user
    const user = await User.create({
      name: 'John Freelancer',
      email: 'john@freelancer.com',
      password: 'password123'
    });

    // Create clients
    const clients = await Client.create([
      {
        name: 'Alice Johnson',
        email: 'alice@techcorp.com',
        phone: '+1-555-0101',
        company: 'TechCorp Inc.',
        projectType: 'Web Development',
        budget: 15000,
        status: 'Active',
        userId: user._id
      },
      {
        name: 'Bob Smith',
        email: 'bob@designstudio.com',
        phone: '+1-555-0102',
        company: 'Design Studio',
        projectType: 'UI/UX Design',
        budget: 8000,
        status: 'Active',
        userId: user._id
      }
    ]);

    // Create projects
    const projects = await Project.create([
      {
        title: 'E-commerce Website',
        description: 'Build a modern e-commerce platform',
        deadline: new Date('2024-03-15'),
        status: 'In Progress',
        deliverables: [
          { title: 'Homepage Design', description: 'Create homepage mockup', completed: true },
          { title: 'Product Pages', description: 'Build product listing and detail pages', completed: false }
        ],
        clientId: clients[0]._id,
        userId: user._id
      },
      {
        title: 'Mobile App Design',
        description: 'Design UI for mobile application',
        deadline: new Date('2024-02-28'),
        status: 'Pending',
        deliverables: [
          { title: 'Wireframes', description: 'Create app wireframes', completed: false }
        ],
        clientId: clients[1]._id,
        userId: user._id
      }
    ]);

    // Create invoices
    const invoices = await Invoice.create([
      {
        invoiceNumber: 'INV-001',
        items: [
          { description: 'Website Development - Phase 1', quantity: 1, rate: 5000, amount: 5000 }
        ],
        subtotal: 5000,
        taxPercent: 10,
        taxAmount: 500,
        total: 5500,
        dueDate: new Date('2024-02-15'),
        status: 'Unpaid',
        clientId: clients[0]._id,
        userId: user._id
      },
      {
        invoiceNumber: 'INV-002',
        items: [
          { description: 'UI Design Consultation', quantity: 8, rate: 100, amount: 800 }
        ],
        subtotal: 800,
        taxPercent: 10,
        taxAmount: 80,
        total: 880,
        dueDate: new Date('2024-01-30'),
        status: 'Paid',
        clientId: clients[1]._id,
        userId: user._id
      }
    ]);

    // Create notes
    await Note.create([
      {
        date: new Date('2024-01-15'),
        noteText: 'Initial project discussion. Client wants modern design with focus on user experience.',
        nextSteps: 'Create wireframes and present design concepts',
        clientId: clients[0]._id,
        userId: user._id
      },
      {
        date: new Date('2024-01-20'),
        noteText: 'Design review meeting. Client approved the color scheme and layout.',
        nextSteps: 'Start development phase',
        clientId: clients[1]._id,
        userId: user._id
      }
    ]);

    console.log('Seed data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();