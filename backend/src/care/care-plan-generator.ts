import { Injectable } from '@nestjs/common';

interface MealPlan {
  breakfast: { name: string; description: string };
  lunch: { name: string; description: string };
  dinner: { name: string; description: string };
  snacks: string[];
}

interface DailyCarePlan {
  meals: MealPlan;
  exerciseMinutes: number;
  exerciseType: string;
  hydrationGlasses: number;
  sleepTip: string;
  wellnessTip: string;
  safetyNote: string;
}

interface WeeklyInventory {
  proteins: { item: string; quantity: string }[];
  vegetables: { item: string; quantity: string }[];
  fruits: { item: string; quantity: string }[];
  dairy: { item: string; quantity: string }[];
  grains: { item: string; quantity: string }[];
}

interface MonthlyStaples {
  ironRich: string[];
  calciumSources: string[];
  omega3: string[];
  folate: string[];
}

@Injectable()
export class CarePlanGenerator {
  // Meal plans organized by diet preference
  private mealPlans: Record<string, MealPlan[]> = {
    'non-veg': [
      {
        breakfast: { name: 'Oatmeal with Berries', description: 'Warm oatmeal topped with fresh berries and a drizzle of honey' },
        lunch: { name: 'Grilled Salmon Salad', description: 'Salmon rich in omega-3 with mixed greens and avocado' },
        dinner: { name: 'Chicken Stir-fry', description: 'Lean chicken with colorful vegetables and brown rice' },
        snacks: ['Greek yogurt with nuts', 'Apple slices with almond butter', 'Whole grain crackers with cheese'],
      },
      {
        breakfast: { name: 'Scrambled Eggs with Toast', description: 'Protein-packed eggs with whole wheat toast and spinach' },
        lunch: { name: 'Turkey Wrap', description: 'Lean turkey with vegetables in a whole wheat wrap' },
        dinner: { name: 'Baked Fish with Vegetables', description: 'Tilapia with roasted sweet potatoes and broccoli' },
        snacks: ['Cottage cheese with fruit', 'Carrot sticks with hummus', 'Trail mix'],
      },
      {
        breakfast: { name: 'Banana Pancakes', description: 'Whole grain pancakes with banana and a glass of milk' },
        lunch: { name: 'Chicken Soup', description: 'Homemade chicken soup with vegetables and noodles' },
        dinner: { name: 'Lean Beef with Quinoa', description: 'Iron-rich beef with quinoa and steamed vegetables' },
        snacks: ['Boiled egg', 'Mixed berries', 'Cheese and crackers'],
      },
    ],
    'veg': [
      {
        breakfast: { name: 'Vegetable Upma', description: 'Semolina with mixed vegetables and nuts' },
        lunch: { name: 'Paneer Tikka with Roti', description: 'Grilled paneer with whole wheat roti and salad' },
        dinner: { name: 'Dal Khichdi', description: 'Comforting lentil rice with ghee and vegetables' },
        snacks: ['Fruit chaat', 'Roasted makhana', 'Vegetable sandwich'],
      },
      {
        breakfast: { name: 'Idli with Sambar', description: 'Steamed rice cakes with lentil soup' },
        lunch: { name: 'Chole with Brown Rice', description: 'Chickpea curry with brown rice' },
        dinner: { name: 'Vegetable Pulao', description: 'Fragrant rice with mixed vegetables and raita' },
        snacks: ['Lassi', 'Sprouts salad', 'Dates and nuts'],
      },
      {
        breakfast: { name: 'Poha with Peanuts', description: 'Flattened rice with vegetables and peanuts' },
        lunch: { name: 'Rajma Chawal', description: 'Kidney bean curry with rice' },
        dinner: { name: 'Palak Paneer with Roti', description: 'Spinach curry with cottage cheese' },
        snacks: ['Buttermilk', 'Fruit smoothie', 'Dhokla'],
      },
    ],
    'vegan': [
      {
        breakfast: { name: 'Chia Pudding', description: 'Overnight chia with almond milk and fresh fruits' },
        lunch: { name: 'Quinoa Buddha Bowl', description: 'Quinoa with roasted vegetables, chickpeas, and tahini' },
        dinner: { name: 'Tofu Stir-fry', description: 'Crispy tofu with vegetables and brown rice' },
        snacks: ['Almond butter on toast', 'Fresh fruits', 'Roasted chickpeas'],
      },
      {
        breakfast: { name: 'Smoothie Bowl', description: 'Thick smoothie with banana, berries, and granola' },
        lunch: { name: 'Lentil Soup with Bread', description: 'Hearty lentil soup with whole grain bread' },
        dinner: { name: 'Vegetable Curry', description: 'Mixed vegetable curry with coconut milk and rice' },
        snacks: ['Hummus with veggies', 'Energy balls', 'Coconut yogurt'],
      },
      {
        breakfast: { name: 'Avocado Toast', description: 'Mashed avocado on whole grain toast with seeds' },
        lunch: { name: 'Falafel Wrap', description: 'Crispy falafel with vegetables and tahini sauce' },
        dinner: { name: 'Black Bean Tacos', description: 'Spiced black beans with salsa and guacamole' },
        snacks: ['Edamame', 'Trail mix', 'Fresh fruit'],
      },
    ],
  };

  // Tips and notes organized by pregnancy month
  private wellnessTips: Record<number, string[]> = {
    1: [
      'Start taking prenatal vitamins with folic acid',
      'Stay hydrated and listen to your body',
      'Get plenty of rest as your body adjusts',
    ],
    2: [
      'Morning sickness is normal - try small, frequent meals',
      'Ginger tea can help with nausea',
      'Keep crackers by your bedside for morning nausea',
    ],
    3: [
      'Your energy may start returning soon',
      'This is a great time to start gentle exercise',
      'Consider starting a pregnancy journal',
    ],
    4: [
      'You might feel baby movements soon',
      'Stay active with walking or swimming',
      'Practice good posture to prevent back pain',
    ],
    5: [
      'Your baby can hear your voice now',
      'Consider prenatal yoga for flexibility',
      'Start thinking about your birth preferences',
    ],
    6: [
      'Practice Kegel exercises daily',
      'Keep skin moisturized to prevent itching',
      'Consider a pregnancy pillow for better sleep',
    ],
    7: [
      'Start preparing the nursery',
      'Take childbirth preparation classes',
      'Practice relaxation and breathing techniques',
    ],
    8: [
      'Monitor baby movements daily',
      'Prepare your hospital bag',
      'Rest as much as possible',
    ],
    9: [
      'Baby is almost here! Stay calm and prepared',
      'Know the signs of labor',
      'Enjoy these final moments of pregnancy',
    ],
  };

  private safetyNotes: Record<number, string[]> = {
    1: [
      'Avoid alcohol and smoking completely',
      'Limit caffeine to 200mg daily',
      'Avoid raw fish and unpasteurized products',
    ],
    2: [
      'Avoid hot tubs and saunas',
      'Be careful with essential oils',
      'Avoid cat litter for toxoplasmosis risk',
    ],
    3: [
      'Wear comfortable, supportive shoes',
      'Avoid standing for long periods',
      'Stay away from harmful chemicals',
    ],
    4: [
      'Avoid sleeping on your back',
      'Use seatbelt properly while driving',
      'Stay hydrated in warm weather',
    ],
    5: [
      'Avoid heavy lifting',
      'Be careful on stairs and uneven surfaces',
      'Keep emergency contacts handy',
    ],
    6: [
      'Monitor for swelling in hands and face',
      'Avoid prolonged sitting or standing',
      'Know the signs of preterm labor',
    ],
    7: [
      'Rest frequently and elevate your feet',
      'Avoid strenuous activities',
      'Stay cool and comfortable',
    ],
    8: [
      'Avoid long car trips',
      'Know when to call your healthcare provider',
      'Avoid stress and get plenty of rest',
    ],
    9: [
      'Know the signs of labor vs false labor',
      'Have your hospital bag ready',
      'Keep your phone charged and nearby',
    ],
  };

  private sleepTips = [
    'Aim for 8-9 hours of sleep. Try sleeping on your left side for better circulation.',
    'Use pillows to support your belly and back while sleeping.',
    'Avoid screens 1 hour before bed for better sleep quality.',
    'Try a warm bath before bed to help you relax.',
    'Keep your bedroom cool and dark for optimal sleep.',
    'Practice deep breathing before sleep to calm your mind.',
    'Limit fluids before bed to reduce nighttime bathroom trips.',
  ];

  private exerciseTypes: Record<number, string[]> = {
    1: ['Gentle walking', 'Light stretching', 'Prenatal yoga basics'],
    2: ['Walking', 'Swimming', 'Light yoga'],
    3: ['Brisk walking', 'Swimming', 'Prenatal yoga'],
    4: ['Walking', 'Swimming', 'Low-impact aerobics'],
    5: ['Walking', 'Prenatal yoga', 'Water aerobics'],
    6: ['Gentle walking', 'Swimming', 'Stretching'],
    7: ['Short walks', 'Prenatal stretches', 'Light yoga'],
    8: ['Gentle walking', 'Breathing exercises', 'Pelvic floor exercises'],
    9: ['Very gentle walking', 'Stretching', 'Relaxation exercises'],
  };

  generateDailyCarePlan(
    pregnancyMonth: number,
    dietPreference: string,
    dayOfWeek: number,
  ): DailyCarePlan {
    const diet = this.mealPlans[dietPreference] || this.mealPlans['non-veg'];
    const mealIndex = dayOfWeek % diet.length;
    const meals = diet[mealIndex];

    const month = Math.min(Math.max(pregnancyMonth, 1), 9);
    const wellnessTipsList = this.wellnessTips[month] || this.wellnessTips[5];
    const safetyNotesList = this.safetyNotes[month] || this.safetyNotes[5];
    const exerciseList = this.exerciseTypes[month] || this.exerciseTypes[5];

    // Reduce exercise time as pregnancy progresses
    const exerciseMinutes = month <= 6 ? 30 : month <= 8 ? 20 : 15;

    return {
      meals,
      exerciseMinutes,
      exerciseType: exerciseList[dayOfWeek % exerciseList.length],
      hydrationGlasses: 8,
      sleepTip: this.sleepTips[dayOfWeek % this.sleepTips.length],
      wellnessTip: wellnessTipsList[dayOfWeek % wellnessTipsList.length],
      safetyNote: safetyNotesList[dayOfWeek % safetyNotesList.length],
    };
  }

  generateWeeklyInventory(dietPreference: string): WeeklyInventory {
    const baseInventory: WeeklyInventory = {
      proteins: [],
      vegetables: [
        { item: 'Spinach', quantity: '2 bunches' },
        { item: 'Broccoli', quantity: '1 lb' },
        { item: 'Carrots', quantity: '1 lb' },
        { item: 'Sweet potatoes', quantity: '4 medium' },
        { item: 'Bell peppers', quantity: '3' },
      ],
      fruits: [
        { item: 'Bananas', quantity: '6' },
        { item: 'Berries (mixed)', quantity: '2 boxes' },
        { item: 'Oranges', quantity: '4' },
        { item: 'Apples', quantity: '4' },
        { item: 'Avocados', quantity: '3' },
      ],
      dairy: [],
      grains: [
        { item: 'Oats', quantity: '1 kg' },
        { item: 'Brown rice', quantity: '1 kg' },
        { item: 'Whole wheat bread', quantity: '1 loaf' },
        { item: 'Quinoa', quantity: '500g' },
      ],
    };

    switch (dietPreference) {
      case 'non-veg':
        baseInventory.proteins = [
          { item: 'Salmon', quantity: '500g' },
          { item: 'Chicken breast', quantity: '1 lb' },
          { item: 'Eggs', quantity: '12' },
          { item: 'Lean beef', quantity: '500g' },
        ];
        baseInventory.dairy = [
          { item: 'Milk', quantity: '2L' },
          { item: 'Greek yogurt', quantity: '500g' },
          { item: 'Cheese', quantity: '200g' },
        ];
        break;
      case 'veg':
        baseInventory.proteins = [
          { item: 'Paneer', quantity: '500g' },
          { item: 'Lentils (mixed)', quantity: '1 kg' },
          { item: 'Chickpeas', quantity: '500g' },
          { item: 'Tofu', quantity: '400g' },
        ];
        baseInventory.dairy = [
          { item: 'Milk', quantity: '2L' },
          { item: 'Yogurt', quantity: '1 kg' },
          { item: 'Ghee', quantity: '200g' },
          { item: 'Buttermilk', quantity: '1L' },
        ];
        break;
      case 'vegan':
        baseInventory.proteins = [
          { item: 'Tofu', quantity: '800g' },
          { item: 'Lentils', quantity: '1 kg' },
          { item: 'Chickpeas', quantity: '500g' },
          { item: 'Black beans', quantity: '500g' },
          { item: 'Tempeh', quantity: '400g' },
        ];
        baseInventory.dairy = [
          { item: 'Almond milk', quantity: '2L' },
          { item: 'Coconut yogurt', quantity: '500g' },
          { item: 'Nutritional yeast', quantity: '100g' },
        ];
        break;
    }

    return baseInventory;
  }

  generateMonthlyStaples(pregnancyMonth: number, dietPreference: string): MonthlyStaples {
    const baseStaples: MonthlyStaples = {
      ironRich: [],
      calciumSources: [],
      omega3: [],
      folate: ['Spinach', 'Lentils', 'Asparagus', 'Broccoli', 'Fortified cereals'],
    };

    switch (dietPreference) {
      case 'non-veg':
        baseStaples.ironRich = ['Red meat', 'Chicken liver', 'Spinach', 'Lentils', 'Fortified cereals'];
        baseStaples.calciumSources = ['Milk', 'Cheese', 'Yogurt', 'Sardines', 'Fortified orange juice'];
        baseStaples.omega3 = ['Salmon', 'Sardines', 'Walnuts', 'Chia seeds', 'Flaxseeds'];
        break;
      case 'veg':
        baseStaples.ironRich = ['Spinach', 'Lentils', 'Chickpeas', 'Fortified cereals', 'Dried fruits'];
        baseStaples.calciumSources = ['Milk', 'Paneer', 'Yogurt', 'Sesame seeds', 'Fortified foods'];
        baseStaples.omega3 = ['Walnuts', 'Chia seeds', 'Flaxseeds', 'Hemp seeds', 'Fortified eggs'];
        break;
      case 'vegan':
        baseStaples.ironRich = ['Spinach', 'Lentils', 'Tofu', 'Fortified cereals', 'Pumpkin seeds'];
        baseStaples.calciumSources = ['Fortified plant milk', 'Tofu', 'Tahini', 'Almonds', 'Fortified orange juice'];
        baseStaples.omega3 = ['Walnuts', 'Chia seeds', 'Flaxseeds', 'Hemp seeds', 'Algae supplements'];
        break;
    }

    // Add month-specific recommendations
    if (pregnancyMonth >= 7) {
      baseStaples.ironRich.push('Iron supplements (as prescribed)');
    }

    return baseStaples;
  }

  getBabySizeComparison(pregnancyMonth: number): { size: string; emoji: string } {
    const sizes: Record<number, { size: string; emoji: string }> = {
      1: { size: 'a poppy seed', emoji: '🌱' },
      2: { size: 'a raspberry', emoji: '🫐' },
      3: { size: 'a lime', emoji: '🍋' },
      4: { size: 'an avocado', emoji: '🥑' },
      5: { size: 'a mango', emoji: '🥭' },
      6: { size: 'an ear of corn', emoji: '🌽' },
      7: { size: 'a coconut', emoji: '🥥' },
      8: { size: 'a pineapple', emoji: '🍍' },
      9: { size: 'a watermelon', emoji: '🍉' },
    };

    return sizes[pregnancyMonth] || sizes[5];
  }

  getPregnancyWeek(pregnancyMonth: number): number {
    return Math.min(pregnancyMonth * 4, 40);
  }
}
