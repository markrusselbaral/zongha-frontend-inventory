import { useState, useRef, useEffect } from 'react';
import { PRODUCT } from '../../types/product';
import DefaultLayout from '../../layout/DefaultLayout';
import CategoryLayout from '../../layout/CategoryLayout';
import ModalProduct from './ModalProduct';
import { useParams } from 'react-router-dom';

import { MdDelete, MdAddShoppingCart, MdOutlineSearchOff, MdOutlineSearch } from "react-icons/md";
import { BiSolidSelectMultiple } from "react-icons/bi";
import { RiEditCircleFill } from "react-icons/ri";
import { IoIosExit } from "react-icons/io";

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
]


const TableOne = () => {
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
    checkBoxInput.current = Array.from(document.getElementsByClassName('checkItem')) as HTMLInputElement[];
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
    

  }, []);


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

  // const handleChangeBtnName = () => {
  //   setIsShowCheckbox(!isShowCheckbox)
  //   setBtnName("Back")
  // }

  const onclickFunction = () => {
    if(btnName === "Back"){
      setBtnName("Select")
      setIsShowCheckbox(!isShowCheckbox)
    }else if(btnName === "Delete"){
      // deleteAll()
      alert( arrayCheck)
      console.log(arrayCheck)
      setCheckCount(0)
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
    setIsOpenMpdal(!isOpenModal)
  }


  return (
    <DefaultLayout>
      {/* <Breadcrumb pageName="Tables" /> */}
      <CategoryLayout>

        <div className={`fixed inset-0 flex justify-center items-center z-[1000] bg-black/10 backdrop-blur-[2px] ${isOpenModal ? 'visible' : 'invisible'} transition-all duration-200 delay-75`} onClick={handleModal}>
          <ModalProduct clickOn={(e) => e.stopPropagation()} isOpenModal={isOpenModal} handleModal={handleModal}/>
        </div>


          <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className='flex flex-col sm:flex-row items-center gap-5 sm:gap-0 sm:justify-between mb-6'>
              <h4 className=" text-xl font-semibold text-black dark:text-white">
                {`Products List ${id}`}
              </h4>
              <div className='flex items-center rounded-md overflow-hidden border-[1px]'>
                <span className='h-8 w-9 flex justify-center items-center text-md bg-blue-600 text-white text-[22px] font-bold'>{search === '' ? <MdOutlineSearch/> : <MdOutlineSearchOff onClick={()=>setSearch('')}/>}</span>
                <input type="text" name="" id="" placeholder='Search' className=' w-full text-black font-semibold sm:w-60 md:w-90 h-8 outline-none px-2  shadow-custom placeholder:text-black/60' value={search} onChange={(e) => setSearch(e.target.value)}/>
              </div>
              <div className='font-semibold flex gap-3'>
                <button type="button" className='px-2 bg-blue-600 h-8  rounded-md dark:bg-blue-400 text-white dark:text-black flex justify-center items-center gap-1' onClick={handleModal}> <MdAddShoppingCart className="text-lg"/> Add</button>
                <button type="button" className='relative px-2 bg-red-600 h-8 rounded-md dark:bg-red-500 text-white dark:text-black flex justify-center items-center gap-1' onClick={onclickFunction}>{btnName === 'Select' ? <BiSolidSelectMultiple className="text-lg"/> : btnName === 'Back' ? <IoIosExit className="text-xl"/> : <MdDelete className="text-lg"/>}<h5 className={`absolute top-[-12px] left-2 text-[14px] bg-blue-600 text-white rounded-full h-5 w-5 p-2 animate-bounce flex justify-center items-center ${checkCount === 0 ? "invisible scale-50 opacity-0" : "visible scale-100 opacity-1"} transition-all duration-150 delay-75`}>{checkCount}</h5>{btnName}</button>
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
                            <th scope="col" className="px-6 py-3 hidden lg:flex h-14 items-center ">
                                Image
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3 hidden lg:flex h-14 items-center ">
                                Warehouse
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Date
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Quantity
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Price
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className= 'text-black font-semibold'>
                      {productList.map((item : PRODUCT,index : number) => (
                        <tr key={index} className="bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className={`w-4 p-4 ${isShowCheckbox ? "flex" : "hidden"}`}>
                                <div className="flex items-center">
                                    <input id={item.id.toString()} value={item.id} type="checkbox" className="checkItem w-4 h-4 text-blue-600 checked:bg-slate-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" onChange={(e) => {handleCheckBox(e)}}/>
                                    <label htmlFor={item.id.toString()} className="sr-only">checkbox</label>
                                </div>
                            </td>
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {item.pcode}
                            </th>
                            <td className="px-6 py-4 hidden lg:flex items-center">
                                {item.image}
                            </td>
                            <td className="px-6 py-4">
                                {item.name}
                            </td>
                            <td className="px-6 py-4 hidden lg:flex items-center">
                                {item.warehouse}
                            </td>
                            <td className="px-6 py-4">
                                {item.date}
                            </td>
                            <td className="px-6 py-4">
                                {item.quantity}
                            </td>
                            <td className="px-6 py-4">
                                ₱ {item.price}
                            </td>
                            <td className="px-2 py-4 flex gap-2">
                                <button className="font-medium text-white dark:text-black bg-blue-600 dark:bg-blue-400 text-lg h-8 w-8 rounded-lg flex justify-center items-center"><RiEditCircleFill/></button>
                                <button className="font-medium text-white dark:text-black bg-red-600 dark:bg-red-500 text-lg h-8 w-8 rounded-lg flex justify-center items-center"><MdDelete/></button>
                            </td>
                        </tr>
                      ))}
                    </tbody>
                </table>
                <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4" aria-label="Table navigation">
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">Showing <span className="font-semibold text-gray-900 dark:text-white">1-10</span> of <span className="font-semibold text-gray-900 dark:text-white">1000</span></span>
                    <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                        <li>
                            <a href="#" className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">1</a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">2</a>
                        </li>
                        <li>
                            <a href="#" aria-current="page" className="flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">3</a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">4</a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">5</a>
                        </li>
                        <li>
                    <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</a>
                        </li>
                    </ul>
                </nav>
            </div>


          </div>
      </CategoryLayout>
    </DefaultLayout>
  );
};

export default TableOne;
