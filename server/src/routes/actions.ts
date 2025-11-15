import { Router } from 'express';
import { getDb } from '../db';
import { ObjectId } from 'mongodb';

const router = Router();

// GET /actions - fetch all actions
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const actions = await db.collection('actions').find({}).sort({ createdAt: -1 }).toArray();
    res.json(actions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch actions' });
  }
});

// POST /actions - add a new action (generic endpoint)
router.post('/', async (req, res) => {
  try {
    const { type, details } = req.body;
    const db = getDb();
    const result = await db.collection('actions').insertOne({
      type,
      details: details || {},
      createdAt: new Date(),
    });
    res.json({ _id: result.insertedId, type, details: details || {}, createdAt: new Date() });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add action' });
  }
});

// POST /actions/scan-prescription - scan prescription
router.post('/scan-prescription', async (req, res) => {
  try {
    const { prescriptionName, doctorName, notes } = req.body;
    const db = getDb();
    const result = await db.collection('actions').insertOne({
      type: 'scan-prescription',
      details: { prescriptionName, doctorName, notes },
      createdAt: new Date(),
    });
    res.json({ _id: result.insertedId, type: 'scan-prescription', details: { prescriptionName, doctorName, notes } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to scan prescription' });
  }
});

// POST /actions/book-appointment - book appointment
router.post('/book-appointment', async (req, res) => {
  try {
    const { doctorName, date, time, reason } = req.body;
    const db = getDb();
    const result = await db.collection('actions').insertOne({
      type: 'book-appointment',
      details: { doctorName, date, time, reason },
      createdAt: new Date(),
    });
    res.json({ _id: result.insertedId, type: 'book-appointment', details: { doctorName, date, time, reason } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to book appointment' });
  }
});

// POST /actions/care-companion - care companion
router.post('/care-companion', async (req, res) => {
  try {
    const { companionType, duration, notes } = req.body;
    const db = getDb();
    const result = await db.collection('actions').insertOne({
      type: 'care-companion',
      details: { companionType, duration, notes },
      createdAt: new Date(),
    });
    res.json({ _id: result.insertedId, type: 'care-companion', details: { companionType, duration, notes } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add care companion' });
  }
});

// DELETE /actions/:id - delete an action
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();
    const result = await db.collection('actions').deleteOne({
      _id: new ObjectId(id),
    });
    res.json({ success: result.deletedCount > 0 });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete action' });
  }
});

export default router;
