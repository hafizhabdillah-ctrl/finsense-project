const prisma = require('../config/prisma');

// Create anomaly (dipanggil oleh AI service)
exports.createAnomaly = async (req, res) => {
  try {
    const { transaction_id, anomaly_type, severity, deviation_pct } = req.body;
    // Pastikan transaksi milik user
    const transaction = await prisma.transaction.findFirst({
      where: { id: transaction_id, user_id: req.userId },
    });
    if (!transaction)
      return res.status(404).json({ error: 'Transaction not found' });

    const anomaly = await prisma.anomalyDetection.create({
      data: {
        user_id: req.userId,
        transaction_id,
        anomaly_type,
        severity,
        deviation_pct: parseFloat(deviation_pct),
        detected_at: new Date(),
      },
    });
    // Tandai transaksi sebagai anomali
    await prisma.transaction.update({
      where: { id: transaction_id },
      data: { is_anomaly: true },
    });
    res.status(201).json(anomaly);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getAnomalies = async (req, res) => {
  try {
    const anomalies = await prisma.anomalyDetection.findMany({
      where: { user_id: req.userId },
      include: { transaction: true },
      orderBy: { detected_at: 'desc' },
    });
    res.json(anomalies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.reviewAnomaly = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_reviewed } = req.body;

    // Cek apakah anomaly milik user dan exists
    const existing = await prisma.anomalyDetection.findFirst({
      where: { id: parseInt(id), user_id: req.userId },
    });
    if (!existing) {
      return res.status(404).json({ error: 'Anomaly record not found' });
    }

    const updated = await prisma.anomalyDetection.update({
      where: { id: parseInt(id) },
      data: { is_reviewed: is_reviewed === true },
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
