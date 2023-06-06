
export const getDocumentContent = async (documentId: string, accessToken: string): Promise<any> =>{
    let response = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}`,{
        method: "GET",
        headers: {
            Authorization: 'Bearer ' + accessToken
        }
    });

    const blob = await response.blob();
    return JSON.parse(await blob.text());
}
