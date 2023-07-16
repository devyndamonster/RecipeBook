export const appendCells = async (fileId: string, accessToken: string): Promise<any> =>{
    let response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${fileId}:batchUpdate`,{
        method: "POST",
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            requests: [
                {
                    appendCells: {
                        fields: "*",
                        rows: [
                            {
                                values: [
                                    {
                                        userEnteredValue: {
                                            stringValue: "test"
                                        }
                                    },
                                    {
                                        userEnteredValue: {
                                            stringValue: "Cool Name"
                                        }
                                    },
                                    {
                                        userEnteredValue: {
                                            stringValue: "Time"
                                        }
                                    },
                                    {
                                        userEnteredValue: {
                                            stringValue: "132"
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                }
            ]
        })
    });

    const blob = await response.blob();
    const result = JSON.parse(await blob.text());

    return result;
}