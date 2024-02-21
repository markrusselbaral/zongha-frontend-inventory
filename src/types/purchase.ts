type PURCHASEADD = {
    client_id : number | null,
    client_name : string,
    date : string,
    mode_of_payment : string,
    product_name: string,
    price: number | null,
    product_code : string,
    product_id : number | null,
    product_quantity : number | null,
    quantity : number | null,
    status : string,
    tin_name: string,
    tin_number : string,
    total_price : number | null,
    type : string,
    warehouse_id : number | null,
    warehouse_name : string,
}
type PURCHASEDATABASE = {
    client_id : number,
    client_name : string,
    date : string,
    id: number,
    item_id : number,
    mode_of_payment : string,
    name: string,
    price: number,
    product_code : string,
    product_id : number,
    product_quantity : number | null,
    quantity : number,
    status : string,
    tin_name: string,
    tin_number : string,
    total_price : number,
    type : string,
    warehouse_id : number,
    warehouse_name : string,
    created_at : string,
    updated_at : string
}

type PURCHASECLIENT = {
    id : number,
    name: string
}

type PURCHASEPRODUCT = {
    item: PURCHASECLIENT,
    item_id : number,
    name: string,
    product_id : number
}

export type {PURCHASEDATABASE, PURCHASEADD, PURCHASECLIENT, PURCHASEPRODUCT}