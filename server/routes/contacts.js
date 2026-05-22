import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../db.js';

const router = express.Router();

// Validation middleware
const validateContact = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('category').isIn(['soap', 'shampoo']).withMessage('Invalid category'),
  body('product').trim().notEmpty().withMessage('Product is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
];

// POST: Submit contact form
router.post('/submit', validateContact, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, category, product, quantity, message } = req.body;

    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute(
        'INSERT INTO contacts (name, email, category, product, quantity, message) VALUES (?, ?, ?, ?, ?, ?)',
        [name, email, category, product, quantity, message]
      );

      res.json({
        success: true,
        message: 'Your request has been received. We will contact you soon!',
        contactId: result.insertId,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error submitting contact:', error);
    res.status(500).json({ success: false, message: 'Error processing your request. Please try again.' });
  }
});

// GET: Fetch all contacts (admin endpoint)
router.get('/list', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    try {
      const [contacts] = await connection.execute(
        'SELECT id, name, email, category, product, quantity, message, created_at, status FROM contacts ORDER BY created_at DESC'
      );

      res.json({ success: true, data: contacts, count: contacts.length });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ success: false, message: 'Error fetching contacts' });
  }
});

// GET: Fetch contact by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    try {
      const [contact] = await connection.execute(
        'SELECT * FROM contacts WHERE id = ?',
        [id]
      );

      if (contact.length === 0) {
        return res.status(404).json({ success: false, message: 'Contact not found' });
      }

      res.json({ success: true, data: contact[0] });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ success: false, message: 'Error fetching contact' });
  }
});

// PATCH: Update contact status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['new', 'contacted', 'completed', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute(
        'UPDATE contacts SET status = ? WHERE id = ?',
        [status, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Contact not found' });
      }

      res.json({ success: true, message: 'Status updated successfully' });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ success: false, message: 'Error updating contact' });
  }
});

export default router;
