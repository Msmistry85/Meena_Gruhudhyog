import express from 'express';
import { body, validationResult } from 'express-validator';
import { poolConnect } from '../db.js';

const router = express.Router();
const VALID_STATUSES = ['new', 'contacted', 'completed', 'rejected'];
const CONTACT_SELECT_FIELDS = 'id, name, email, category, product, quantity, message, created_at, status';
const SELECT_CONTACTS_QUERY = `SELECT ${CONTACT_SELECT_FIELDS} FROM contacts ORDER BY created_at DESC`;
const SELECT_CONTACT_BY_ID_QUERY = 'SELECT * FROM contacts WHERE id = @id';
const INSERT_CONTACT_QUERY = `
  INSERT INTO contacts (name, email, category, product, quantity, message)
  OUTPUT INSERTED.id
  VALUES (@name, @email, @category, @product, @quantity, @message)`;
const UPDATE_STATUS_QUERY = 'UPDATE contacts SET status = @status WHERE id = @id';

const validateContact = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('category').isIn(['soap', 'shampoo']).withMessage('Invalid category'),
  body('product').trim().notEmpty().withMessage('Product is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
];

const getDbPool = async () => {
  const pool = await poolConnect;
  if (!pool) {
    throw new Error('Database unavailable');
  }
  return pool;
};

router.post('/submit', validateContact, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, category, product, quantity, message } = req.body;
    const pool = await getDbPool();
    const request = pool.request();

    request.input('name', name);
    request.input('email', email);
    request.input('category', category);
    request.input('product', product);
    request.input('quantity', quantity);
    request.input('message', message);

    const result = await request.query(INSERT_CONTACT_QUERY);
    res.json({
      success: true,
      message: 'Your request has been received. We will contact you soon!',
      contactId: result.recordset[0]?.id,
    });
  } catch (error) {
    console.error('Error submitting contact:', error);
    res.status(500).json({ success: false, message: 'Error processing your request. Please try again.' });
  }
});

router.get('/list', async (req, res) => {
  try {
    const pool = await getDbPool();
    const result = await pool.request().query(SELECT_CONTACTS_QUERY);
    res.json({ success: true, data: result.recordset, count: result.recordset.length });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ success: false, message: 'Error fetching contacts' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getDbPool();
    const result = await pool.request().input('id', id).query(SELECT_CONTACT_BY_ID_QUERY);

    if (!result.recordset.length) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    res.json({ success: true, data: result.recordset[0] });
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ success: false, message: 'Error fetching contact' });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const pool = await getDbPool();
    const result = await pool.request().input('id', id).input('status', status).query(UPDATE_STATUS_QUERY);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    res.json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ success: false, message: 'Error updating contact' });
  }
});

export default router;
