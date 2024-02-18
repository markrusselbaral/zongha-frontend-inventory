import { useState, useRef, useEffect } from 'react';
import axios from '../../api/axios';
import { PAGINATION } from '../../types/pagination';
import { WAREHOUSEDATABASE, WAREHOUSE } from '../../types/warehouse';
import DefaultLayout from '../../layout/DefaultLayout';
import ModalWarehouse from './ModalWarehouse';
import formatDate from '../../function/FormatDate';
import { MdDelete, MdAddShoppingCart, MdOutlineSearchOff, MdOutlineSearch, MdOutlineWarehouse } from "react-icons/md";
import AnimatedText from '../../components/AnimatedText/AnimatedText';
import { BsDatabaseFillExclamation } from "react-icons/bs";
import { BiSolidSelectMultiple } from "react-icons/bi";
import { RiEditCircleFill } from "react-icons/ri";
import { IoIosExit } from "react-icons/io";
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import Typewriter from 'typewriter-effect';


const WarehouseList = () => {

  const [search, setSearch] = useState<string>('')

  const [isShowCheckbox, setIsShowCheckbox] = useState<boolean>(false)
  const [btnName,setBtnName] = useState<string>('Select')
  const [checkCount, setCheckCount] = useState<number>(0)
  const [arrayCheck, setArrayChecked] = useState<Array<number[]>>([])


  const checkBoxInput = useRef<HTMLInputElement[]>([]);
  const checkAllInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // checkBoxInput.current = Array.from(document.getElementsByClassName('checkItem')) as HTMLInputElement[];
    checkBoxInput.current = document.getElementsByClassName('checkItem') as unknown as HTMLInputElement[];
    checkAllInput.current = document.getElementById('selectCheck') as HTMLInputElement | null;


    Array.from(checkBoxInput.current).forEach(item => {
      item.addEventListener("change", function(){
        updateCheckBoxFunction()
      })
    })
  
  
    if (checkAllInput.current) {
      checkAllInput.current.addEventListener("change", function() {
        Array.from(checkBoxInput.current).forEach(item => {
          item.checked = checkAllInput.current!.checked;
        });
        updateCheckBoxFunction();
      });
    }
  
    // updateCheckBoxFunction()
    // setBtnName("Select")
    // // setIsShowCheckbox(false)
    // setCheckCount(0)
    // setArrayChecked([])

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
        const response = await axios.delete(`/api/warehouse`, {data : {ids : arrayCheck}})
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
  
  const [isOpenModal, setIsOpenMpdal] = useState<boolean>(false)
  const [editId, setEditId] = useState<number | null>(null);

  const handleModal = () => {
    console.log(editId)
    if(editId ){
      setEditId(null)
    }
    setIsOpenMpdal(!isOpenModal)
  }

  // const [categoryList, setCategoryList] = useState<Array<CATEGORY>>([])

  //   const getCategory = async() => {
  //       try {
  //           const response = await axios.get('/api/category')
  //           console.log(response.data.categories.data)
  //           setCategoryList(response.data.categories.data)
  //       } catch (error) {
  //           console.log(error)
  //       }
  //   }

  //   useEffect(() => {
  //       getCategory()
  //   },[])

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [wareHouseDataList, setWarehouseDataList] = useState<Array<WAREHOUSEDATABASE>>([])
  const [perPage, setPerPage] = useState<number>()
  const [warehousePagination, setWarehousePagination] = useState<Array<PAGINATION>>([])
  const [total, setTotal] = useState<number>(0)

  const handleFetchData = async(url : string | null, search : string | null) => {
          try {
            if(!url){
              // console.log(search, `/api/item?search=${search}`)
              setIsLoading(true)
              const response = await axios.get(`/api/warehouse?search=${search}`)
              console.log(response)
              setWarehouseDataList(response.data.data.data)
              // console.log("this is the pager",response.data.data.links)
              setWarehousePagination(response.data.data.links)
              // console.log("this is the countperPage",response.data.data.per_page)
              setPerPage(response.data.data.per_page)
              // console.log("this is the total",response.data.data.total)
              setTotal(response.data.data.total)
              setIsLoading(false)
            }else{
              const urlSplit = url.split('/')
              console.log(urlSplit)
              // console.log(`/${urlSplit[urlSplit.length-2]}/${urlSplit[urlSplit.length-1]}?search=${search}`)
              setIsLoading(true)
              const response = await axios.get(`/${urlSplit[urlSplit.length-2]}/${urlSplit[urlSplit.length-1]}`)
              setWarehouseDataList(response.data.data.data)
              console.log("this is the pager",response.data.data.links)
              setWarehousePagination(response.data.data.links)
              console.log("this is the countperPage",response.data.data.per_page)
              setPerPage(response.data.data.per_page)
              console.log("this is the total",response.data.data.total)
              setTotal(response.data.data.total)
              setIsLoading(false)
            }
          } catch (error) {
            toast.error(
              `${error}`,
              {
                position : toast.POSITION.TOP_RIGHT
              }
            )
          }
  }
  useEffect(() => {
    handleFetchData(null,'')
    //kinahanglan ang isOpenModal === false para sa checkbox mu reset
  }, [isOpenModal === false])

  const handleDelete = async(name : string, id :number) => {
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
        const response = await axios.delete(`/api/warehouse/${id}`)
        console.log(response.data.message)
        toast.success(
          ` ${name} ${response.data.message}`,
          {
            position : toast.POSITION.TOP_RIGHT
          }
        )
        handleFetchData(null,'')
      } catch (error) {
        toast.error(
          `${error}`,
          {
            position : toast.POSITION.TOP_RIGHT,
          }
        )
      }
    }else{
      console.log("no")
      setIsShowCheckbox(false)
      handleFetchData(null,'')
    }
  }


  return (
    <DefaultLayout>

        <div className={`fixed inset-0 flex justify-center items-center z-[1000] bg-black/10 backdrop-blur-[2px] ${isOpenModal ? 'visible' : 'invisible'} transition-all duration-200 delay-75`} onClick={handleModal}>
          <ModalWarehouse clickOn={(e) => e.stopPropagation()} isOpenModal={isOpenModal} handleModal={handleModal} editId={editId} wareHouseDataList={wareHouseDataList} /*categoryList={categoryList} */ handleFetchData={()=> handleFetchData(null,'')}/>
        </div>


          <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className='flex flex-col sm:flex-row items-center gap-5 sm:gap-0 sm:justify-between mb-6'>
              <h4 className=" text-xl font-semibold text-black dark:text-white flex justify-center items-center gap-1">
                <AnimatedText name="Warehouse List"/>
              </h4>
              <div className='flex items-center rounded-md overflow-hidden border-[1px]'>
                <span className='h-8 w-9 flex justify-center items-center text-md bg-blue-600 text-white text-[22px] font-bold'>{search === '' ? <MdOutlineSearch/> : <MdOutlineSearchOff onClick={()=> {setSearch(''); handleFetchData(null, '')}}/>}</span>
                <input type="text" name="" id="" placeholder='Search' className=' w-full text-black font-semibold sm:w-60 md:w-90 h-8 outline-none px-2  shadow-custom placeholder:text-black/60' value={search} onChange={(e) => {setSearch(e.target.value); handleFetchData(null, e.target.value); handleSelectDelAll()}}/>
              </div>
              <div className='font-semibold flex gap-3'>
                <button type="button" className='px-2 bg-blue-600 h-8  rounded-md dark:bg-blue-400 text-white dark:text-black flex justify-center items-center gap-1' onClick={() => {handleModal(); handleSelectDelAll();setSearch('')}}> <MdOutlineWarehouse className="text-lg"/> Add</button>
                <div className='relative group'>
                  <button type="button" disabled={wareHouseDataList.length === 0 && true} className='relative px-2 bg-red-600 h-8 rounded-md dark:bg-red-500 text-white dark:text-black flex justify-center items-center gap-1' onClick={onclickFunction}>{btnName === 'Select' ? <BiSolidSelectMultiple className="text-lg"/> : btnName === 'Back' ? <IoIosExit className="text-xl"/> : <MdDelete className="text-lg"/>}<h5 className={`absolute top-[-12px] left-2 text-[14px] bg-blue-600 text-white rounded-full h-5 w-5 p-2 animate-bounce flex justify-center items-center ${checkCount === 0 ? "invisible scale-50 opacity-0" : "visible scale-100 opacity-1"} transition-all duration-150 delay-75`}>{checkCount}</h5>{btnName}</button>
                  {wareHouseDataList.length === 0 ?
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
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Location
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Date Created
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className= 'text-black font-semibold'>
                      {!isLoading ?
                        (wareHouseDataList.length !== 0 ? 
                          (wareHouseDataList?.map((item : WAREHOUSEDATABASE ,index : number) => (
                            <tr key={index} className="bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 even:bg-blue-100 even:border-y-[1px] even:border-blue-700">
                                <td className={`w-4 p-4 ${isShowCheckbox ? "flex" : "hidden"}`}>
                                    <div className="flex items-center">
                                        <input id="checkBox" value={item.id!} type="checkbox" className="checkItem w-4 h-4 text-blue-600 checked:bg-slate-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" onChange={(e) => {handleCheckBox(e)}}/>
                                        <label htmlFor="checkBox" className="sr-only">checkbox</label>
                                    </div>
                                </td>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {item.name}
                                </th>
                                <td className="px-6 py-4">
                                    {item.location}
                                </td>
                                <td className="px-6 py-4">
                                    {formatDate(item.created_at!)}
                                </td>
                                <td className="px-2 py-4 flex justify-center items-center gap-2">
                                    <button className="font-medium text-white dark:text-black bg-blue-600 dark:bg-blue-400 text-lg h-8 w-8 rounded-lg flex justify-center items-center" onClick={() => {setEditId(item.id); handleModal();handleSelectDelAll();setSearch('')}}><RiEditCircleFill/></button>
                                    <button className="font-medium text-white dark:text-black bg-red-600 dark:bg-red-500 text-lg h-8 w-8 rounded-lg flex justify-center items-center" onClick={()=>{handleDelete(item.name,item.id!);handleSelectDelAll();setSearch('')}}><MdDelete/></button>
                                </td>
                            </tr>
                          )))
                          :
                          <tr className="bg-white h-14 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 even:bg-blue-100 even:border-y-[1px] even:border-blue-700">
                            <td colSpan={5} className='w-full'> <div className='flex justify-center items-center gap-3'><div className='relative'><img src='/icons8-box-important.gif' alt='nodata' className='h-6 absolute w-6 bottom-[-6px] right-[-6px]'/><BsDatabaseFillExclamation className="text-3xl text-blue-700"/></div>No Data Saved </div></td>
                          </tr> )
                      :
                      <tr className="bg-white h-14 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 even:bg-blue-100 even:border-y-[1px] even:border-blue-700">
                        <td colSpan={5} className='w-full'> <div className='flex justify-center items-center'><img src='/loadingc.svg' alt='loading' className='h-10'/>Data Fetching... </div></td>
                      </tr>
                      }
                    </tbody>
                </table>
                <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4" aria-label="Table navigation">
                    <span className="text-sm font-normal text-black dark:text-white mb-4 md:mb-0 block w-full md:inline md:w-auto">Showing <span className="font-semibold text-black dark:text-white">1-{perPage}</span> of <span className="font-semibold text-gray-900 dark:text-white">{total}</span></span>
                    <ul className={`inline-flex -space-x-px rtl:space-x-reverse text-sm h-8 ${total! <= 10 ? "invisible" : "visible"}`}>
                    {warehousePagination.map((item : PAGINATION, index : number) => (
                          <li key={index} className={`${item.active ? 'bg-cyan-600 text-white' : null} flex items-center justify-center font-semibold px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-blue-600 hover:bg-blue-900 hover:text-white dark:hover:bg-blue-900 dark:hover:text-white  dark:border-gray-700 dark:text-gray-400  cursor-pointer ${index === 0 ? 'first:rounded-l-xl' : ''} ${index === warehousePagination.length - 1 ? 'last:rounded-r-xl' : ''} transition-all duration-200 delay-75`} dangerouslySetInnerHTML={{__html: item.label}} onClick={() => {handleFetchData(item.url, ''); handleSelectDelAll()}}/>
                        ))}
                    </ul>
                </nav>
            </div>


          </div>
    </DefaultLayout>
  );
};

export default WarehouseList;
