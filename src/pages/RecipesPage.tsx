import React, { useState } from 'react';
import { Import } from 'lucide-react';
import { RecipeCard } from '../components/recipes/RecipeCard';
import { RecipeDetailModal } from '../components/modals/RecipeDetailModal';
import { RecipeImportModal } from '../components/modals/RecipeImportModal';
import { sampleRecipes } from '../data/sampleData';
import { Recipe } from '../types';
import { importRecipeFromUrl } from '../utils/recipeImporter';

export const RecipesPage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>(sampleRecipes);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleImport = async (url: string) => {
    try {
      const importedRecipe = await importRecipeFromUrl(url);
      setRecipes(prev => [...prev, importedRecipe]);
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Recipes</h2>
        <button
          onClick={() => setIsImportModalOpen(true)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Import className="w-4 h-4 mr-2" />
          Import Recipe
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map(recipe => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onClick={handleRecipeClick}
          />
        ))}
      </div>

      <RecipeDetailModal
        recipe={selectedRecipe}
        isOpen={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
      />

      <RecipeImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
      />
    </div>
  );
};
