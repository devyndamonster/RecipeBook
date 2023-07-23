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

export const updateCellContent = async (fileId: string, accessToken: string, stringValue: string, columnIndex: number, rowIndex: number): Promise<any> =>{

    const row = [
        {
            userEnteredValue:{
                stringValue: stringValue
            }
        }
    ]

    let response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${fileId}:batchUpdate`,{
        method: "POST",
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            requests: [
                {
                    updateCells: {
                        fields: "*",
                        rows: [
                            {
                                values: row
                            }
                        ],
                        start: {
                            columnIndex: columnIndex,
                            rowIndex: rowIndex
                        }
                    }
                }
            ]
        })
    });

    const blob = await response.blob();
    const result = JSON.parse(await blob.text());

    return result;
}

export const getCellContent = async (fileId: string, accessToken: string, range: string): Promise<any[][]> =>{

    let response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${fileId}/values/${range}`,{
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    });

    const blob = await response.blob();
    const result = JSON.parse(await blob.text());

    return result.values;
}