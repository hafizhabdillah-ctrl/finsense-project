const prisma = require('../config/prisma');

exports.getForecasts = async (req, res) => {
  try {
    const forecasts = await prisma.financialForecast.findMany({
      where: { user_id: req.userId },
      include: { model: true },
      orderBy: { forecast_date: 'desc' },
    });
    res.json(forecasts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createForecast = async (req, res) => {
  try {
    const {
      forecast_date,
      predicted_balance,
      predicted_expense,
      confidence,
      model_id,
    } = req.body;
    const forecast = await prisma.financialForecast.create({
      data: {
        user_id: req.userId,
        forecast_date: forecast_date ? new Date(forecast_date) : new Date(),
        predicted_balance: parseFloat(predicted_balance),
        predicted_expense: parseFloat(predicted_expense),
        confidence: confidence ? parseFloat(confidence) : null,
        model_id: model_id || null,
      },
    });
    res.status(201).json(forecast);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
