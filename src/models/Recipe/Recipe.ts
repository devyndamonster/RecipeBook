import { RecipeStats } from "./RecipeStats";
import { RecipeStep } from "./RecipeStep";

export interface Recipe
{
    id: string;
    name: string;
    ingredients: string[];
    steps: RecipeStep[];
    stats: RecipeStats;
}