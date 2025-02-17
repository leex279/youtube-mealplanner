import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { MealPlan, Recipe } from '../../types';
import { MealAssignmentModal } from '../modals/MealAssignmentModal';

interface WeeklyCalendarProps {
  mealPlans: MealPlan[];
  recipes: Recipe[];
  onAddMeal: (date: string, mealType: string, recipeId: string) => void;
}

export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  mealPlans,
  recipes,
  onAddMeal
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = ['breakfast', 'lunch', 'dinner'];

  const handleAddClick = (date: string, mealType: string) => {
    setSelectedDate(date);
    setSelectedMealType(mealType);
    setIsModalOpen(true);
  };

  const handleAssignMeal = (recipeId: string) => {
    onAddMeal(selectedDate, selectedMealType, recipeId);
  };

  const getMealPlan = (day: string, mealType: string) => {
    return mealPlans.find(
      plan => plan.date === day && plan.mealType === mealType
    );
  };

  const getRecipeById = (id: string) => {
    return recipes.find(recipe => recipe.id === id);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6 overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-8 gap-4">
            <div className="col-span-1"></div>
            {days.map((day) => (
              <div key={day} className="col-span-1 text-center font-semibold">
                {day}
              </div>
            ))}
            
            {mealTypes.map((mealType) => (
              <React.Fragment key={mealType}>
                <div className="col-span-1 font-medium capitalize">{mealType}</div>
                {days.map((day) => {
                  const mealPlan = getMealPlan(day, mealType);
                  const recipe = mealPlan ? getRecipeById(mealPlan.recipeId) : null;

                  return (
                    <div
                      key={`${day}-${mealType}`}
                      className="col-span-1 border rounded-lg p-2 min-h-[100px] bg-gray-50"
                    >
                      {recipe ? (
                        <div className="h-full flex flex-col">
                          <img
                            src={recipe.imageUrl}
                            alt={recipe.name}
                            className="w-full h-16 object-cover rounded"
                          />
                          <p className="mt-2 text-sm font-medium">{recipe.name}</p>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddClick(day, mealType)}
                          className="w-full h-full flex items-center justify-center text-gray-400 hover:text-indigo-600 transition-colors"
                        >
                          <Plus className="h-6 w-6" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <MealAssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAssign={handleAssignMeal}
        recipes={recipes}
        date={selectedDate}
        mealType={selectedMealType}
      />
    </>
  );
};
