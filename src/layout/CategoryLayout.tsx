import React, { ReactNode, useEffect, useState} from 'react';
import { NavLink, useParams } from 'react-router-dom';


const subCaterogy = [
    {
      id: 0,
      name : "All",
      title : "All Data"
    },
    {
      id: 1,
      name : "WH 1",
      title : "All Data"
    },
    {
      id: 2,
      name : "WH 2",
      title : "Warehouse 1"
    },
    {
      id: 3,
      name : "WH 3",
      title : "Warehouse 1"
    },
    {
      id: 4,
      name : "WH 4",
      title : "Warehouse 1"
    },
    {
      id: 5,
      name : "WH 5",
      title : "Warehouse 1"
    },
    {
      id: 6,
      name : "WH 6",
      title : "Warehouse 1"
    },
    {
      id: 7,
      name : "WH 7",
      title : "Warehouse 1"
    },
    {
      id: 8,
      name : "WH 8",
      title : "Warehouse 1"
    },
    {
      id: 9,
      name : "WH 9",
      title : "Warehouse 1"
    },
    {
      id: 10,
      name : "WH 10",
      title : "Warehouse 1"
    },
    {
      id: 11,
      name : "WH 11",
      title : "Warehouse 1"
    },
    {
      id: 12,
      name : "WH 12",
      title : "Warehouse 1"
    },
    {
      id: 13,
      name : "WH 13",
      title : "Warehouse 1"
    },
    {
      id: 14,
      name : "WH 14",
      title : "Warehouse 1"
    }
  ]
  

const CategoryLayout: React.FC<{ children: ReactNode }> = ({ children }) => {

  
  const {id} = useParams()
    const categoryId = id ? parseInt(id) : undefined;
  
  // const [active, setActive] = useState<number>(1);

  // const handleActive = (id : number) =>{
  //   setActive(id)
  //   console.log(id)
  // }

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className='subCategory h-14 mb-2  rounded-sm border gap-3 px-4 flex items-center border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark overflow-x-auto'>
      {/* <NavLink to={`/table/0`} type='button' className={`${categoryId === 0 ? 'bg-blue-700 dark:bg-blue-500' : ''} px-6 py-1 text-[12px] font-semibold text-white dark:text-black dark:bg-white bg-boxdark rounded-md`} style={{ whiteSpace: 'nowrap' }} >All</NavLink> */}
          {subCaterogy.map((item,index) => (
            <NavLink to={`/product/${item.id}`} key={index} type='button' className={`${categoryId === item.id && 'bg-[#4156f4] dark:bg-[#4156f4] dark:text-white'} px-6 py-1 text-[12px] font-semibold text-white dark:text-black dark:bg-white bg-boxdark rounded-md`} style={{ whiteSpace: 'nowrap' }} >{item.name}</NavLink>
          ))}
      </div>

      <div className="flex flex-col gap-10">
        {children}
      </div>
    </div>
  );
};

export default CategoryLayout;
