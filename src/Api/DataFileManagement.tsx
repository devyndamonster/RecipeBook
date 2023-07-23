import { DataFile } from "../Models/Data/DataFile";
import { RequiredDataFile } from "../Models/Data/RequiredDataFile";
import { createFile, listFiles } from "./GoogleDriveClient";

const requiredDataFiles: RequiredDataFile[] = [
    {
        name: "RecipeBook",
        mimeType: "application/vnd.google-apps.folder",
        parents: []
    },
    {
        name: "RecipeBook.RecipeSheet",
        mimeType: "application/vnd.google-apps.spreadsheet",
        parents: ["RecipeBook"]
    }
];

export const loadFilesFromGoogle = async (accessToken: string): Promise<DataFile[]> => {
    const loadedFiles = await listFiles(accessToken);

    for(let fileIndex in requiredDataFiles){
        let requiredFile = requiredDataFiles[fileIndex];

        if(loadedFiles.findIndex(file => file.name == requiredFile.name) == -1){
            const parentFiles = loadedFiles.filter(file => 
                requiredFile.parents.findIndex(parentName => parentName == file.name) > -1)
            const parentIds = parentFiles.map(file => file.id);

            const createdFile = await createFile(accessToken, requiredFile.name, requiredFile.mimeType, parentIds);
            loadedFiles.push(createdFile);
        }
    }

    return loadedFiles;
}