const prisma = require('../config/prisma');

exports.getGoals = async (req, res) => {
  try {
    const goals = await prisma.financialGoal.findMany({
      where: { user_id: req.userId },
      orderBy: { deadline: 'asc' },
    });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createGoal = async (req, res) => {
  try {
    const { goal_name, target_amount, current_amount, deadline } = req.body;
    const goal = await prisma.financialGoal.create({
      data: {
        user_id: req.userId,
        goal_name,
        target_amount: parseFloat(target_amount),
        current_amount: current_amount ? parseFloat(current_amount) : 0,
        deadline: new Date(deadline),
      },
    });
    res.status(201).json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const { current_amount, status } = req.body;
    const goal = await prisma.financialGoal.update({
      where: { id, user_id: req.userId },
      data: {
        current_amount:
          current_amount !== undefined ? parseFloat(current_amount) : undefined,
        status: status || undefined,
      },
    });
    res.json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    await prisma.financialGoal.delete({
      where: { id: req.params.id, user_id: req.userId },
    });
    res.json({ message: 'Goal deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
