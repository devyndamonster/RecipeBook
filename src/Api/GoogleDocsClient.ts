
export const getDocumentContent = async (documentId: string, accessToken: string): Promise<any> =>{
    let response = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}`,{
        method: "GET",
        headers: {
            Authorization: 'Bearer ' + accessToken
        }
    });

    console.log(response);

    return response;
}
