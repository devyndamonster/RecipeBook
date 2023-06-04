import { Recipe } from "../Models/Recipe/Recipe";

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