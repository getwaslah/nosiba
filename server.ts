import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  app.use(express.json());

  // API route for AI Dental Assistant
  app.post("/api/ai/dental-assistant", async (req, res) => {
    try {
      const { prompt, contextType } = req.body;
      
      let systemInstruction = `أنت مساعد طبي ذكي متخصص في عيادة الأسنان للدكتورة نسيبة ياسر العريقي (في جامعة السعيد). 
العيادة تقدم خدمات:
1. فحص شامل للفم والأسنان - أطقم كاملة وجزئية
2. تركيبات (تيجان وجسور) - حشوات فضية وتجميلية
3. خلع الأسنان وبقايا الجذور - معالجة أمراض اللثة
4. تنظيف الأسنان وإزالة الجير - سحب عصب

قم بمساعدة الطبيبة في صياغة خطط العلاج، الملاحظات السريرية، نصائح المرضى، أو تذكيرات المواعيد بأسلوب احترافي طبي دقيق باللغة العربية.`;

      let fullPrompt = prompt;
      if (contextType === 'treatment_plan') {
        fullPrompt = `اقترح خطة علاجية مفترضة للحالة التالية: ${prompt}`;
      } else if (contextType === 'patient_advice') {
        fullPrompt = `اكتب نصائح طبية لإرشادات ما بعد العلاج لـ: ${prompt}`;
      } else if (contextType === 'clinical_notes') {
        fullPrompt = `ساعدني في صياغة ملاحظات عيادة طبية احترافية لـ: ${prompt}`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: fullPrompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ result: response.text || "عذراً، لم أتمكن من توليد الإجابة. يرجى المحاولة مرة أخرى." });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "خطأ في الاتصال بالذكاء الاصطناعي" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

startServer();
