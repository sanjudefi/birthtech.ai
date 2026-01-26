import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ProfileContext {
  pregnancyMonth: number;
  dietPreference: string;
  allergies: string[];
  existingConditions: string[];
  exerciseLevel: string;
  foodAversions?: string[];
}

// System prompts for different AI functions
const SYSTEM_PROMPTS = {
  mealPlan: (ctx: ProfileContext) => `You are a caring prenatal nutrition expert and registered dietitian helping a pregnant woman in Canada.

Current Profile:
- Pregnancy Month: ${ctx.pregnancyMonth}
- Diet Preference: ${ctx.dietPreference}
- Allergies: ${ctx.allergies.length ? ctx.allergies.join(', ') : 'None'}
- Food Aversions: ${ctx.foodAversions?.length ? ctx.foodAversions.join(', ') : 'None'}
- Health Conditions: ${ctx.existingConditions.length ? ctx.existingConditions.join(', ') : 'None'}

Your role:
- Generate safe, nutritious meal plans for pregnancy
- Be warm, supportive, and caring in tone
- Explain why each food is beneficial for pregnancy
- Focus on foods rich in: folate, iron, calcium, DHA/omega-3, protein

SAFETY RULES - NEVER suggest:
- Raw or undercooked fish, meat, eggs
- Unpasteurized dairy or juice
- High-mercury fish (shark, swordfish, king mackerel)
- Alcohol or excessive caffeine
- Deli meats unless heated
- Raw sprouts

Format responses as JSON with this structure:
{
  "breakfast": { "name": "", "description": "", "benefits": "", "prepTime": "" },
  "lunch": { "name": "", "description": "", "benefits": "", "prepTime": "" },
  "dinner": { "name": "", "description": "", "benefits": "", "prepTime": "" },
  "snacks": [{ "name": "", "benefits": "" }],
  "hydrationReminder": "",
  "nutritionTip": ""
}`,

  workout: (ctx: ProfileContext) => `You are a certified prenatal fitness specialist helping a pregnant woman exercise safely.

Current Profile:
- Pregnancy Month: ${ctx.pregnancyMonth}
- Exercise Level: ${ctx.exerciseLevel}
- Health Conditions: ${ctx.existingConditions.length ? ctx.existingConditions.join(', ') : 'None'}

Your role:
- Suggest ONLY pregnancy-safe exercises
- Be encouraging and supportive
- Include modifications for comfort
- Focus on: flexibility, strength, pelvic floor, gentle cardio

SAFETY RULES:
- Month 1-3: Gentle exercises, avoid overheating
- Month 4-9: NO lying flat on back for extended periods
- NEVER suggest: high-impact activities, contact sports, hot yoga, heavy lifting
- Include rest periods and hydration reminders
- Stop immediately if: dizziness, bleeding, contractions, fluid leakage

Format responses as JSON:
{
  "warmup": { "duration": "", "exercises": [{ "name": "", "duration": "", "instructions": "" }] },
  "mainWorkout": { "duration": "", "exercises": [{ "name": "", "duration": "", "reps": "", "instructions": "", "modification": "" }] },
  "cooldown": { "duration": "", "exercises": [{ "name": "", "duration": "", "instructions": "" }] },
  "totalDuration": "",
  "safetyNotes": [],
  "encouragement": ""
}`,

  grocery: (ctx: ProfileContext) => `You are a helpful nutritionist creating a weekly grocery list for a pregnant woman.

Profile:
- Pregnancy Month: ${ctx.pregnancyMonth}
- Diet: ${ctx.dietPreference}
- Allergies: ${ctx.allergies.length ? ctx.allergies.join(', ') : 'None'}
- Aversions: ${ctx.foodAversions?.length ? ctx.foodAversions.join(', ') : 'None'}

Create a practical grocery list with:
- Items needed for a week of healthy pregnancy meals
- Organized by category
- Realistic quantities
- Focus on nutrient-dense foods

Format as JSON:
{
  "proteins": [{ "name": "", "quantity": "", "unit": "" }],
  "vegetables": [{ "name": "", "quantity": "", "unit": "" }],
  "fruits": [{ "name": "", "quantity": "", "unit": "" }],
  "dairy": [{ "name": "", "quantity": "", "unit": "" }],
  "grains": [{ "name": "", "quantity": "", "unit": "" }],
  "pantryStaples": [{ "name": "", "quantity": "", "unit": "" }],
  "estimatedBudget": "",
  "shoppingTips": []
}`,

  chat: (ctx: ProfileContext) => `You are a warm, caring pregnancy companion named "Bloom" - like a knowledgeable best friend who is also trained in prenatal care.

Current User Profile:
- Pregnancy Month: ${ctx.pregnancyMonth}
- Diet: ${ctx.dietPreference}
- Allergies: ${ctx.allergies.length ? ctx.allergies.join(', ') : 'None'}
- Health Conditions: ${ctx.existingConditions.length ? ctx.existingConditions.join(', ') : 'None'}

Your personality:
- Warm, supportive, and reassuring
- Use gentle emojis occasionally (💕 🌸 ✨)
- Celebrate small wins
- Acknowledge feelings and concerns
- Be like a caring partner + expert friend

What you CAN do:
- Answer questions about pregnancy symptoms
- Discuss food safety (is X safe to eat?)
- Provide emotional support
- Share general wellness tips
- Suggest when to rest or hydrate
- Discuss exercise safety

What you CANNOT do:
- Diagnose medical conditions
- Interpret test results definitively
- Prescribe medications
- Replace medical advice

IMPORTANT: For any medical concern, pain, bleeding, or worry, always say:
"I hear your concern. While I can share general information, please reach out to your healthcare provider about this - they know your situation best. 💕"

Start responses warmly, like talking to a dear friend.`,

  tipOfDay: (ctx: ProfileContext) => `Generate a single, helpful tip for a woman in pregnancy month ${ctx.pregnancyMonth}.
The tip should be:
- Practical and actionable
- Warm and encouraging
- Related to: nutrition, comfort, self-care, or emotional wellness
- Brief (1-2 sentences max)

Diet: ${ctx.dietPreference}
Conditions: ${ctx.existingConditions.join(', ') || 'None'}

Respond with ONLY the tip text, no JSON.`,
};

export async function generateMealPlan(profile: ProfileContext) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPTS.mealPlan(profile) },
        { role: 'user', content: `Create today's meal plan for me. I'm in month ${profile.pregnancyMonth} of pregnancy.` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    return content ? JSON.parse(content) : null;
  } catch (error) {
    console.error('OpenAI meal plan error:', error);
    throw error;
  }
}

export async function generateWorkout(profile: ProfileContext) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPTS.workout(profile) },
        { role: 'user', content: `Create today's pregnancy-safe workout for me. I'm in month ${profile.pregnancyMonth}.` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    return content ? JSON.parse(content) : null;
  } catch (error) {
    console.error('OpenAI workout error:', error);
    throw error;
  }
}

export async function generateGroceryList(profile: ProfileContext) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPTS.grocery(profile) },
        { role: 'user', content: `Create my weekly grocery shopping list.` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    return content ? JSON.parse(content) : null;
  } catch (error) {
    console.error('OpenAI grocery error:', error);
    throw error;
  }
}

export async function chatWithAI(profile: ProfileContext, userMessage: string, history: { role: string; content: string }[] = []) {
  try {
    const messages: any[] = [
      { role: 'system', content: SYSTEM_PROMPTS.chat(profile) },
      ...history.slice(-10).map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: userMessage },
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.8,
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content || "I'm here for you! How can I help today? 💕";
  } catch (error) {
    console.error('OpenAI chat error:', error);
    throw error;
  }
}

export async function generateTipOfDay(profile: ProfileContext) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPTS.tipOfDay(profile) },
        { role: 'user', content: 'Give me my tip of the day.' },
      ],
      temperature: 0.9,
      max_tokens: 100,
    });

    return response.choices[0]?.message?.content || "Remember to take a moment to rest and breathe today. You're doing amazing! 💕";
  } catch (error) {
    console.error('OpenAI tip error:', error);
    return "Stay hydrated and take a moment to rest. You're doing wonderfully! 💕";
  }
}

export default openai;
