import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Clock, Users } from 'lucide-react';
import { Recipe } from '../../types';

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  isOpen,
  onClose,
}) => {
  if (!recipe) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                <div className="relative">
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.name}
                    className="w-full h-64 object-cover"
                  />
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/80 text-gray-800 hover:bg-white"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="p-6">
                  <Dialog.Title className="text-2xl font-bold mb-2">
                    {recipe.name}
                  </Dialog.Title>
                  
                  <p className="text-gray-600 mb-4">{recipe.description}</p>
                  
                  <div className="flex items-center space-x-6 mb-6">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-400 mr-2" />
                      <span>{recipe.prepTime} mins</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-gray-400 mr-2" />
                      <span>{recipe.servings} servings</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
                    <ul className="grid grid-cols-2 gap-2">
                      {recipe.ingredients.map((ingredient) => (
                        <li key={ingredient.id} className="flex items-center">
                          <span className="text-gray-600">
                            {ingredient.amount} {ingredient.unit} {ingredient.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Instructions</h3>
                    <ol className="space-y-2">
                      {recipe.instructions.map((instruction, index) => (
                        <li key={index} className="flex">
                          <span className="font-medium mr-2">{index + 1}.</span>
                          <span className="text-gray-600">{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
