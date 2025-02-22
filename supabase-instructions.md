# Supabase Integration Guide for Weekly Meal Planner

## Overview

This guide outlines the steps to integrate Supabase with the Weekly Meal Planner application, replacing all mock data with real database storage and implementing proper authentication.

## Prerequisites

1. Click the "Connect to Supabase" button in the top right to set up your Supabase project
2. Install required dependencies:
   ```json
   {
     "dependencies": {
       "@supabase/supabase-js": "^2.39.0",
       "@supabase/auth-ui-react": "^0.4.7",
       "@supabase/auth-ui-shared": "^0.1.8"
     }
   }
   ```

## Database Schema

### 1. Users Table
The users table is automatically created by Supabase Auth. We'll extend it with additional fields.

```sql
/*
  # Extend users table with additional fields

  1. Changes
    - Add fullName and avatarUrl columns to auth.users
  2. Security
    - Only authenticated users can read their own data
*/

ALTER TABLE auth.users 
ADD COLUMN IF NOT EXISTS full_name text,
ADD COLUMN IF NOT EXISTS avatar_url text;

CREATE POLICY "Users can read own data"
  ON auth.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);
```

### 2. Recipes Table

```sql
/*
  # Create recipes table

  1. New Tables
    - `recipes`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `prep_time` (integer)
      - `servings` (integer)
      - `category` (text)
      - `tags` (text[])
      - `image_url` (text)
      - `user_id` (uuid, foreign key)
      - `created_at` (timestamptz)
  2. Security
    - Enable RLS
    - Users can CRUD their own recipes
    - Public recipes are readable by all users
*/

CREATE TABLE recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  prep_time integer NOT NULL,
  servings integer NOT NULL,
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  image_url text,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  public boolean DEFAULT false
);

ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Policy for reading recipes
CREATE POLICY "Users can read own recipes"
  ON recipes
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR 
    public = true
  );

-- Policy for inserting recipes
CREATE POLICY "Users can insert own recipes"
  ON recipes
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Policy for updating recipes
CREATE POLICY "Users can update own recipes"
  ON recipes
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Policy for deleting recipes
CREATE POLICY "Users can delete own recipes"
  ON recipes
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());
```

### 3. Ingredients Table

```sql
/*
  # Create ingredients table

  1. New Tables
    - `ingredients`
      - `id` (uuid, primary key)
      - `recipe_id` (uuid, foreign key)
      - `name` (text)
      - `amount` (numeric)
      - `unit` (text)
      - `category` (text)
  2. Security
    - Enable RLS
    - Ingredients inherit recipe permissions
*/

CREATE TABLE ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  amount numeric NOT NULL,
  unit text NOT NULL,
  category text NOT NULL
);

ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;

-- Policy for reading ingredients
CREATE POLICY "Users can read recipe ingredients"
  ON ingredients
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM recipes 
      WHERE recipes.id = ingredients.recipe_id 
      AND (recipes.user_id = auth.uid() OR recipes.public = true)
    )
  );

-- Policy for inserting ingredients
CREATE POLICY "Users can insert recipe ingredients"
  ON ingredients
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM recipes 
      WHERE recipes.id = recipe_id 
      AND recipes.user_id = auth.uid()
    )
  );

-- Policy for updating ingredients
CREATE POLICY "Users can update recipe ingredients"
  ON ingredients
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM recipes 
      WHERE recipes.id = recipe_id 
      AND recipes.user_id = auth.uid()
    )
  );

-- Policy for deleting ingredients
CREATE POLICY "Users can delete recipe ingredients"
  ON ingredients
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM recipes 
      WHERE recipes.id = recipe_id 
      AND recipes.user_id = auth.uid()
    )
  );
```

### 4. Instructions Table

```sql
/*
  # Create instructions table

  1. New Tables
    - `instructions`
      - `id` (uuid, primary key)
      - `recipe_id` (uuid, foreign key)
      - `step_number` (integer)
      - `text` (text)
  2. Security
    - Enable RLS
    - Instructions inherit recipe permissions
*/

CREATE TABLE instructions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
  step_number integer NOT NULL,
  text text NOT NULL
);

ALTER TABLE instructions ENABLE ROW LEVEL SECURITY;

-- Similar policies as ingredients table
CREATE POLICY "Users can read recipe instructions"
  ON instructions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM recipes 
      WHERE recipes.id = instructions.recipe_id 
      AND (recipes.user_id = auth.uid() OR recipes.public = true)
    )
  );

CREATE POLICY "Users can insert recipe instructions"
  ON instructions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM recipes 
      WHERE recipes.id = recipe_id 
      AND recipes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update recipe instructions"
  ON instructions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM recipes 
      WHERE recipes.id = recipe_id 
      AND recipes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete recipe instructions"
  ON instructions
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM recipes 
      WHERE recipes.id = recipe_id 
      AND recipes.user_id = auth.uid()
    )
  );
```

### 5. Meal Plans Table

```sql
/*
  # Create meal plans table

  1. New Tables
    - `meal_plans`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `recipe_id` (uuid, foreign key)
      - `date` (date)
      - `meal_type` (text)
  2. Security
    - Enable RLS
    - Users can only access their own meal plans
*/

CREATE TABLE meal_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  meal_type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;

-- Policy for reading meal plans
CREATE POLICY "Users can read own meal plans"
  ON meal_plans
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Policy for inserting meal plans
CREATE POLICY "Users can insert own meal plans"
  ON meal_plans
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Policy for updating meal plans
CREATE POLICY "Users can update own meal plans"
  ON meal_plans
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Policy for deleting meal plans
CREATE POLICY "Users can delete own meal plans"
  ON meal_plans
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());
```

### 6. Shopping Lists Table

```sql
/*
  # Create shopping lists table

  1. New Tables
    - `shopping_lists`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `name` (text)
      - `amount` (numeric)
      - `unit` (text)
      - `category` (text)
      - `checked` (boolean)
  2. Security
    - Enable RLS
    - Users can only access their own shopping lists
*/

CREATE TABLE shopping_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  amount numeric NOT NULL,
  unit text NOT NULL,
  category text NOT NULL,
  checked boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;

-- Policy for reading shopping lists
CREATE POLICY "Users can read own shopping lists"
  ON shopping_lists
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Policy for inserting shopping lists
CREATE POLICY "Users can insert own shopping lists"
  ON shopping_lists
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Policy for updating shopping lists
CREATE POLICY "Users can update own shopping lists"
  ON shopping_lists
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Policy for deleting shopping lists
CREATE POLICY "Users can delete own shopping lists"
  ON shopping_lists
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());
```

## Implementation Steps

### 1. Supabase Client Setup

Create a new file `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

### 2. Authentication Implementation

Update `src/context/AuthContext.tsx`:

1. Replace mock authentication with Supabase Auth
2. Implement sign up, sign in, and sign out functionality
3. Handle auth state changes
4. Provide user profile management

### 3. Data Layer Implementation

Create a new directory `src/services` with the following files:

1. `recipeService.ts` - Handle all recipe-related operations
2. `mealPlanService.ts` - Handle meal plan operations
3. `shoppingListService.ts` - Handle shopping list operations

### 4. Component Updates

Update all components to use the new Supabase services instead of mock data:

1. Replace static data in `HomePage` with real-time meal plan data
2. Update `RecipesPage` to fetch and manage recipes from Supabase
3. Modify `ShoppingListPage` to use the real shopping list data

### 5. Real-time Updates

Implement Supabase real-time subscriptions for:

1. Meal plan changes
2. Shopping list updates
3. Recipe modifications

### 6. Error Handling

Implement proper error handling and loading states:

1. Create error boundary components
2. Add loading indicators
3. Handle network errors and offline states

### 7. Type Safety

Generate and maintain TypeScript types:

1. Use Supabase CLI to generate database types
2. Update existing type definitions
3. Ensure type safety across the application

## Testing

1. Test authentication flows
2. Verify data persistence
3. Check real-time updates
4. Validate error handling
5. Test offline functionality

## Deployment

1. Set up environment variables
2. Configure production Supabase instance
3. Update deployment scripts
4. Test production build

## Security Considerations

1. Implement proper input validation
2. Use prepared statements for all database queries
3. Validate user permissions
4. Handle sensitive data appropriately
5. Implement rate limiting
6. Set up proper CORS configuration

## Performance Optimization

1. Implement data caching
2. Use connection pooling
3. Optimize queries
4. Implement pagination
5. Use proper indexes

## Monitoring and Maintenance

1. Set up error tracking
2. Monitor database performance
3. Track API usage
4. Implement logging
5. Set up alerts for critical issues

## Future Enhancements

1. Implement social authentication
2. Add recipe sharing functionality
3. Create collaborative shopping lists
4. Add meal plan templates
5. Implement advanced search functionality
