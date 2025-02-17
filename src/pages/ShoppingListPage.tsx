import React, { useState } from 'react';
import { ShoppingList } from '../components/shopping/ShoppingList';
import { sampleRecipes } from '../data/sampleData';
import { ShoppingListItem } from '../types';

// Generate shopping list from recipes
const generateShoppingList = (): ShoppingListItem[] => {
  const items: ShoppingListItem[] = [];
  let id = 1;

  sampleRecipes.forEach(recipe => {
    recipe.ingredients.forEach(ingredient => {
      items.push({
        id: id.toString(),
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
        category: ingredient.category,
        checked: false
      });
      id++;
    });
  });

  return items;
};

export const ShoppingListPage: React.FC = () => {
  const [items, setItems] = useState<ShoppingListItem[]>(generateShoppingList());

  const handleToggleItem = (id: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleExport = () => {
    const exportData = items.map(item => ({
      name: item.name,
      amount: item.amount,
      unit: item.unit,
      category: item.category
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shopping-list.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    if (navigator.share) {
      const shareData = {
        title: 'Shopping List',
        text: items
          .map(item => `${item.amount} ${item.unit} ${item.name}`)
          .join('\n')
      };
      navigator.share(shareData);
    } else {
      alert('Sharing is not supported on this device');
    }
  };

  return (
    <div className="space-y-6">
      <ShoppingList
        items={items}
        onToggleItem={handleToggleItem}
        onExport={handleExport}
        onShare={handleShare}
      />
    </div>
  );
};
