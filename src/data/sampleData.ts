import { Recipe, MealPlan } from '../types';

export const sampleRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Overnight Oats with Berries',
    description: 'Healthy and delicious breakfast option',
    ingredients: [
      { id: '1', name: 'Oats', amount: 1, unit: 'cup', category: 'Grains' },
      { id: '2', name: 'Milk', amount: 1, unit: 'cup', category: 'Dairy' },
      { id: '3', name: 'Mixed Berries', amount: 0.5, unit: 'cup', category: 'Fruits' },
      { id: '4', name: 'Honey', amount: 2, unit: 'tbsp', category: 'Sweeteners' }
    ],
    instructions: [
      'Mix oats and milk in a jar',
      'Add honey and stir well',
      'Add berries and other toppings',
      'Refrigerate overnight'
    ],
    prepTime: 10,
    servings: 1,
    category: 'Breakfast',
    tags: ['healthy', 'vegetarian', 'quick'],
    imageUrl: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800'
  },
  {
    id: '2',
    name: 'Grilled Chicken Salad',
    description: 'Fresh and protein-rich lunch option',
    ingredients: [
      { id: '5', name: 'Chicken Breast', amount: 200, unit: 'g', category: 'Meat' },
      { id: '6', name: 'Mixed Greens', amount: 2, unit: 'cups', category: 'Vegetables' },
      { id: '7', name: 'Cherry Tomatoes', amount: 1, unit: 'cup', category: 'Vegetables' },
      { id: '8', name: 'Olive Oil', amount: 2, unit: 'tbsp', category: 'Oils' }
    ],
    instructions: [
      'Season chicken breast with salt and pepper',
      'Grill chicken until cooked through',
      'Wash and prepare vegetables',
      'Slice chicken and combine with vegetables',
      'Drizzle with olive oil'
    ],
    prepTime: 20,
    servings: 2,
    category: 'Lunch',
    tags: ['healthy', 'protein', 'salad'],
    imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800'
  }
];

export const sampleMealPlan: MealPlan[] = [
  {
    id: '1',
    date: 'Monday',
    mealType: 'breakfast',
    recipeId: '1'
  },
  {
    id: '2',
    date: 'Monday',
    mealType: 'lunch',
    recipeId: '2'
  }
];
