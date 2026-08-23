import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  app.use(express.json());

  app.post('/api/parse-clipboard', async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: 'No text provided' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is required' });
      }

      const ai = new GoogleGenAI({ 
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      const schema = {
        type: Type.OBJECT,
        properties: {
          customerName: { type: Type.STRING, description: "Full name of the customer, leave empty string if not found" },
          customerPhone: { type: Type.STRING, description: "Phone number of the customer in English digits, without +88 or spaces, exactly 11 digits if Bangladeshi" },
          customerAddress: { type: Type.STRING, description: "Full delivery address" },
          trafficSource: { type: Type.STRING, description: "Where the customer came from, e.g., 'Messenger', 'WhatsApp', 'Instagram', 'Direct Call'" },
          fabric: { type: Type.STRING, description: "Fabric material like Velvet, PU Leather, Jute, etc." },
          productCategory: { type: Type.STRING, description: "Type of furniture: Sofa, Bed, Divan, Wardrobe, Dining, Table, Chair, Mattress" },
          seatConfig: { type: Type.STRING, description: "Configuration of seating: '1-Seater', '2-Seater', '3-Seater', 'L-Shape' or custom like '3+1' from Bengali 'সোফা: ৩+১'" },
          fulfillmentMethod: { type: Type.STRING, description: "Courier/Delivery method: 'Steadfast Courier', 'RedX Delivery', 'Pathao', 'Pickup', 'Home Delivery'" },
          saleAmount: { type: Type.INTEGER, description: "Total price/sale amount as an integer number in English digits" },
          deliveryCharge: { type: Type.INTEGER, description: "Delivery charge as integer in English digits, 0 if not found" },
          urgent: { type: Type.BOOLEAN, description: "True if the user requests urgent, ASAP, emergency, or fast delivery" },
          notes: { type: Type.STRING, description: "Any advance paid (e.g., 'Advance Paid: 1000 Tk') or 'URGENT ORDER' notes, or other important notes" },
          cnNumber: { type: Type.STRING, description: "Consignment or courier ID" },
          invoiceNumber: { type: Type.STRING, description: "Invoice or bill number" },
          extraDetails: { type: Type.STRING, description: "Comma separated details like 'Design: RH-336, Color: Blue, Size: 6x7 feet'" },
          factoryTag: { type: Type.STRING, description: "Any specific factory tags or names" },
        }
      };

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Parse the following unstructured order chat/text and extract the details. Do your best to map Bengali numerals to English, correctly extract partial multi-line addresses, and figure out the product category, fabric, color, design code and size. Combine color, size, and design code into extraDetails (e.g. 'Design: RH-336, Color: Blue, Size: 6x7'). If advance is paid, mention it in notes. If urgent, set urgent to true. If the text mentions 'SFC' or 'steadfast', set fulfillmentMethod to 'Steadfast Courier'.\n\nText:\n${text}`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: schema,
          temperature: 0.1
        }
      });

      const parsedData = JSON.parse(response.text.trim());
      res.json(parsedData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to parse text' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
