export const GEMINI_API_KEY = "AIzaSyDs1fYzWNfE4K4PA_WCVFE4YaOmIyD9H9c";

export interface AIAnalysisResponse {
  analysis: string;
  traits: {
    [key: string]: number;
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function analyzePersonality(userResponses: Record<string, string>): Promise<AIAnalysisResponse> {
  try {
    const prompt = `
    أنت محلل للشخصية، قم بتحليل إجابات المستخدم التالية وقدم تقريراً مفصلاً عن شخصيته:
    
    ${Object.entries(userResponses)
      .map(([question, answer]) => `السؤال: ${question}\nالإجابة: ${answer}`)
      .join("\n\n")}
    
    قدم تحليلاً بالعربية يتضمن:
    1. وصف عام للشخصية (3-4 جمل)
    2. قائمة بنقاط القوة (3-5 نقاط)
    3. قائمة بنقاط يمكن تحسينها (3-5 نقاط)
    4. قيّم السمات التالية من 0 إلى 100: الانفتاح، الضمير، الانبساط، القبول، العصابية
    
    قدم النتائج بتنسيق JSON بالشكل التالي:
    {
      "analysis": "التحليل العام هنا",
      "traits": {
        "openness": 70,
        "conscientiousness": 80,
        "extraversion": 60,
        "agreeableness": 75,
        "neuroticism": 45
      }
    }
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("لم نتمكن من الحصول على تحليل من الذكاء الاصطناعي");
    }

    // استخراج النص من استجابة API
    const responseText = data.candidates[0].content.parts[0].text;
    
    // استخراج كائن JSON من النص
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("لم نتمكن من استخراج بيانات JSON من استجابة الذكاء الاصطناعي");
    }
    
    return JSON.parse(jsonMatch[0]) as AIAnalysisResponse;
  } catch (error) {
    console.error("خطأ في تحليل الشخصية:", error);
    return {
      analysis: "حدث خطأ أثناء تحليل الشخصية. يرجى المحاولة مرة أخرى.",
      traits: {
        openness: 50,
        conscientiousness: 50,
        extraversion: 50,
        agreeableness: 50,
        neuroticism: 50,
      },
    };
  }
}

export async function sendChatMessage(messages: ChatMessage[]): Promise<string> {
  try {
    // تجهيز سياق المحادثة للذكاء الاصطناعي
    const systemPrompt = `
      أنت روبوت دردشة متخصص في تحليل الشخصية. مهمتك مساعدة المستخدم في فهم شخصيته من خلال محادثة طبيعية.
      قم بطرح أسئلة عميقة عن سلوكياته وتفضيلاته وطريقة تفكيره.
      احرص على أن تكون أجوبتك لطيفة وغير حكمية ومفيدة.
      يمكنك تقديم تحليل أولي مبني على إجاباته، ثم متابعة الحوار للحصول على مزيد من المعلومات.
      قدم نصائح مفيدة بناءً على المعلومات المتاحة لك.
    `;

    // إنشاء محتوى الرسالة
    const conversationHistory = messages.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));

    // إضافة تعليمات النظام في بداية المحادثة
    conversationHistory.unshift({
      role: 'user',
      parts: [{ text: systemPrompt }]
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: conversationHistory,
        }),
      }
    );

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("لم نتمكن من الحصول على رد من الذكاء الاصطناعي");
    }

    // استخراج النص من استجابة API
    const responseText = data.candidates[0].content.parts[0].text;
    
    return responseText;
  } catch (error) {
    console.error("خطأ في الدردشة:", error);
    return "عذراً، حدث خطأ في التواصل مع الذكاء الاصطناعي. يرجى المحاولة مرة أخرى.";
  }
}
