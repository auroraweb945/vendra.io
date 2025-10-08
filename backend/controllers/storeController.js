const { createStore, findStoreByUserId, updateStore } = require('../models/storeModel');

// Create Store
exports.createStore = async (req, res) => {
  const { name, slug, description, logo_url, about, background_url, feedbacks } = req.body;

  if (!name || !slug) return res.status(400).json({ error: 'Store name and slug are required' });
  if (about && Array.isArray(about) && about.length > 3) {
    return res.status(400).json({ error: 'A maximum of 3 offers are allowed.' });
  }
  if (feedbacks && Array.isArray(feedbacks) && feedbacks.length > 3) {
    return res.status(400).json({ error: 'A maximum of 3 feedbacks are allowed.' });
  }

  try {
    const existing = await findStoreByUserId(req.user.id);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'User already has a store' });
    }

    const store = {
      user_id: req.user.id,
      name,
      slug,
      description: description || '',
      logo_url: logo_url || '',
      about: about || [],
      background_url: background_url || '',
      feedbacks: feedbacks || []
    };

    await createStore(store);
    res.status(201).json({ message: 'Store created successfully' });
  } catch (err) {
    console.error('Error creating store:', err);
    res.status(500).json({ error: 'Failed to create store' });
  }
};

// Get Store
exports.getStore = async (req, res) => {
  try {
    const result = await findStoreByUserId(req.user.id);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Store not found' });

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching store:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update Store
exports.updateStore = async (req, res) => {
  const { name, slug, description, logo_url, about, background_url, feedbacks } = req.body;

  if (!name || !slug) return res.status(400).json({ error: 'Store name and slug are required' });
  if (about && Array.isArray(about) && about.length > 3) {
    return res.status(400).json({ error: 'A maximum of 3 offers are allowed.' });
  }
  if (feedbacks && Array.isArray(feedbacks) && feedbacks.length > 3) {
    return res.status(400).json({ error: 'A maximum of 3 feedbacks are allowed.' });
  }

  const updates = {
    name,
    slug,
    description: description || '',
    logo_url: logo_url || '',
    about: about || [],
    background_url: background_url || '',
    feedbacks: feedbacks || []
  };

  try {
    await updateStore(req.user.id, updates);
    res.json({ message: 'Store updated successfully' });
  } catch (err) {
    console.error('Error updating store:', err);
    res.status(500).json({ error: 'Failed to update store' });
  }
};
