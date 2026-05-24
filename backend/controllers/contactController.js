const Contact = require('../models/Contact');
const sendEmail = require('../utils/sendEmail');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Save to DB
  await Contact.create({ name, email, subject, message });

  // Notify admin by email
  const html = `
    <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 24px; border: 1px solid #e7e5e4; border-radius: 8px;">
      <h2 style="color: #f97316;">New Contact Message — DigitalVault</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p style="background: #fafaf9; padding: 12px; border-radius: 6px;">${message}</p>
    </div>
  `;

  try {
    await sendEmail({ to: 'monikachandaka24@gmail.com', subject: `Contact: ${subject}`, html });
  } catch (err) {
    console.error('Contact email error:', err.message);
    // Don't fail the request if email fails
  }

  res.status(201).json({ message: 'Message sent successfully. We will respond within 24 hours.' });
};

// @desc    Get all contact messages (Admin)
// @route   GET /api/contact
// @access  Private/Admin
const getContacts = async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  res.json({ contacts });
};

module.exports = { submitContact, getContacts };
