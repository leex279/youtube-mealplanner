import React from 'react';
import { Check, Share2, Download } from 'lucide-react';
import { ShoppingListItem } from '../../types';

interface ShoppingListProps {
  items: ShoppingListItem[];
  onToggleItem: (id: string) => void;
  onExport: () => void;
  onShare: () => void;
}

export const ShoppingList: React.FC<ShoppingListProps> = ({
  items,
  onToggleItem,
  onExport,
  onShare
}) => {
  const categories = Array.from(new Set(items.map(item => item.category)));

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Shopping List</h2>
        <div className="flex space-x-4">
          <button
            onClick={onShare}
            className="flex items-center px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <Share2 className="h-5 w-5 mr-2" />
            Share
          </button>
          <button
            onClick={onExport}
            className="flex items-center px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <Download className="h-5 w-5 mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {categories.map(category => (
          <div key={category}>
            <h3 className="text-lg font-semibold mb-3">{category}</h3>
            <div className="space-y-2">
              {items
                .filter(item => item.category === category)
                .map(item => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg"
                  >
                    <button
                      onClick={() => onToggleItem(item.id)}
                      className={`w-5 h-5 rounded border flex items-center justify-center
                        ${item.checked
                          ? 'bg-indigo-600 border-indigo-600'
                          : 'border-gray-300'
                        }`}
                    >
                      {item.checked && <Check className="h-4 w-4 text-white" />}
                    </button>
                    <span className={item.checked ? 'line-through text-gray-400' : ''}>
                      {item.amount} {item.unit} {item.name}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
