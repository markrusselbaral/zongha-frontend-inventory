type WAREHOUSE = {
    id: number;
    name: string;
    location: string;
  };

  type WAREHOUSEADD = {
    name: string;
    location: string;
  };

type WAREHOUSEDATABASE = {
    id : number | null,
    name : string,
    location : string,
    updated_at : string | null,
    created_at : string | null,
}

export type {WAREHOUSE, WAREHOUSEADD, WAREHOUSEDATABASE};
  