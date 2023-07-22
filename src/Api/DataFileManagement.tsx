import { DataFile } from "../Models/Data/DataFile";
import { RequiredDataFile } from "../Models/Data/RequiredDataFile";

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

export const loadFilesFromGoogle = async (): Promise<DataFile[]> => {
    const response = await gapi.client.drive.files.list({
        q: "name contains 'RecipeBook'",
    });

    await gapi.client.drive.files.update({
        fileId: "",
        resource: {
            name: ""
        }
    })

    let loadedFiles: DataFile[] = response.result.files.map(file => {
        return {
            name: file.name,
            id: file.id,
            mimeType: file.mimeType
        }
    });

    for(let fileIndex in requiredDataFiles){
        let requiredFile = requiredDataFiles[fileIndex];

        if(loadedFiles.findIndex(file => file.name == requiredFile.name) == -1){
            const parentFiles = loadedFiles.filter(file => 
                requiredFile.parents.findIndex(parentName => parentName == file.name) > -1)
            const parentIds = parentFiles.map(file => file.id);

            const createdFile = await createFile(requiredFile.name, requiredFile.mimeType, parentIds);
            loadedFiles.push(createdFile);
        }
    }

    return loadedFiles;
}

const createFile = async (fileName: string, mimeType: string, parentIds: string[]): Promise<DataFile> => {
    const response = await gapi.client.drive.files.create({
        resource: {
            name: fileName,
            mimeType: mimeType,
            parents: parentIds
        },
        fields: 'id'
    })

    return {
        name: fileName,
        id: response.result.id,
        mimeType: mimeType
    }
}

