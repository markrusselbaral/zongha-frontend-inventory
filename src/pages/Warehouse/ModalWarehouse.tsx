import React, { useEffect, useState, useRef } from 'react'
import { ITEM, ITEMDATABASE } from '../../types/item'
import { CATEGORY } from '../../types/category';
import { WAREHOUSEDATABASE, WAREHOUSEADD } from '../../types/warehouse';
import { IoCloseSharp} from "react-icons/io5";
import { MdOutlineWarehouse} from "react-icons/md";
import axios from '../../api/axios';
import { toast } from 'react-toastify';


interface ModalWarehouseProps {
    clickOn: (e: React.MouseEvent<HTMLDivElement>) => void;
    isOpenModal: boolean;
    handleModal: () => void;
    editId: number | null;
    wareHouseDataList: WAREHOUSEDATABASE[];
    // categoryList : CATEGORY[];
    handleFetchData: () => Promise<void>;
  }


const ModalWarehouse: React.FC<ModalWarehouseProps> = ({ clickOn, isOpenModal, handleModal, editId,  wareHouseDataList, /* categoryList, */ handleFetchData}) => {


    const [warehouseData, setWarehouseData] =  useState<WAREHOUSEADD>({
        name: "",
        location : "",
    });

    const handleResetForm = () => {
        setWarehouseData({...warehouseData,
            name: "",
            location : '',
        });
    }



    const handleInput = (e : React.ChangeEvent<HTMLInputElement>) => {
        const inputName = e.target.name
        const inputValue = e.target.value

        setWarehouseData({
            ...warehouseData, [inputName] : inputValue
        })
    }
    // const handleInputImage = (e : React.ChangeEvent<HTMLInputElement>) => {
    //     const inputName = e.target.name
    //     const inputValue = e.target.files && e.target.files[0]


    //     // console.log(inputValue.name)
    //     setItemData({
    //         ...itemData,
    //         [inputName] : inputValue,
    //         iImageName : inputValue?.name || ''
    //     })
    // }

    // const handleInputAuto = (e : React.ChangeEvent<HTMLInputElement>) => {
    //     const inputName = e.target.name
    //     const inputValue = e.target.value

    //     setProduct({
    //         ...product, [inputName] : inputValue
    //     })
    // }

    // const handleSelect = (e : React.ChangeEvent<HTMLSelectElement>) => {
    //     const selectName = e.target.name
    //     const selectValue = e.target.value
    //     const splitSelectValue = selectValue.split(',')

    //     setItemData({
    //         ...itemData, [selectName] : splitSelectValue[1], iCategoryId : Number(splitSelectValue[0])
    //     })
    // }


    //and naghandle sa kung iupdate ang data sa warehouse
    const fetchItem = () => {
        if(editId){
            console.log(wareHouseDataList)
            const dataWarehouse  = wareHouseDataList.find(item => item.id === editId)
            if(dataWarehouse){
                setWarehouseData({...warehouseData, name : dataWarehouse.name, location : dataWarehouse.location})
            }
        }else{
            setWarehouseData({...warehouseData, name: "", location : ""})
        }
    }


    useEffect(() => {
        fetchItem()
    },[editId])

    useEffect(() => {
        if(!editId){
            // setWarehouseData({...warehouseData, name: "", location : ''})
            handleResetForm()
        }
    } ,[isOpenModal === false])


    const handleSubmitWarehouse = async(e : React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
            try {
                if(!editId){
                    const response = await axios.post('/api/warehouse', {name : warehouseData.name, location : warehouseData.location})
                    console.log(response)
                    toast.success(
                        `${warehouseData.name} ${response.data.message}`,
                        {
                            position : toast.POSITION.TOP_RIGHT
                        }
                    )
                }else{
                    const response = await axios.put(`/api/warehouse/${editId}`, {name : warehouseData.name, location : warehouseData.location})
                    console.log(response)
                    toast.success(
                        `${warehouseData.name} ${response.data.message}`,
                        {
                            position : toast.POSITION.TOP_RIGHT
                        }
                    )
                }

                handleResetForm()
            } catch (error: any) {
                console.log(error)
                toast.error(
                    `${warehouseData.name} ${error.response.data.message}`,
                    {
                        position : toast.POSITION.TOP_RIGHT
                    }
                )
            }
            handleFetchData()
            handleResetForm()
            handleModal()
            // console.log(itemData)
    }

  return (
    <section className={`relative overflow-hidden py-2 px-6 h-fit w-[90%] md:[50%] lg:w-[40%] border-2 border-blue-600 dark:border-white rounded-xl bg-white dark:bg-boxdark text-black dark:text-white ${!isOpenModal ? "invisible scale-50 opacity-0" : "visible scale-100 opacity-1"} transition-all duration-200 delay-75`} onClick={clickOn}>
            <IoCloseSharp className='absolute top-0 right-0 bg-[#ff0000] rounded-bl-xl text-white h-7 w-10 p-[3px]' onClick={handleModal}/>
            <div className='flex gap-2 text-2xl font-semibold items-center mb-2'>
                <MdOutlineWarehouse />
                <h2>{editId ? "Update Warehouse" : "Add Warehouse"}</h2>
            </div>
            <div className='h-[2px] w-full bg-blue-600 dark:bg-white mb-2'/>
            <div className='h-full'>
                <form action="" onSubmit={handleSubmitWarehouse}>
                    <div className='flex w-full gap-1 md:gap-4 flex-col mb-6 h-full'>
                        <div className='relative flex flex-col w-full '>
                            <label htmlFor="name" className='pb-1 pl-1 font-semibold flex gap-2'>Warehouse Name 
                                <span className='italic text-red-600 font-normal text-[13px] '>Required*</span>
                            </label>
                            <div className='relative w-full'>
                                <IoCloseSharp className={`absolute top-[10px] right-2 bg-blue-700/50 p-[1px] rounded-full ${warehouseData.name === '' ? 'invisible' : 'visible'}`} onClick={() => setWarehouseData({...warehouseData, name : ''})}/>
                                <input type="text" name="name" id="name" required placeholder='Warehouse 1' value={warehouseData.name} className='h-9 w-full bg-black/10 dark:bg-white border-[1px] border-blue-600 rounded-md text-blue-700 font-semibold outline-1 pl-2 pr-8' onChange={handleInput}/>
                            </div>
                        </div>
                        <div className='relative flex flex-col w-full '>
                            <label htmlFor="location" className='pb-1 pl-1 font-semibold flex gap-2'>Warehouse Location 
                                {/* <span className='italic text-red-600 font-normal text-[13px] '>Required*</span> */}
                            </label>
                            <div className='relative w-full'>
                                <IoCloseSharp className={`absolute top-[10px] right-2 bg-blue-700/50 p-[1px] rounded-full ${warehouseData.location === '' ? 'invisible' : 'visible'}`} onClick={() => setWarehouseData({...warehouseData, location : ''})}/>
                                <input type="text" name="location" id="location" required placeholder='Antipolo Rizal' value={warehouseData.location} className='h-9 w-full bg-black/10 dark:bg-white border-[1px] border-blue-600 rounded-md text-blue-700 font-semibold outline-1 pl-2 pr-8' onChange={handleInput}/>
                            </div>
                        </div>
                    </div>
                    <div className='h-[2px] bg-blue-600 dark:bg-white mb-2'/>
                    <div className='mt-4 flex justify-end gap-4 mb-4'>
                        <button type='submit' className='px-6  h-9 rounded-md  bg-blue-600 dark:bg-blue-500 text-white dark:text-black flex justify-center items-center'>{editId ? "Update" : "Submit"}</button>
                        <button type='button' className='px-6 bg-red-600 h-9 rounded-md dark:bg-red-500 text-white dark:text-black flex justify-center items-center' onClick={handleModal}>Close</button>
                    </div>
                </form>
            </div>
    </section>
  )
}

export default ModalWarehouse