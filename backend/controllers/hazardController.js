import Hazard from '../models/Hazard.js';

export const createHazard = async (req, res, next) => {
  try {
    const { description, category, latitude, longitude, severity } = req.body;

    if (!description || !category || typeof latitude === 'undefined' || typeof longitude === 'undefined') {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const imageUrl = req.uploadedImageUrl || undefined;
    const hazard = await Hazard.create({
      userId: req.user?.id,
      description,
      category,
      imageUrl,
      latitude,
      longitude,
      severity: severity || 'Low'
    });
    res.status(201).json(hazard);
  } catch (err) {
    next(err);
  }
};

export const getHazards = async (req, res, next) => {
  try {
    const { category, status } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    const hazards = await Hazard.find(filter).sort({ createdAt: -1 });
    res.json(hazards);
  } catch (err) {
    next(err);
  }
};

export const updateHazardStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['Pending', 'In Progress', 'Resolved'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const updated = await Hazard.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Hazard not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};






