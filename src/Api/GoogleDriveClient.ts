export const updateFileName = async (documentId: string, accessToken: string, newName: string): Promise<void> => {
    
    await fetch(`https://www.googleapis.com/drive/v3/files/${documentId}`,{
        method: "PATCH",
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'name': newName })
    });

    console.log("Updated document name");
}