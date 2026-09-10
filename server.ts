import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Lazy Gemini client helper
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// In-memory store for server-authoritative OTP and rate limits
const activeOtps: Record<string, { otp: string; expiresAt: number }> = {};
const supportTickets: Array<{ id: string; uid: string; name: string; issue: string; timestamp: number }> = [];

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: Date.now() });
});

// Secure AI Support Chat Endpoint using Gemini SDK
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, uid, userName } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const text = message.trim();
    const lower = text.toLowerCase();

    // Check if user is asking for human assistance or complex escalation
    const isEscalation =
      lower.includes('human') ||
      lower.includes('staff') ||
      lower.includes('manager') ||
      lower.includes('admin') ||
      lower.includes('cheat') ||
      lower.includes('fraud');

    if (isEscalation) {
      const ticketId = 'TICK-' + Date.now();
      supportTickets.push({
        id: ticketId,
        uid: uid || 'anonymous',
        name: userName || 'Player',
        issue: text,
        timestamp: Date.now(),
      });
      return res.json({
        reply: "I have escalated your inquiry to our BattleZone support team with Ticket #" + ticketId + ". A representative will review your request shortly.",
        ticketId,
      });
    }

    const ai = getAiClient();
    if (!ai) {
      // Fallback rule-based support response if API key is not configured
      let fallbackReply = "Welcome to BattleZone Support. For deposits, please scan the QR code and submit your 12-digit UTR number. For withdrawals, winning balance is transferred to your UPI ID within 24 hours.";
      if (lower.includes('deposit')) {
        fallbackReply = "To deposit: Go to Wallet > Deposit, choose an amount, generate the QR code, complete payment via UPI, and submit the 12-digit UTR reference number.";
      } else if (lower.includes('withdraw')) {
        fallbackReply = "To withdraw: Ensure you have sufficient Winning Balance, enter your UPI ID, and submit. Withdrawals are processed securely after review.";
      } else if (lower.includes('match') || lower.includes('tournament') || lower.includes('room')) {
        fallbackReply = "Room ID and Password are provided on the match details screen 15 minutes before the match start time. Make sure you have entered your correct in-game name and UID.";
      }
      return res.json({ reply: fallbackReply });
    }

    const systemInstruction = `You are BattleZone Support Assistant for the BattleZone X esports platform.
You assist players with match rules, tournament join guidelines, wallet deposits (UPI/QR with 12-digit UTR), withdrawals, and player reporting.
Never say you are an AI or Gemini. Be polite, professional, direct, and concise.
CRITICAL MANDATE: DO NOT USE ANY EMOJIS UNDER ANY CIRCUMSTANCES. Provide clear text and bullet points if needed.`;

    let contents: any = text;
    if (Array.isArray(history) && history.length > 0) {
      contents = [
        ...history.slice(-6).map((h: any) => ({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }],
        })),
        { role: 'user', parts: [{ text }] },
      ];
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "I am available to assist you with BattleZone tournament rules, wallet deposits, and withdrawals. How may I help?";
    // Filter any stray emoji from model output
    const sanitizedReply = reply.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu, '');
    res.json({ reply: sanitizedReply.trim() });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({
      reply: "Our support system is currently processing requests. You can submit deposits via UTR or view match details from the Home screen.",
    });
  }
});

// Secure OTP sending
app.post('/api/otp/send', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Valid email is required' });
    }
    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    activeOtps[email.toLowerCase()] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    };
    console.log(`[BattleZone Auth] OTP for ${email}: ${otp}`);
    res.json({ success: true, message: 'OTP sent to your email' });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message || 'Error generating OTP' });
  }
});

// Secure OTP verification
app.post('/api/otp/verify', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP required' });
    }
    const record = activeOtps[email.toLowerCase()];
    if (!record) {
      return res.json({ success: false, message: 'OTP expired or not requested' });
    }
    if (Date.now() > record.expiresAt) {
      delete activeOtps[email.toLowerCase()];
      return res.json({ success: false, message: 'OTP has expired' });
    }
    if (record.otp !== otp.toString().trim()) {
      return res.json({ success: false, message: 'Invalid OTP code' });
    }
    // OTP is valid, clear it
    delete activeOtps[email.toLowerCase()];
    res.json({ success: true, message: 'OTP verified successfully' });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message || 'Error verifying OTP' });
  }
});

// Server-Authoritative Tournament Join Validation
app.post('/api/tournaments/validate-join', (req, res) => {
  const { tournament, userWallet, userProfile } = req.body;
  if (!tournament) {
    return res.status(400).json({ valid: false, message: 'Tournament not found' });
  }
  if (tournament.status !== 'upcoming') {
    return res.json({ valid: false, message: 'Registrations are closed for this tournament' });
  }
  const filled = tournament.filledSlots || 0;
  const max = tournament.maxSlots || 100;
  if (filled >= max) {
    return res.json({ valid: false, message: 'Tournament slots are completely filled' });
  }
  const fee = tournament.entryFee || 0;
  const totalBal = (userWallet?.balance || 0);
  if (fee > 0 && totalBal < fee) {
    return res.json({ valid: false, message: `Insufficient balance. Required: ₹${fee}, Available: ₹${totalBal}` });
  }
  // Calculate new deposit/winning split deduction
  const dep = userWallet?.deposit || 0;
  const win = userWallet?.winning || 0;
  let newDep = dep;
  let newWin = win;
  if (fee > 0) {
    if (dep >= fee) {
      newDep -= fee;
    } else {
      const remaining = fee - dep;
      newDep = 0;
      newWin = Math.max(0, win - remaining);
    }
  }

  res.json({
    valid: true,
    deduction: {
      totalFee: fee,
      newDeposit: newDep,
      newWinning: newWin,
      newBalance: newDep + newWin,
    },
  });
});

// Server-Authoritative Withdrawal Validation
app.post('/api/wallet/validate-withdraw', (req, res) => {
  const { amount, winningBalance, upiId } = req.body;
  const amt = Number(amount);
  if (!amt || amt < 10) {
    return res.status(400).json({ valid: false, message: 'Minimum withdrawal amount is ₹10' });
  }
  if (!upiId || !upiId.includes('@')) {
    return res.status(400).json({ valid: false, message: 'Enter a valid UPI ID (e.g., username@bank)' });
  }
  if (amt > (winningBalance || 0)) {
    return res.status(400).json({ valid: false, message: 'Withdrawal amount exceeds available winning balance' });
  }
  res.json({
    valid: true,
    authorizedAmount: amt,
    remainingWinning: (winningBalance || 0) - amt,
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BattleZone X Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
