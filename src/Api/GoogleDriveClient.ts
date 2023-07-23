import { DataFile } from "../Models/Data/DataFile";

export const updateFileName = async (documentId: string, accessToken: string, newName: string): Promise<void> => {
    
    await fetch(`https://www.googleapis.com/drive/v3/files/${documentId}`,{
        method: "PATCH",
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'name': newName })
    });

    console.log("Updated document name to " + newName);
}

export const listFiles = async (accessToken: string): Promise<DataFile[]> => {

    const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=name contains 'RecipeBook'`,{
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + accessToken,
        }
    });

    const blob = await response.blob();
    const result = JSON.parse(await blob.text());

    console.log("Retrieved drive files");
    console.log(result);

    return result.files.map(file => {
        return {
            name: file.name,
            id: file.id,
            mimeType: file.mimeType
        }
    });
}

export const createFile = async (accessToken: string, fileName: string, mimeType: string, parentIds: string[]): Promise<DataFile> => {

    const response = await fetch(`https://www.googleapis.com/drive/v3/files?fields=id`,{
        method: "POST",
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            name: fileName, 
            mimeType: mimeType, 
            parents: parentIds 
        })
    });

    const blob = await response.blob();
    const result = JSON.parse(await blob.text());

    console.log("Created drive file");
    console.log(result);

    return {
        name: fileName,
        id: result.result.id,
        mimeType: mimeType
    };
}