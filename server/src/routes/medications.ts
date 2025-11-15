import { Router } from 'express';
import { getDb } from '../db';
import { ObjectId } from 'mongodb';

const router = Router();

// GET /medications - fetch all medications
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const meds = await db.collection('medications').find({}).toArray();
    res.json(meds);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch medications' });
  }
});

// POST /medications - add a new medication
router.post('/', async (req, res) => {
  try {
    const { name, dose, time } = req.body;
    const db = getDb();
    const result = await db.collection('medications').insertOne({
      name,
      dose,
      time,
      taken: false,
      createdAt: new Date(),
    });
    res.json({ _id: result.insertedId, name, dose, time, taken: false });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add medication' });
  }
});

// PATCH /medications/:id - mark medication as taken/untaken
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { taken } = req.body;
    const db = getDb();
    const result = await db.collection('medications').updateOne(
      { _id: new ObjectId(id) },
      { $set: { taken } }
    );
    res.json({ success: result.modifiedCount > 0 });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update medication' });
  }
});

// DELETE /medications/:id - delete a medication
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();
    const result = await db.collection('medications').deleteOne({
      _id: new ObjectId(id),
    });
    res.json({ success: result.deletedCount > 0 });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete medication' });
  }
});

export default router;
