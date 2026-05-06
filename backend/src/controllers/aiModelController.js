const prisma = require('../config/prisma');

exports.getModels = async (req, res) => {
  try {
    const models = await prisma.aiModel.findMany({
      orderBy: { deployed_at: 'desc' },
    });
    res.json(models);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
