const prisma = require('../config/prisma');
const { chatWithAI } = require('../services/geminiClient');

// Get all chat sessions for logged-in user
exports.getSessions = async (req, res) => {
  try {
    const sessions = await prisma.aiChatSession.findMany({
      where: { user_id: req.userId },
      orderBy: { last_active_at: 'desc' },
    });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new session
exports.createSession = async (req, res) => {
  try {
    const { session_title } = req.body;
    const session = await prisma.aiChatSession.create({
      data: {
        user_id: req.userId,
        session_title: session_title || 'Chat baru',
      },
    });
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Send message in a session
exports.sendMessage = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });

    // Cek session milik user
    const session = await prisma.aiChatSession.findFirst({
      where: { id: sessionId, user_id: req.userId },
    });
    if (!session) return res.status(404).json({ error: 'Session not found' });

    // Simpan pesan user
    const userMsg = await prisma.aiMessage.create({
      data: {
        session_id: sessionId,
        role: 'user',
        content: message,
      },
    });

    // Ambil konteks ringkasan (optional: gabungkan pesan terakhir)
    const context = session.context_summary || '';

    // Panggil AI (Gemini)
    const aiReply = await chatWithAI(message, context);

    // Simpan balasan AI
    const assistantMsg = await prisma.aiMessage.create({
      data: {
        session_id: sessionId,
        role: 'assistant',
        content: aiReply,
        model_used: 'gemini-1.5-flash',
      },
    });

    // Update session (last active, message count, dan ringkasan singkat)
    await prisma.aiChatSession.update({
      where: { id: sessionId },
      data: {
        last_active_at: new Date(),
        message_count: { increment: 2 },
        context_summary: (
          context +
          '\nUser: ' +
          message +
          '\nAI: ' +
          aiReply
        ).slice(-500),
      },
    });

    res.json({ userMessage: userMsg, assistantMessage: assistantMsg });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get messages in a session
exports.getMessages = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const messages = await prisma.aiMessage.findMany({
      where: { session_id: sessionId },
      orderBy: { created_at: 'asc' },
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete session
exports.deleteSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    await prisma.aiChatSession.delete({
      where: { id: sessionId, user_id: req.userId },
    });
    res.json({ message: 'Session deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
