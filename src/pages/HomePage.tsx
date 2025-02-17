import React, { useState } from 'react';
import { WeeklyCalendar } from '../components/calendar/WeeklyCalendar';
import { sampleMealPlan, sampleRecipes } from '../data/sampleData';
import { MealPlan } from '../types';

export const HomePage: React.FC = () => {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>(sampleMealPlan);

  const handleAddMeal = (date: string, mealType: string, recipeId: string) => {
    const newMealPlan: MealPlan = {
      id: Date.now().toString(),
      date,
      mealType,
      recipeId
    };
    
    setMealPlans(prev => {
      // Remove any existing meal plan for this date and meal type
      const filtered = prev.filter(plan => 
        !(plan.date === date && plan.mealType === mealType)
      );
      return [...filtered, newMealPlan];
    });
  };

  return (
    <div className="space-y-8">
      <section id="calendar">
        <h2 className="text-2xl font-bold mb-4">Weekly Meal Plan</h2>
        <WeeklyCalendar
          mealPlans={mealPlans}
          recipes={sampleRecipes}
          onAddMeal={handleAddMeal}
        />
      </section>
    </div>
  );
};
