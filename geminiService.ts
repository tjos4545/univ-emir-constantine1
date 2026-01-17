
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const getLibrarianResponse = async (userPrompt: string) => {
  if (!API_KEY) {
    return "عذراً، نظام الذكاء الاصطناعي غير مفعل حالياً.";
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const systemInstruction = `
    أنت المساعد الذكي لمكتبة جامعة الأمير عبد القادر للعلوم الإسلامية بقسنطينة (الجزائر). 
    مهمتك مساعدة الطلاب والباحثين في العثور على الكتب، الأطروحات، وفهم خدمات المكتبة.
    معلومات عن الجامعة:
    - الموقع الرسمي: www.univ-emir-constantine.edu.dz
    - الجامعة متخصصة في العلوم الإسلامية.
    - تتوفر على مستودع رقمي (DSpace) وفهرس إلكتروني.
    كن مهذباً، دقيقاً، واستخدم اللغة العربية الفصحى.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
        topP: 0.95,
      },
    });

    return response.text || "لم أستطع معالجة طلبك حالياً.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "حدث خطأ أثناء التواصل مع المكتبة الرقمية.";
  }
};
