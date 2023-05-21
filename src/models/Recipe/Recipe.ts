import { RecipeStats } from "./RecipeStats";
import { RecipeStep } from "./RecipeStep";

export interface Recipe
{
    name: string;
    ingredients: string[];
    steps: RecipeStep[];
    stats: RecipeStats;
}