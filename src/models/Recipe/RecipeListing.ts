import { RecipeStats } from "./RecipeStats";

export interface Recipe
{
    id: string;
    name: string;
    stats: RecipeStats;
}