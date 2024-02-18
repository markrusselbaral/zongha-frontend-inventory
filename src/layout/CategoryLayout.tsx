import React, { ReactNode, useEffect, useState} from 'react';
import {WAREHOUSE} from '../types/warehouse';
import { NavLink, useParams } from 'react-router-dom';
import CountUp from 'react-countup';

import AnimatedText from '../components/AnimatedText/AnimatedText';
import handleCapitalize from '../components/TextCapitalize/TextCapitalize';
import axios from '../api/axios';

// import { FaBoxesStacked } from "react-icons/fa6";
// import { HiArrowDownOnSquareStack } from "react-icons/hi2";
// import { MdOutlineProductionQuantityLimits } from "react-icons/md";
// import { PRODUCTDATABASE } from '../types/product';


const CategoryLayout: React.FC<{ children: ReactNode }> = ({ children }) => {

  
  const {id} = useParams()
    const categoryId = id ? parseInt(id) : undefined;
  
  // const [active, setActive] = useState<number>(1);

  // const handleActive = (id : number) =>{
  //   setActive(id)
  //   console.log(id)
  // }

  const [warehouseList, setWarehouseList] = useState<Array<WAREHOUSE>>([])
  const [findWarehouse, setFindWarehouse] = useState<WAREHOUSE>()

  const handleFetchData = async() => {
    try {
      const response = await axios.get('/api/warehouse/warehouses')
      console.log("lkashfffhgdghkvjjsd",response.data.data)
      setWarehouseList(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleFindWarehouse = () => {
    const findWarehouse = warehouseList.find(item => item.id.toString() === id)
    // console.log(findWarehouse)
    setFindWarehouse(findWarehouse)
  }

    //  const [total, setTotal] = useState<number>()
    //  const [quantityTotal, setQuantityTotal] = useState<number>()
    //  const [productData, setProductData] = useState<Array<PRODUCTDATABASE>>()

    //  const handleFetchDataTotal = async() => {
    //     try {
    //       if(id === '0'){
    //           const response = await axios.get('/api/product/warehouse/0')
    //           setTotal(response.data.data.total)
    //           setProductData(response.data.data.data)
    //           console.log("this is the product",response.data.data.total)
    //       }else{
    //           const response = await axios.get(`/api/product/warehouse/${id}`)
    //           setTotal(response.data.data.total)
    //           setProductData(response.data.data.data)
    //           console.log("this is the warehouse product",response.data.data.total)
    //       }
    //     } catch (error) {
    //       console.log(error)
    //     }
    //  }

    // const handleCalculationQuantity = () => {
    //   let quantityTotal = 0
    //   productData?.map(item => {
    //       quantityTotal += item.quantity
    //   })
    //   setQuantityTotal(quantityTotal)
    // }

  useEffect(() => {
    handleFetchData()
    // handleFetchDataTotal()
    handleFindWarehouse()
    // handleCalculationQuantity()
    // console.log(handleCapitalize('anthony balaquit oppus'))
  }, [id])

  // const handleCapitalize = (str : string) => {
  //   const text = str.split(' ')
  //   text.forEach((item, index) => {
  //     console.log(item)
  //     return text[index] = `${item.charAt(0).toUpperCase()}${item.slice(1).toLowerCase()}`
  //   })
  //   return text.join(' ')
  // }

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className='subCategory h-14 mb-2  rounded-sm border gap-3 px-4 flex items-center border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark overflow-x-auto'>
      {/* <NavLink to={`/table/0`} type='button' className={`${categoryId === 0 ? 'bg-blue-700 dark:bg-blue-500' : ''} px-6 py-1 text-[12px] font-semibold text-white dark:text-black dark:bg-white bg-boxdark rounded-md`} style={{ whiteSpace: 'nowrap' }} >All</NavLink> */}
      {/* <NavLink to={`/product/0`}  type='button' className={`${categoryId === 0 && 'bg-[#4156f4] dark:bg-[#4156f4] dark:text-white'} px-6 py-1 text-[12px] font-semibold text-white dark:text-black dark:bg-white bg-boxdark rounded-md`} style={{ whiteSpace: 'nowrap' }} ><AnimatedText name={handleCapitalize('All')}/></NavLink> */}
          {warehouseList.map((item : WAREHOUSE,index : number) => (
              <NavLink to={`/product/${item.id}`} key={index} type='button' className={`${categoryId === item.id && 'bg-[#3b468c] dark:bg-[#3b468c] dark:text-white'} px-6 py-1 text-[12px] font-semibold text-white dark:text-black dark:bg-white bg-boxdark rounded-md`} style={{ whiteSpace: 'nowrap' }} ><AnimatedText name={handleCapitalize(item.name)}/></NavLink>
          ))}
      </div>

      {/* <div className='subCategory h-fit mb-2 text-white dark:text-black rounded-sm border gap-6 px-6 py-2  flex flex-col  sm:flex-row items-center justify-evenly border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark overflow-x-auto'>
        <div className='h-20 w-full bg-[#2563eb] dark:bg-white rounded-md flex items-center px-2 gap-2'>
            <FaBoxesStacked className="text-[40px]" />
            <div className='flex items-center h-full w-full justify-between pr-6'>
              <h2 className='text-2xl sm:text-xl lg:text-2xl'>Total Product</h2>
                  <h1 className='text-[40px] sm:text-3xl lg:text-[40px] '><CountUp start={0} end={total ? total : 0} duration={2}/></h1>
            </div>
        </div>
        <div className='h-20 w-full bg-[#2563eb] dark:bg-white rounded-md flex items-center px-2 gap-2'>
            <HiArrowDownOnSquareStack className="text-[40px]" />
            <div className='flex items-center h-full w-full justify-between pr-6'>
              <h2 className='text-2xl sm:text-xl lg:text-2xl'>Sold Out</h2>
              <h1 className='text-[40px] sm:text-3xl lg:text-[40px] '><CountUp start={0} end={1000} duration={3}/></h1>
            </div>
        </div>
        <div className='h-20 w-full bg-[#2563eb] dark:bg-white rounded-md flex items-center px-2 gap-2'>
            <MdOutlineProductionQuantityLimits className="text-[40px]" />
            <div className='flex items-center h-full w-full justify-between pr-6'>
              <h2 className='text-2xl sm:text-xl lg:text-2xl'>Quantity</h2>

              <h1 className='text-[40px] sm:text-3xl lg:text-[40px] '><CountUp start={0} end={quantityTotal ? quantityTotal : 0} duration={3}/>KG</h1>
            </div>
        </div>
      </div> */}

      <div className="flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default CategoryLayout;
