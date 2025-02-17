# Weekly Meal Planner

A modern web application for meal planning, recipe management, and shopping list organization built with React, TypeScript, and Tailwind CSS.

## 🌟 Features

- **Recipe Management**
  - Store and organize your favorite recipes
  - Import recipes from supported websites (currently Chefkoch.de)
  - Categorize recipes with tags
  - Detailed recipe views with ingredients and instructions

- **Meal Planning**
  - Weekly calendar view for meal planning
  - Drag-and-drop recipe assignment
  - Flexible meal types (breakfast, lunch, dinner)
  - Plan meals for multiple weeks

- **Shopping List**
  - Automatically generate shopping lists from meal plans
  - Organize items by category
  - Check off items while shopping
  - Add custom items to the list

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/weekly-meal-planner.git
cd weekly-meal-planner
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🛠️ Tech Stack

- **Frontend Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: 
  - Headless UI for accessible components
  - Lucide React for icons
- **Routing**: React Router v7
- **State Management**: React Context API
- **Build Tool**: Vite
- **Data Storage**: Local Storage (Future: Supabase integration planned)

## 📁 Project Structure

```
src/
├── components/
│   ├── calendar/       # Calendar-related components
│   ├── layout/         # Layout components
│   ├── modals/         # Modal components
│   ├── recipes/        # Recipe-related components
│   └── shopping/       # Shopping list components
├── context/            # React Context providers
├── data/              # Static data and mock data
├── pages/             # Page components
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## 🔍 Key Features in Detail

### Recipe Import System

The application includes a robust recipe import system that can:
- Parse structured recipe data from supported websites
- Handle various data formats and structures
- Extract ingredients, instructions, and metadata
- Normalize data into the application's format

Example usage:
```typescript
import { importRecipeFromUrl } from './utils/recipeImporter';

const recipe = await importRecipeFromUrl('https://www.chefkoch.de/rezepte/...');
```

### Weekly Calendar

The weekly calendar view provides:
- Visual representation of meal plans
- Interactive meal assignment
- Responsive design for different screen sizes
- Easy navigation between weeks

### Shopping List Management

The shopping list feature includes:
- Automatic item categorization
- Quantity calculation and unit conversion
- Persistent storage of checked items
- Easy addition of custom items

## 🔒 Type Safety

The project uses TypeScript for type safety. Key types include:

```typescript
interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime: number;
  servings: number;
  category: string;
  tags: string[];
  imageUrl: string;
}

interface MealPlan {
  id: string;
  date: string;
  mealType: string;
  recipeId: string;
}
```

## 🧪 Testing

To run tests:
```bash
npm run test
```

## 📦 Building for Production

To create a production build:
```bash
npm run build
```

The built files will be in the `dist` directory.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Future Enhancements

- [ ] Supabase integration for data persistence
- [ ] User authentication and profiles
- [ ] Recipe sharing functionality
- [ ] Mobile application
- [ ] Additional recipe import sources
- [ ] Meal plan templates
- [ ] Nutritional information

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Recipe data structure inspired by Schema.org Recipe schema
- UI design influenced by modern web applications
- Icons provided by Lucide React
- Component architecture based on React best practices

## 🤔 Support

For support, please open an issue in the GitHub repository or contact the maintainers.
