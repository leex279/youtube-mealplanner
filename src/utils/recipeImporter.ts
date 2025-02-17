import { Recipe, Ingredient } from '../types';

export class RecipeImportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RecipeImportError';
  }
}

interface SchemaRecipe {
  "@type": string;
  name: string;
  description?: string;
  recipeIngredient: string[];
  recipeInstructions: Array<{ text: string } | string> | string;
  prepTime?: string;
  cookTime?: string;
  recipeYield?: string | number;
  image?: string | { url: string };
}

export const importRecipeFromUrl = async (url: string): Promise<Recipe> => {
  try {
    const urlObj = new URL(url);
    
    if (urlObj.hostname === 'www.chefkoch.de') {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      return importFromChefkoch(proxyUrl);
    }

    throw new RecipeImportError('Unsupported website. Currently only supporting chefkoch.de');
  } catch (error) {
    if (error instanceof RecipeImportError) {
      throw error;
    }
    throw new RecipeImportError('Invalid URL format');
  }
};

const importFromChefkoch = async (proxyUrl: string): Promise<Recipe> => {
  try {
    const response = await fetch(proxyUrl);

    if (!response.ok) {
      throw new RecipeImportError(`Failed to fetch recipe: ${response.status} ${response.statusText}`);
    }
    
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const scriptElements = doc.querySelectorAll('script[type="application/ld+json"]');
    let recipeData: any = null;

    for (const script of Array.from(scriptElements)) {
      try {
        const schemaData = JSON.parse(script.textContent || '{}');
        if (Array.isArray(schemaData['@graph'])) {
          recipeData = schemaData['@graph'].find((item: any) => item['@type'] === 'Recipe');
          if (recipeData) break;
        } else if (schemaData['@type'] === 'Recipe') {
          recipeData = schemaData;
          break;
        }
      } catch (e) {
        console.warn('Failed to parse JSON-LD script:', e);
      }
    }

    if (!recipeData) {
      recipeData = await parseChefkochManually(doc);
    }

    // Extract recipe information with safe fallbacks
    const ingredients = parseIngredients(recipeData.recipeIngredient || []);
    const instructions = parseInstructions(recipeData.recipeInstructions);
    const prepTime = parseDuration(recipeData.prepTime || 'PT30M');
    const servings = parseServings(recipeData.recipeYield);
    const imageUrl = parseImage(recipeData.image);

    return {
      id: crypto.randomUUID(),
      name: recipeData.name || 'Unknown Recipe',
      description: recipeData.description || '',
      ingredients,
      instructions,
      prepTime,
      servings,
      category: 'Imported',
      tags: ['imported', 'chefkoch'],
      imageUrl
    };
  } catch (error) {
    console.error('Error importing recipe:', error);
    if (error instanceof RecipeImportError) {
      throw error;
    }
    throw new RecipeImportError('Failed to parse recipe from Chefkoch');
  }
};

const parseChefkochManually = async (doc: Document): Promise<SchemaRecipe> => {
  const name = doc.querySelector('h1')?.textContent?.trim() || 'Unknown Recipe';
  const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  
  const ingredientElements = doc.querySelectorAll('.ingredients tbody tr');
  const recipeIngredient = Array.from(ingredientElements).map(row => {
    const amount = row.querySelector('td:first-child')?.textContent?.trim() || '';
    const ingredient = row.querySelector('td:last-child')?.textContent?.trim() || '';
    return `${amount} ${ingredient}`.trim();
  });

  // Get instructions with better selector coverage
  const instructionsText = doc.querySelector('.recipe-preparation, .recipe-instructions')?.textContent?.trim() || '';
  const recipeInstructions = instructionsText.split(/\n+/).filter(Boolean);

  const image = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
               doc.querySelector('.recipe-image img')?.getAttribute('src');

  return {
    '@type': 'Recipe',
    name,
    description,
    recipeIngredient,
    recipeInstructions,
    image: image || undefined
  };
};

const parseIngredients = (ingredients: string[]): Ingredient[] => {
  if (!Array.isArray(ingredients)) {
    console.warn('Invalid ingredients format, using empty array');
    return [];
  }

  return ingredients.map(ing => {
    const parts = ing.trim().split(/\s+/);
    let amount = 1;
    let unit = 'piece';
    let name = ing;

    if (parts.length >= 2) {
      const possibleAmount = parseFloat(parts[0].replace(',', '.'));
      if (!isNaN(possibleAmount)) {
        amount = possibleAmount;
        unit = parts[1];
        name = parts.slice(2).join(' ');
      }
    }

    return {
      id: crypto.randomUUID(),
      name: name || ing,
      amount,
      unit,
      category: 'Other'
    };
  });
};

const parseInstructions = (instructions: Array<{ text: string } | string> | string | undefined): string[] => {
  try {
    // Handle undefined or null
    if (!instructions) {
      return [];
    }

    // Handle string (single instruction)
    if (typeof instructions === 'string') {
      return instructions.split(/\n+/).filter(Boolean);
    }

    // Handle array of objects or strings
    if (Array.isArray(instructions)) {
      return instructions.map(instruction => {
        if (typeof instruction === 'string') {
          return instruction;
        }
        if (instruction && typeof instruction === 'object' && 'text' in instruction) {
          return instruction.text;
        }
        return '';
      }).filter(Boolean);
    }

    // Handle object with text property
    if (typeof instructions === 'object' && instructions !== null && 'text' in instructions) {
      return [instructions.text].filter(Boolean);
    }

    console.warn('Unhandled instructions format:', instructions);
    return [];
  } catch (error) {
    console.error('Error parsing instructions:', error);
    return [];
  }
};

const parseDuration = (duration: string): number => {
  try {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!match) return 30;
    
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    return hours * 60 + minutes;
  } catch {
    return 30;
  }
};

const parseServings = (servings: string | number | undefined): number => {
  if (typeof servings === 'number') {
    return servings;
  }
  if (typeof servings === 'string') {
    const match = servings.match(/\d+/);
    return match ? parseInt(match[0]) : 4;
  }
  return 4;
};

const parseImage = (image: string | { url: string } | undefined): string => {
  if (!image) {
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800';
  }
  if (typeof image === 'string') {
    return image;
  }
  return image.url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800';
};
