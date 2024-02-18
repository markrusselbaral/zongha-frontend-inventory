import { ITEMDATABASE } from "./item";
import { WAREHOUSEDATABASE } from "./warehouse";

type PRODUCT = {
  id: number;
  pcode: string;
  name: string;
  image: string;
  warehouse: string;
  date : string;
  quantity: number;
  price: number;
};

type PRODUCTADD = {
  pName: string,
  pId: number | null,
  pCode: string,
  pWarehouse : string,
  pWarehouseId: number | null,
  pQuantity : number | null,
  pPrice : number | null,
}

type PRODUCTDATABASE = {
  id: number;
  item_id: number;
  product_code: string;
  // item: string;
  warehouse: WAREHOUSEDATABASE;
  name: string;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
};


export type {PRODUCT, PRODUCTADD, PRODUCTDATABASE}