import { Recipe } from "../Models/Recipe/Recipe";
import { RecipeStep } from "../Models/Recipe/RecipeStep";
import { getDocumentContent } from "./GoogleDocsClient";

export const loadRecipeListingFromId = async (fileId: string): Promise<Recipe[]> => {
    const listingContent = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: fileId,
        range: "A2:D"
    });

    const recipeListing: Recipe[] = listingContent.result.values.map(result => {
        return {
            id: result[0],
            name: result[1],
            stats: {
                estimatedTime: result[2],
                estimatedCalories: result[3]
            },
            ingredients: [],
            steps: []
        }
    });

    return recipeListing;
}

export const loadRecipeDetailsFromDoc = async (fileId: string, accessToken: string): Promise<{ingredients: string[], recipeSteps: RecipeStep[]}> => {
    let documentContent = await getDocumentContent(fileId, accessToken);

    let paragraphLines: string[] = documentContent.body.content
        .filter(content => content.paragraph != undefined)
        .map(content => content.paragraph.elements[0].textRun.content);

    let paragraphSegments: string[][] = [[]];

    paragraphLines.forEach(line => {
        if(line == "\n"){
            paragraphSegments.push([])
        }
        else{
            paragraphSegments[paragraphSegments.length - 1].push(line.replace("\n", ""));
        }
    });

    let ingredientLines = findParagraphStartingWithLine("Ingredients", paragraphSegments);
    let instructionLines = findParagraphStartingWithLine("Instructions", paragraphSegments);

    let ingredients: string[] = [];
    ingredientLines.forEach(line => {
        if(line.startsWith("-")){
            ingredients.push(line.replace("-", ""));
        }
    })

    let recipeSteps: RecipeStep[] = [];
    instructionLines.forEach(line => {
        if(line.startsWith("#")){
            recipeSteps.push({title: line.replace("#", ""), instructions: []});
        }
        else if(line.startsWith("-")){
            recipeSteps[recipeSteps.length - 1].instructions.push(line.replace("-", ""));
        }
    })

    return {ingredients: ingredients, recipeSteps: recipeSteps};
}

const findParagraphStartingWithLine = (firstLine: string, paragraphs: string[][]): string[] => {
    return paragraphs.find(paragraph => paragraph.findIndex(line => line.includes(firstLine)) == 0);
}