type CellValue = number | string;

export const appendRow = async (fileId: string, accessToken: string, values: CellValue[]): Promise<any> =>{

    const row = values.map(value => {
        if(typeof value === 'number'){
            return {
                userEnteredValue:{
                    numberValue: value
                }
            }
        }
        else{
            return {
                userEnteredValue:{
                    stringValue: value
                }
            }
        }
    })

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
                                values: row
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