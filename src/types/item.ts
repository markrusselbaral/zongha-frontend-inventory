 type ITEM = {
    iName : string,
    iImage : object,
    iImageName : string,
    iCategory : string,
    iCategoryId : number | null 
}
type ITEMDATABASE = {
    id : number | null,
    name : string,
    image : object,
    product_code : string,
    category_id : number,
    deleted_at : string | null,
    updated_at : string | null,
    created_at : string | null,
}

export type {ITEM, ITEMDATABASE};