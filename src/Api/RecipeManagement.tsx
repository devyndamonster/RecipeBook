import { Recipe } from "../Models/Recipe/Recipe";
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

export const loadRecipeDetailsFromDoc = async (fileId: string, accessToken: string): Promise<{ingredients: string[], instructions: string[]}> => {
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

    console.log(paragraphSegments);

    return {ingredients: paragraphSegments[1], instructions: paragraphSegments[2]};
}