
export const getDocumentContent = async (documentId: string, accessToken: string): Promise<any> =>{
    let response = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}`,{
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    });

    const blob = await response.blob();
    const result = JSON.parse(await blob.text());

    console.log("Retrived document content");
    console.log(result);

    return result;
}

export const clearDocumentContent = async (documentId: string, accessToken: string): Promise<void> => {
    let content = await getDocumentContent(documentId, accessToken);
    const request = {
        'deleteContentRange': {
            'range': {
                'startIndex': 1,
                'endIndex': Math.max(...(content.body.content.map(c => c.endIndex))) - 1
            }
        }
    }

    await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`,{
        method: "POST",
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'requests': [request] })
    });

    console.log("Cleared document content");
}

export const insertDocumentContent = async (documentId: string, accessToken: string, lines: string[]): Promise<void> => {
    const requests = lines.map(t => ({
        'insertText': {
            'location': {
                'index': 1,
            },
            'text': t + '\n'
        }
    }))

    await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`,{
        method: "POST",
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'requests': requests.reverse() })
    });

    console.log("Inserted document content");
    console.log(requests);
}
