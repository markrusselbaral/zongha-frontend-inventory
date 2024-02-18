import { useState, useRef, useEffect } from 'react';
import { PRODUCT, PRODUCTDATABASE } from '../../types/product';
import {WAREHOUSE} from '../../types/warehouse';
import { ITEMDATABASE } from '../../types/item';
import DefaultLayout from '../../layout/DefaultLayout';
import CategoryLayout from '../../layout/CategoryLayout';
import formatDate from '../../function/FormatDate';
import axios from '../../api/axios';
import ModalProduct from './ModalProduct';
import AnimatedText from '../../components/AnimatedText/AnimatedText';
import { useParams } from 'react-router-dom';
import CountUp from 'react-countup';
import Typewriter from 'typewriter-effect';

import { MdDelete, MdAddShoppingCart, MdOutlineSearchOff, MdOutlineSearch } from "react-icons/md";
import { BiSolidSelectMultiple } from "react-icons/bi";
import { BsDatabaseFillExclamation } from "react-icons/bs";
import { RiEditCircleFill } from "react-icons/ri";
import { IoIosExit } from "react-icons/io";

import { FaBoxesStacked } from "react-icons/fa6";
import { HiArrowDownOnSquareStack } from "react-icons/hi2";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { PAGINATION } from '../../types/pagination';

const productList : PRODUCT[] = [
  {
    id : 1,
    pcode : "BF78S78",
    name : "Beef Steak",
    image: "/image.jpg",
    warehouse: "Warehouse 1",
    date: "02-05-2000 07:00 PM",
    quantity: 90,
    price: 280,
  },
  {
    id : 2,
    pcode : "PK89883d",
    name : "Pork Tinidok",
    image: "/image.jpg",
    warehouse: "Warehouse 1",
    date: "02-05-2000 07:00 PM",
    quantity: 90,
    price: 280,
  },
  {
    id : 3,
    pcode : "BF78S78",
    name : "Beef Steakss",
    image: "/image.jpg",
    warehouse: "Warehouse 1",
    date: "02-05-2000 07:00 PM",
    quantity: 90,
    price: 280,
  },
  {
    id : 4,
    pcode : "BF78S78",
    name : "Beef Steakss",
    image: "/image.jpg",
    warehouse: "Warehouse 1",
    date: "02-05-2000 07:00 PM",
    quantity: 90,
    price: 280,
  },
  {
    id : 5,
    pcode : "BF78S78",
    name : "Beef Steakss",
    image: "/image.jpg",
    warehouse: "Warehouse 1",
    date: "02-05-2000 07:00 PM",
    quantity: 90,
    price: 280,
  },
  {
    id : 6,
    pcode : "BF78S78sd",
    name : "Belly pork",
    image: "/image.jpg",
    warehouse: "Warehouse 2",
    date: "02-05-2000 07:00 PM",
    quantity: 945,
    price: 28023,
  },
]


const ProductList = () => {
  const {id} = useParams();

  const [search, setSearch] = useState<string>('')

  const [isShowCheckbox, setIsShowCheckbox] = useState<boolean>(false)
  const [btnName,setBtnName] = useState<string>('Select')
  const [checkCount, setCheckCount] = useState<number>(0)
  const [arrayCheck, setArrayChecked] = useState([])


  // const checkBoxInput: React.MutableRefObject<HTMLInputElement[]> = useRef<HTMLInputElement[]>([]);

  const checkBoxInput = useRef<HTMLInputElement[]>([]);
  const checkAllInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // checkBoxInput.current = Array.from(document.getElementsByClassName('checkItem')) as HTMLInputElement[];
    checkBoxInput.current = document.getElementsByClassName('checkItem') as unknown as HTMLInputElement[];
    checkAllInput.current = document.getElementById('selectCheck') as HTMLInputElement | null;

    // console.log(checkAllInput.current, checkBoxInput.current)

    Array.from(checkBoxInput.current).forEach(item => {
      item.addEventListener("change", function(){
        updateCheckBoxFunction()
      })
    })
  
    // console.log(checkAllInput.current)
  
    if (checkAllInput.current) {
      checkAllInput.current.addEventListener("change", function() {
        Array.from(checkBoxInput.current).forEach(item => {
          item.checked = checkAllInput.current!.checked;
        });
        updateCheckBoxFunction();
      });
    }
    
    // updateCheckBoxFunction()

  }, [isShowCheckbox === false]);


  const updateCheckBoxFunction = () => {
    let isAllChecked = true
    let countCheck = 0
    let arrayCheck: string[] = []
    Array.from(checkBoxInput.current).forEach(item => {
      if(!item.checked){
        isAllChecked = false;
      }else{
        countCheck +=1
        arrayCheck.push(item.value)
      }
    })
    setArrayChecked(arrayCheck as never[])
    if(countCheck !== 0){
      setBtnName("Delete")
    }else{
      setBtnName("Back")
    }
    setCheckCount(countCheck)
  
    if (checkAllInput.current !== null) {
      checkAllInput.current.checked = isAllChecked;
    }
   }

  const handleCheckBox = (e : React.ChangeEvent<HTMLInputElement>) => {
    // Update the state or perform any other actions when a checkbox is clicked
    // For example, you can update the state based on the checkbox's checked status
    const updatedCheckBoxInput = [...checkBoxInput.current];
    const index = Array.from(checkBoxInput.current).indexOf(e.target);
    updatedCheckBoxInput[index].checked = e.target.checked;
    checkBoxInput.current = updatedCheckBoxInput;
    updateCheckBoxFunction();
  };

  // this code will back all tthe checkbox to unchecked
  const handleSelectDelAll = () => {
    setBtnName("Select")
    setIsShowCheckbox(false)
    setCheckCount(0)
    setArrayChecked([])
    if (checkAllInput.current) {
      checkAllInput.current.checked = false;
    }
    if(checkBoxInput.current){
      Array.from(checkBoxInput.current).forEach(item => {
        item.checked = false;
      });
    }
  }

  // useEffect(() => {
    
  //   handleFetchData()
  //   alert('it change')
  // }, [id])

  // const handleChangeBtnName = () => {
  //   setIsShowCheckbox(!isShowCheckbox)
  //   setBtnName("Back")
  // }

  const handleDeleteAll = async() => {
    console.log(arrayCheck)
    const result = await Swal.fire({
      title : `Do you want to delete All`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete All!"
    })
    if(result.isConfirmed){
      try {
        const response = await axios.delete(`/api/product`, {data : {ids : arrayCheck}})
        console.log(response)
        toast.info(
          `Deleted Successfully`,
          {
            position : toast.POSITION.TOP_RIGHT
          }
          )
          handleFetchData(null,'')
      } catch (error) {
        console.log(error)
        toast.error(
          ` This is error ${error}`,
          {
            position: toast.POSITION.TOP_RIGHT
          }
        )
      }
      handleSelectDelAll()
    }
  }

  const onclickFunction = () => {
    if(btnName === "Back"){
      setBtnName("Select")
      setIsShowCheckbox(!isShowCheckbox)
    }else if(btnName === "Delete"){
      handleDeleteAll()
      // alert( arrayCheck)
      // console.log(arrayCheck)
      // setCheckCount(0)
    }else{
      setIsShowCheckbox(!isShowCheckbox)
      setBtnName("Back")
    }
  }

  // //try 2
  // const handleCheckBox = (e : React.ChangeEvent<HTMLInputElement>) => {
  //   const updatedCheckBoxInput = [...checkBoxInput.current];
  //   const index = Array.from(checkBoxInput.current).indexOf(e.target);
  //   updatedCheckBoxInput[index].checked = e.target.checked;
  //   checkBoxInput.current = updatedCheckBoxInput;
  //   // updateCheckBoxFunction();
  // };

  // //try 1
  // const handleCheckBox = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const updatedCheckBoxInput: HTMLInputElement[] = [...checkBoxInput.current];
  //   const index = updatedCheckBoxInput.findIndex(input => input === e.target);
  //   updatedCheckBoxInput[index].checked = e.target.checked;
  //   checkBoxInput.current = updatedCheckBoxInput;
  //   // updateCheckBoxFunction();
  // };
  
  const [isOpenModal, setIsOpenMpdal] = useState<boolean>(false)
  const [editId, setEditId] = useState<number | null>(null);

  const handleModal = () => {
    console.log(editId)
    if(editId ){
      setEditId(null)
    }
    setIsOpenMpdal(!isOpenModal)
  }

  const [warehouseList, setWarehouseList] = useState<Array<WAREHOUSE>>([])
  // const [warehouseName, setWarehouseLName] = useState<WAREHOUSE>()
  const [itemDataList, setItemDataList] = useState<Array<ITEMDATABASE>>([])

  const handleFetchWarehouseData = async() => {
    try {
      const response = await axios.get('/api/warehouse/warehouses')
      console.log("hhahahahhahahaha",response.data.data)
      setWarehouseList(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  // const handleFindWarehouse = () => {
    // console.log(typeof id)
  //   if(id){
  //     const findWarehouse = warehouseList.find(item => item.id === parseInt(id))
  //     setWarehouseLName(findWarehouse)
  //     console.log(findWarehouse?.name)
  //   }
  // }

     const handleFetchItemData = async() => {
        try {
            const response = await axios.get('api/product/create')
            setItemDataList(response.data.data)
            // console.log("sa itemlist",response.data.data.data)
        } catch (error) {
            console.log(error)
        }
     }

     const [productData, setProductData] = useState<Array<PRODUCTDATABASE>>()
     const [total, setTotal] = useState<number>()
     const [soldOut, setSoldOut] = useState<number>()
     const [quantityTotal, setQuantityTotal] = useState<number>()
     const [perPage, setPerPage] = useState<number>()
     const [productPagination, setItemPagination] = useState<Array<PAGINATION>>([])
     const [isLoading, setIsLoading] = useState<boolean>(false)

     const handleFetchData = async(url : string | null, search : string | null) => {
        try {
          if(id === '0'){
            if(!url){
              setIsLoading(true)
              const response = await axios.get(`/api/product/product/0?search=${search}`)
              setProductData(response.data.data.data)
              setTotal(response.data.data.total)
              setPerPage(response.data.data.per_page)
              setItemPagination(response.data.data.links)
              console.log("this is the product",response.data.soldout)
              setQuantityTotal(response.data.quantity)
              setSoldOut(response.data.soldout)
              setIsLoading(false)
            }else{
              const urlSplit = url.split('/')
              console.log(urlSplit)
              setIsLoading(true)
              const response = await axios.get(`/api/product/product/${urlSplit[urlSplit.length-1]}`)
              setProductData(response.data.data.data)
              setTotal(response.data.data.total)
              setPerPage(response.data.data.per_page)
              setItemPagination(response.data.data.links)
              console.log("this is the product",response.data.data.data)
              setQuantityTotal(response.data.quantity)
              setSoldOut(response.data.soldout)
              setIsLoading(false)
            }
          }else{
            if(!url){
              setIsLoading(true)
              const response = await axios.get(`/api/product/product/${id}?search=${search}`)
              setProductData(response.data.data.data)
              setTotal(response.data.data.total)
              setPerPage(response.data.data.per_page)
              setItemPagination(response.data.data.links)
              console.log("this is the warehouse product",response.data.data.data)
              setQuantityTotal(response.data.quantity)
              setSoldOut(response.data.soldout)
              setIsLoading(false)
            }else{
              const urlSplit = url.split('/')
              console.log(urlSplit)
              setIsLoading(true)
              const response = await axios.get(`/api/product/product/${urlSplit[urlSplit.length-1]}`)
              setProductData(response.data.data.data)
              setTotal(response.data.data.total)
              setPerPage(response.data.data.per_page)
              setItemPagination(response.data.data.links)
              console.log("this is the warehouse product",response.data.data.data)
              setQuantityTotal(response.data.quantity)
              setSoldOut(response.data.soldout)
              setIsLoading(false)
            }
          }
        } catch (error) {
          console.log(error)
        }
     }

    //  const handleCalculationQuantity = () => {
    //   let quantityTotal = 0
    //   productData?.map(item => {
    //       quantityTotal += item.quantity
    //   })
    //   setQuantityTotal(quantityTotal)
    // }
    
  useEffect(() => {
    handleFetchData(null,'')
    handleSelectDelAll()
    handleFetchWarehouseData()
    // handleFindWarehouse()
    handleFetchItemData()
    // handleCalculationQuantity()
  }, [id])

  useEffect(() => {
    handleFetchData(null,'')
    //kinahanglan ang isOpenModal === false para sa checkbox mu reset
  }, [isOpenModal === false])

 



  const handleDelete = async(name : string, id : number) => {
    // alert(`${name} ${id}`)
      const result = await Swal.fire({
        title: `Do you want to delete <h2 class="text-red-500 mt-2">${name}</h2>`,
        text: "You won't be able to revert this!",
        icon: "warning",
          showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
      })
      if(result.isConfirmed){
          try {
            const response = await axios.delete(`/api/product/${id}`)
            console.log(response)
            toast.info(
              `${name} ${response.data.success}`,
              {
                position: toast.POSITION.TOP_RIGHT
              }
            )
            handleFetchData(null,'')
          } catch (error) {
            console.log(error)
            toast.error(
              `${name} Deleted Unsuccessful`,
              {
                position : toast.POSITION.TOP_RIGHT
              }
            )
          }
      }else{
        handleFetchData(null,'')
      }
  }

  return (
    <DefaultLayout>
      {/* <Breadcrumb pageName="Tables" /> */}
      <CategoryLayout>

        <div className={`fixed inset-0 flex justify-center items-center z-[1000] bg-black/10 backdrop-blur-[2px] ${isOpenModal ? 'visible' : 'invisible'} transition-all duration-200 delay-75`} onClick={handleModal}>
          <ModalProduct clickOn={(e) => e.stopPropagation()} isOpenModal={isOpenModal} handleModal={handleModal} editId={editId} productData={productData}  warehouseList={warehouseList} itemDataList={itemDataList} handleFetchData={()=> handleFetchData(null,'')}/>
        </div>

        <div className='subCategory h-fit mb-2 text-white dark:text-black rounded-sm border gap-6 px-6 py-2  flex flex-col  sm:flex-row items-center justify-evenly border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark overflow-x-auto'>
          <div className='h-20 w-full bg-[#2563eb] dark:bg-white rounded-md flex items-center px-2 gap-2'>
              {/* {findWarehouse?.name} */}
              <FaBoxesStacked className="text-[40px]" />
              <div className='flex items-center h-full w-full justify-between pr-6'>
                <h2 className='text-2xl sm:text-xl lg:text-2xl'>Total Product</h2>
                    <h1 className='text-[40px] sm:text-3xl lg:text-[40px] '><CountUp start={0} end={total ? total : 0} duration={2}/></h1>
              </div>
          </div>
          <div className='h-20 w-full bg-[#2563eb] dark:bg-white rounded-md flex items-center px-2 gap-2'>
              {/* {findWarehouse?.name} */}
              <HiArrowDownOnSquareStack className="text-[40px]" />
              <div className='flex items-center h-full w-full justify-between pr-6'>
                <h2 className='text-2xl sm:text-xl lg:text-2xl'>Sold Out</h2>
                <h1 className='text-[40px] sm:text-3xl lg:text-[40px] '><CountUp start={0} end={soldOut ? soldOut : 0} duration={3}/></h1>
              </div>
          </div>
          <div className='h-20 w-full bg-[#2563eb] dark:bg-white rounded-md flex items-center px-2 gap-2'>
              {/* {findWarehouse?.name} */}
              <MdOutlineProductionQuantityLimits className="text-[40px]" />
              <div className='flex items-center h-full w-full justify-between pr-6'>
                <h2 className='text-2xl sm:text-xl lg:text-2xl'>Quantity</h2>

                <h1 className='text-[40px] sm:text-3xl lg:text-[40px] '><CountUp start={0} end={quantityTotal ? quantityTotal : 0} duration={3}/>KG</h1>
              </div>
          </div>
        </div>


          <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className='flex flex-col sm:flex-row items-center gap-5 sm:gap-0 sm:justify-between mb-6'>
              <h4 className=" text-xl font-semibold text-black dark:text-white">
                <AnimatedText name={`Products List`} />
              </h4>
              <div className='flex items-center rounded-md overflow-hidden border-[1px]'>
                <span className='h-8 w-9 flex justify-center items-center text-md bg-blue-600 text-white text-[22px] font-bold'>{search === '' ? <MdOutlineSearch/> : <MdOutlineSearchOff onClick={()=>{setSearch(''); handleFetchData(null,'')}}/>}</span>
                <input type="text" name="" id="" placeholder='Search' className=' w-full text-black font-semibold sm:w-60 md:w-90 h-8 outline-none px-2  shadow-custom placeholder:text-black/60' value={search} onChange={(e) => {setSearch(e.target.value);handleFetchData(null, e.target.value); handleSelectDelAll()}}/>
              </div>
              <div className='font-semibold flex gap-3'>
                <button type="button" className='px-2 bg-blue-600 h-8  rounded-md dark:bg-blue-400 text-white dark:text-black flex justify-center items-center gap-1' onClick={() => {handleModal(); handleSelectDelAll()}}> <MdAddShoppingCart className="text-lg"/> Add</button>
                {/* <button type="button" className='relative px-2 bg-red-600 h-8 rounded-md dark:bg-red-500 text-white dark:text-black flex justify-center items-center gap-1' onClick={() => {onclickFunction()}}>{btnName === 'Select' ? <BiSolidSelectMultiple className="text-lg"/> : btnName === 'Back' ? <IoIosExit className="text-xl"/> : <MdDelete className="text-lg"/>}<h5 className={`absolute top-[-12px] left-2 text-[14px] bg-blue-600 text-white rounded-full h-5 w-5 p-2 animate-bounce flex justify-center items-center ${checkCount === 0 ? "invisible scale-50 opacity-0" : "visible scale-100 opacity-1"} transition-all duration-150 delay-75`}>{checkCount}</h5>{btnName}</button> */}
                <div className='relative group'>
                  <button type="button" disabled={productData?.length === 0 && true} className='relative px-2 bg-red-600 h-8 rounded-md dark:bg-red-500 text-white dark:text-black flex justify-center items-center gap-1' onClick={onclickFunction}>{btnName === 'Select' ? <BiSolidSelectMultiple className="text-lg"/> : btnName === 'Back' ? <IoIosExit className="text-xl"/> : <MdDelete className="text-lg"/>}<h5 className={`absolute top-[-12px] left-2 text-[14px] bg-blue-600 text-white rounded-full h-5 w-5 p-2 animate-bounce flex justify-center items-center ${checkCount === 0 ? "invisible scale-50 opacity-0" : "visible scale-100 opacity-1"} transition-all duration-150 delay-75`}>{checkCount}</h5>{btnName}</button>
                  {productData?.length === 0 ?
                    <span className='absolute hidden group-hover:flex group-hover:justify-center group-hover:items-center -top-7 right-[80%] translate-x-full px-2 w-16  bg-blue-600 rounded-lg text-center text-white text-[10px] before:absolute before:bottom-[-16.5px]  before:right-[40%] before:-translate-y-1/2 before:border-6 before:border-x-transparent before:border-b-transparent before:border-t-blue-600 group-hover:transition-all group-hover:duration-500 group-hover:delay-70'>
                      <Typewriter 
                        options={{
                          strings: [
                            "No Data",
                            "Disabled",
                          ],
                          autoStart: true,
                          loop: true,
                          delay: 200,
                        }}
                       />
                    </span>
                    :
                    null
                  }
                </div>
              </div>
            </div>  

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg py-4 px-2 mb-6 bg-black/20 dark:bg-white/20">
                <table className="w-full text-sm text-left rtl:text-right">
                    <thead className="text-xs font-semibold text-gray-700 uppercase bg-blue-600 dark:bg-blue-400 text-white dark:text-black ">
                        <tr>
                            <th scope="col" className={`p-4 ${isShowCheckbox ? "flex" : "hidden"}`} >
                                <div className="flex items-center">
                                    <input id="selectCheck" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                    <label htmlFor="selectCheck" className="sr-only">checkbox</label>
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Pcode
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3 hidden lg:flex h-14 items-center ">
                                Warehouse
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Quantity
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Price
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Date
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className= 'text-black font-semibold'>
                    {!isLoading ?
                        (productData?.length !== 0 ? 
                          (productData?.map((item : PRODUCTDATABASE,index : number) => (
                            <tr key={index} className="bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 even:bg-blue-100 even:border-y-[1px] even:border-blue-700">
                                <td className={`w-4 p-4 ${isShowCheckbox ? "flex" : "hidden"}`}>
                                    <div className="flex items-center">
                                        <input id={item.id.toString()} value={item.id} type="checkbox" className="checkItem w-4 h-4 text-blue-600 checked:bg-slate-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" onChange={(e) => {handleCheckBox(e)}}/>
                                        <label htmlFor={item.id.toString()} className="sr-only">checkbox</label>
                                    </div>
                                </td>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {item.product_code}
                                </th>
                                <td className="px-6 py-4">
                                    {item.name}
                                </td>
                                <td className="px-6 py-4 hidden lg:flex items-center whitespace-nowrap">
                                    {item.warehouse.name}
                                </td>
                                <td className="px-6 py-4">
                                    {item.quantity}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    ₱ {item.price}
                                </td>
                                <td className="px-6 py-4">
                                    {formatDate(item.created_at)}
                                </td>
                                <td className="px-2 py-4 flex gap-2">
                                    <button className="font-medium text-white dark:text-black bg-blue-600 dark:bg-blue-400 text-lg h-8 w-8 rounded-lg flex justify-center items-center" onClick={() => {setEditId(item.id); handleModal(); handleSelectDelAll(); setSearch('')}}><RiEditCircleFill/></button>
                                    <button className="font-medium text-white dark:text-black bg-red-600 dark:bg-red-500 text-lg h-8 w-8 rounded-lg flex justify-center items-center" onClick={() => {handleDelete(item.name,item.id); handleSelectDelAll(); setSearch('')}}><MdDelete/></button>
                                </td>
                            </tr>
                          )))
                          :
                          <tr className="bg-white h-14 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 even:bg-blue-100 even:border-y-[1px] even:border-blue-700">
                            <td colSpan={7} className='w-full'> <div className='flex justify-center items-center gap-3'><div className='relative'><img src='/icons8-box-important.gif' alt='nodata' className='h-6 absolute w-6 bottom-[-6px] right-[-6px]'/><BsDatabaseFillExclamation className="text-3xl text-blue-700"/></div>No Data Saved </div></td>
                          </tr> )
                      :
                      <tr className="bg-white h-14 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 even:bg-blue-100 even:border-y-[1px] even:border-blue-700">
                        <td colSpan={7} className='w-full'> <div className='flex justify-center items-center'><img src='/loadingc.svg' alt='loading' className='h-10'/>Data Fetching... </div></td>
                      </tr>
                      }
                      {/* {productData?.map((item : PRODUCTDATABASE,index : number) => (
                        <tr key={index} className="bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 even:bg-blue-100 even:border-y-[1px] even:border-blue-700">
                            <td className={`w-4 p-4 ${isShowCheckbox ? "flex" : "hidden"}`}>
                                <div className="flex items-center">
                                    <input id={item.id.toString()} value={item.id} type="checkbox" className="checkItem w-4 h-4 text-blue-600 checked:bg-slate-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" onChange={(e) => {handleCheckBox(e)}}/>
                                    <label htmlFor={item.id.toString()} className="sr-only">checkbox</label>
                                </div>
                            </td>
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {item.product_code}
                            </th>
                            <td className="px-6 py-4">
                                {item.name}
                            </td>
                            <td className="px-6 py-4 hidden lg:flex items-center whitespace-nowrap">
                                {item.warehouse.name}
                            </td>
                            <td className="px-6 py-4">
                                {item.quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                ₱ {item.price}
                            </td>
                            <td className="px-6 py-4">
                                {formatDate(item.created_at)}
                            </td>
                            <td className="px-2 py-4 flex gap-2">
                                <button className="font-medium text-white dark:text-black bg-blue-600 dark:bg-blue-400 text-lg h-8 w-8 rounded-lg flex justify-center items-center" onClick={() => {setEditId(item.id); handleModal(); handleSelectDelAll(); setSearch('')}}><RiEditCircleFill/></button>
                                <button className="font-medium text-white dark:text-black bg-red-600 dark:bg-red-500 text-lg h-8 w-8 rounded-lg flex justify-center items-center" onClick={() => {handleDelete(item.name,item.id); handleSelectDelAll(); setSearch('')}}><MdDelete/></button>
                            </td>
                        </tr>
                      ))} */}
                    </tbody>
                </table>
                <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4" aria-label="Table navigation">
                    <span className="text-sm font-normal text-black dark:text-white mb-4 md:mb-0 block w-full md:inline md:w-auto">Showing <span className="font-semibold text-gray-900 dark:text-white">1-{perPage}</span> of <span className="font-semibold text-gray-900 dark:text-white">{total}</span></span>
                    <ul className={`inline-flex -space-x-px rtl:space-x-reverse text-sm h-8 ${total! <= 10 ? "invisible" : "visible"}`}>
                    {productPagination.map((item : PAGINATION, index : number) => (
                          <li key={index} className={`${item.active ? 'bg-cyan-600 text-white' : null} flex items-center justify-center font-semibold px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-blue-600 hover:bg-blue-900 hover:text-white dark:hover:bg-blue-900 dark:hover:text-white  dark:border-gray-700 dark:text-gray-400  cursor-pointer ${index === 0 ? 'first:rounded-l-xl' : ''} ${index === productPagination.length - 1 ? 'last:rounded-r-xl' : ''} transition-all duration-200 delay-75`} dangerouslySetInnerHTML={{__html: item.label}} onClick={() => { handleFetchData(item.url, ''); handleSelectDelAll()}}/>
                        ))}
                    </ul>
                </nav>
            </div>


          </div>
      </CategoryLayout>
    </DefaultLayout>
  );
};

export default ProductList;
