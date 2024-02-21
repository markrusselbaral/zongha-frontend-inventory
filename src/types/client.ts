type CLIENTDATABASE = {
    id : number,
    name: string,
    tin_name : string,
    tin_number : string,
    type : string,
    created_at : string,
    updated_at : string
}

type CLIENTADD = {
    name : string,
    tin_number : string,
    tin_name : string,
    type: string
}

export type {CLIENTDATABASE, CLIENTADD}