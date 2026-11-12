import { supabaseAdmin } from '../config/supabase.js';
import { sendSuccess, sendError } from '../utils/response.js';

// ── Keyword-based intent matching (no OpenAI key required) ────────────────
const intentMap = [
  {
    keywords: ['price', 'cost', 'how much', 'budget', 'rate', 'estimate'],
    response: (ctx) =>
      `Property prices vary by location and type. In ${ctx.city || 'major cities'}, ` +
      `apartments typically range from ₹30L–₹2Cr, villas from ₹80L–₹5Cr, and land from ₹10L/acre. ` +
      `Use our AI Price Estimator on any property page for a precise estimate!`,
  },
  {
    keywords: ['buy', 'purchase', 'how to buy', 'process'],
    response: () =>
      `Buying a property on our platform is simple:\n` +
      `1️⃣  Search & filter properties by location, type, and budget\n` +
      `2️⃣  View details, photos, 360° tours, and nearby facilities\n` +
      `3️⃣  Save favorites and compare properties side by side\n` +
      `4️⃣  Request a visit or virtual meeting with the seller\n` +
      `5️⃣  Complete documentation and payment securely\n\n` +
      `Would you like help finding properties in a specific location?`,
  },
  {
    keywords: ['sell', 'list', 'post', 'upload', 'listing'],
    response: () =>
      `Listing your property is easy!\n` +
      `1️⃣  Register/Login as a Seller or Agent\n` +
      `2️⃣  Go to Dashboard → Add New Property\n` +
      `3️⃣  Upload photos, videos, and documents\n` +
      `4️⃣  Set your price (use our AI estimator for guidance)\n` +
      `5️⃣  Publish and start receiving inquiries!\n\n` +
      `Need help with a specific step?`,
  },
  {
    keywords: ['rent', 'rental', 'lease', 'tenant'],
    response: () =>
      `We have rental properties including apartments, villas, offices, and shops. ` +
      `Filter by "For Rent" on the search page. Rental prices vary — ` +
      `studio apartments start around ₹8,000/month, 2BHK from ₹15,000/month. ` +
      `Would you like me to show you available rentals in a specific city?`,
  },
  {
    keywords: ['virtual tour', '360', 'walkthrough', 'visit online'],
    response: () =>
      `Yes! Our platform supports 360° virtual tours and AI-powered walkthroughs. ` +
      `On any property detail page, click the "Virtual Tour" button to explore ` +
      `the property room by room without physically visiting. ` +
      `You can also request a live virtual meeting with the seller!`,
  },
  {
    keywords: ['document', 'verify', 'legal', 'ownership', 'title deed', 'fraud'],
    response: () =>
      `We take property authenticity seriously! Our platform includes:\n` +
      `✅  Document verification for all listings\n` +
      `✅  AI-based fraud detection\n` +
      `✅  Verified badge on trusted listings\n` +
      `✅  Ownership history checks\n\n` +
      `Always look for the ✅ Verified badge when browsing properties.`,
  },
  {
    keywords: ['nearby', 'school', 'hospital', 'transport', 'facilities', 'location'],
    response: () =>
      `Every property page shows an interactive map with nearby:\n` +
      `🏫 Schools & Colleges  🏥 Hospitals  🛒 Shopping Centers\n` +
      `🚌 Transportation  🏦 Banks  🌳 Parks\n\n` +
      `You can also filter properties by proximity to specific facilities!`,
  },
  {
    keywords: ['contact', 'agent', 'call', 'whatsapp', 'message', 'seller'],
    response: () =>
      `You can contact sellers/agents directly from any property page:\n` +
      `📞 Call or WhatsApp the listed number\n` +
      `💬 Send a secure in-app message\n` +
      `📅 Book a physical or virtual visit\n\n` +
      `All communications are secure and tracked on your dashboard.`,
  },
  {
    keywords: ['compare', 'comparison', 'difference', 'vs', 'versus'],
    response: () =>
      `Use our Compare feature to evaluate up to 3 properties side by side!\n` +
      `Compare price, area, bedrooms, amenities, location, and more.\n` +
      `Click the "Compare" button on any property card to add it to your comparison list.`,
  },
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'namaste'],
    response: () =>
      `Hello! 👋 Welcome to AI Real Estate! I'm your property assistant.\n\n` +
      `I can help you with:\n` +
      `🏠 Finding properties  💰 Price estimates  📋 Listing your property\n` +
      `🔍 Search tips  📄 Legal & documents  📅 Booking visits\n\n` +
      `What are you looking for today?`,
  },
  {
    keywords: ['emi', 'loan', 'home loan', 'mortgage', 'finance'],
    response: () =>
      `Home loans are available through our banking partners!\n` +
      `📊 EMI Calculator: For a ₹50L loan at 8.5% for 20 years → ~₹43,391/month\n` +
      `🏦 Partners: SBI, HDFC, ICICI, Axis Bank and more\n` +
      `📋 Required: Income proof, ID, property documents\n\n` +
      `Would you like to connect with a loan advisor?`,
  },
];

const defaultResponse = () =>
  `I'm not sure I understood that. Here are some things I can help with:\n\n` +
  `• 🏠 Search properties by location, type, budget\n` +
  `• 💰 Get AI price estimates\n` +
  `• 📋 List your property for sale/rent\n` +
  `• 📅 Book a visit or virtual tour\n` +
  `• 📄 Understand legal & documentation\n\n` +
  `Try asking: "How do I buy a property?" or "What are apartments in Mumbai?"`;

// ── POST /chatbot/message ──────────────────────────────────────────────────
export const sendMessage = async (req, res) => {
  try {
    const { message, context = {} } = req.body;
    if (!message) return sendError(res, 'message is required', 400);

    const lower = message.toLowerCase();

    // If OpenAI key is set, use it
    if (process.env.OPENAI_API_KEY) {
      try {
        const { default: OpenAI } = await import('openai');
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                `You are a helpful AI real estate assistant for an Indian property marketplace. ` +
                `You help users buy, sell, rent properties. Keep responses concise and friendly. ` +
                `Always suggest relevant platform features when applicable.`,
            },
            { role: 'user', content: message },
          ],
          max_tokens: 300,
          temperature: 0.7,
        });

        const reply = completion.choices[0].message.content;
        return sendSuccess(res, { reply, source: 'ai' });
      } catch (aiErr) {
        console.warn('OpenAI fallback to keyword mode:', aiErr.message);
      }
    }

    // Keyword matching fallback
    const matched = intentMap.find((intent) =>
      intent.keywords.some((kw) => lower.includes(kw))
    );

    const reply = matched ? matched.response(context) : defaultResponse();
    return sendSuccess(res, { reply, source: 'keyword' });
  } catch (err) {
    console.error('chatbot error:', err);
    return sendError(res, 'Chatbot error', 500);
  }
};

// ── GET /chatbot/suggestions ───────────────────────────────────────────────
export const getSuggestions = async (req, res) => {
  const suggestions = [
    'How do I buy a property?',
    'Show me properties in Mumbai',
    'What is the price of a 2BHK apartment?',
    'How do I list my property for sale?',
    'Tell me about virtual tours',
    'What documents are needed?',
    'How does home loan work?',
    'How to compare properties?',
  ];
  return sendSuccess(res, { suggestions });
};
