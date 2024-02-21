type PRICINGCLIENT = {
    id : number,
    name: string
}

type PRICINGPRODUCT = {
    item: PRICINGCLIENT,
    item_id : number,
    name: string,
    product_id : number
}

type PRICINGADD = {
    item_id : number | null,
    item_name : string,
    name: string,
    client_id : number | null,
    client_name : string,
    product_id : number | null,
    price : number | null
}

type PRICINGDATABASE = {
    client_id : number,
    client_name : string,
    id : number,
    price : number,
    product_id : number,
    product_name : string,
    tin_name : string,
    tin_number : string,
    type: string,
    warehouse_name : string,
    updated_at : string,
}

export type {PRICINGCLIENT, PRICINGPRODUCT, PRICINGADD, PRICINGDATABASE}