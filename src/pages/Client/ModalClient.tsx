import React, { useEffect, useState, useRef } from 'react'
import { ITEM, ITEMDATABASE } from '../../types/item'
import { CATEGORY } from '../../types/category';
import { WAREHOUSEDATABASE, WAREHOUSEADD } from '../../types/warehouse';
import { CLIENTDATABASE } from '../../types/client';
import { CLIENTADD } from '../../types/client';
import { IoCloseSharp} from "react-icons/io5";
import { MdOutlineWarehouse} from "react-icons/md";
import axios from '../../api/axios';
import { toast } from 'react-toastify';

import { FaUserPlus } from "react-icons/fa6";
import handleCapitalize from '../../components/TextCapitalize/TextCapitalize';
import handleTinNumber from '../../components/TinFormatter/TinFormatter';


interface ModalClientProps {
    clickOn: (e: React.MouseEvent<HTMLDivElement>) => void;
    isOpenModal: boolean;
    handleModal: () => void;
    editId: number | null;
    clientDataList: CLIENTDATABASE[];
    // categoryList : CATEGORY[];
    handleFetchData: () => Promise<void>;
  }


const ModalClient: React.FC<ModalClientProps> = ({ clickOn, isOpenModal, handleModal, editId,  clientDataList, /* categoryList, */ handleFetchData}) => {


    const [clientData, setClientData] =  useState<CLIENTADD>({
        name: "",
        tin_name : '',
        tin_number : '',
        type : '',

    });

    const handleResetForm = () => {
        setClientData({...clientData,
            name: "",
            tin_name : '',
            tin_number : '',
            type : '',
        });
    }



    const handleInput = (e : React.ChangeEvent<HTMLInputElement>) => {
        const inputName = e.target.name
        const inputValue = e.target.value

        setClientData({
            ...clientData, [inputName] : inputValue
        })
    }
    const handleInputCapitalize = (e : React.ChangeEvent<HTMLInputElement>) => {
        const inputName = e.target.name
        const inputValue = e.target.value

        setClientData({
            ...clientData, [inputName] : handleCapitalize(inputValue)
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

    const handleSelect = (e : React.ChangeEvent<HTMLSelectElement>) => {
        const selectName = e.target.name
        const selectValue = e.target.value

        setClientData({
            ...clientData, [selectName] : selectValue
        })

    }


    // and naghandle sa kung iupdate ang data sa Client
    const fetchItem = () => {
        if(editId){
            console.log(clientDataList)
            const dataClient  = clientDataList.find(item => item.id === editId)
            console.log(dataClient,"this is client")
            if(dataClient){
                setClientData({...clientData, name : dataClient.name, tin_name : dataClient.tin_name, tin_number: dataClient.tin_number, type : dataClient.type})
            }
        }else{
            setClientData({...clientData, name: "", tin_name : "", tin_number : '', type : ''})
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


    const handleSubmitClient = async(e : React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        // console.log(clientData)
            try {
                if(!editId){
                    const response = await axios.post('/api/client', {name: clientData.name, tin_name : clientData.tin_name, tin_number : clientData.tin_number, type : clientData.type})
                    console.log(response)
                    toast.success(
                        `${clientData.name} ${response.data.message}`,
                        {
                            position : toast.POSITION.TOP_RIGHT
                        }
                    )
                }else{
                    const response = await axios.put(`/api/client/${editId}`, {name: clientData.name, tin_name : clientData.tin_name, tin_number : clientData.tin_number, type : clientData.type})
                    console.log(response)
                    toast.success(
                        `${clientData.name} ${response.data.message}`,
                        {
                            position : toast.POSITION.TOP_RIGHT
                        }
                    )
                }

                handleResetForm()
            } catch (error: any) {
                console.log(error)
                toast.error(
                    `${clientData.name} ${error.response.data.message}`,
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
                <FaUserPlus />
                <h2>{editId ? "Update Client" : "Add Client"}</h2>
            </div>
            <div className='h-[2px] w-full bg-blue-600 dark:bg-white mb-2'/>
            <div className='h-full'>
                <form action="" onSubmit={handleSubmitClient}>
                    <div className='flex w-full gap-1 md:gap-4 flex-col mb-6 h-full'>
                        <div className='relative flex flex-col w-full '>
                            <label htmlFor="name" className='pb-1 pl-1 font-semibold flex gap-2'>Client Name 
                                <span className='italic text-red-600 font-normal text-[13px] '>Required*</span>
                            </label>
                            <div className='relative w-full'>
                                <IoCloseSharp className={`absolute top-[10px] right-2 bg-blue-700/50 p-[1px] rounded-full ${clientData.name === '' ? 'invisible' : 'visible'}`} onClick={() => setClientData({...clientData, name : ''})}/>
                                <input type="text" name="name" id="name" required placeholder='Juan Dela Cruz' value={clientData.name} className='h-9 w-full bg-black/10 dark:bg-white border-[1px] border-blue-600 rounded-md text-blue-700 font-semibold outline-1 pl-2 pr-8' onChange={handleInputCapitalize}/>
                            </div>
                        </div>
                        <div className='relative flex flex-col w-full '>
                            <label htmlFor="tin_name" className='pb-1 pl-1 font-semibold flex gap-2'>Tin Name 
                                {/* <span className='italic text-red-600 font-normal text-[13px] '>Required*</span> */}
                            </label>
                            <div className='relative w-full'>
                                <IoCloseSharp className={`absolute top-[10px] right-2 bg-blue-700/50 p-[1px] rounded-full ${clientData.tin_name === '' ? 'invisible' : 'visible'}`} onClick={() => setClientData({...clientData, tin_name : ''})}/>
                                <input type="text" name="tin_name" id="tin_name" required placeholder='jaun' value={clientData.tin_name} className='h-9 w-full bg-black/10 dark:bg-white border-[1px] border-blue-600 rounded-md text-blue-700 font-semibold outline-1 pl-2 pr-8' onChange={handleInput}/>
                            </div>
                        </div>
                        <div className='relative flex flex-col w-full '>
                            <label htmlFor="tin_number" className='pb-1 pl-1 font-semibold flex gap-2'>Tin Number 
                                <span className='italic text-red-600 font-normal text-[13px] '>{'Required*'}</span>
                            </label>
                            <div className='relative w-full'>
                                <IoCloseSharp className={`absolute top-[10px] right-2 bg-blue-700/50 p-[1px] rounded-full ${clientData.tin_number === '' ? 'invisible' : 'visible'}`} onClick={() => setClientData({...clientData, tin_number : ''})}/>
                                <input type="text" name="tin_number" id="tin_number" required placeholder='0' value={clientData.tin_number} className='h-9 w-full bg-black/10 dark:bg-white border-[1px] border-blue-600 rounded-md text-blue-700 font-semibold outline-1 pl-2 pr-8' onChange={handleInput}/>
                            </div>
                        </div>
                        <div className='flex flex-col w-full '>
                            <label htmlFor="iCategory" className='pb-1 pl-1 font-semibold flex gap-2'>Client Type
                                <span className='italic text-red-600 font-normal text-[13px] '>Required*</span>
                            </label>
                            <div className='relative w-full'>
                                    {/* <IoCloseSharp className={`absolute top-[10px] right-2 bg-blue-700/50 p-[1px] rounded-full ${product.pWarehouse === '' ? 'invisible' : 'visible'}`} onClick={() => setProduct({...product, pWarehouse : 'Choose Warehouse'})}/> */}
                                    {/* <input type="text" name="pWarehouse" id="pWarehouse" placeholder='Beef Steak' value={product.pWarehouse} className='h-9 w-full bg-black/10 dark:bg-white border-[1px] border-blue-600 rounded-md text-blue-700 font-semibold outline-1 pl-2 pr-8' onChange={handleInput}/> */}
                                    <select name="type" id="type" required value={clientData.type} className='h-9 w-full bg-black/10 dark:bg-white border-[1px] border-blue-600 rounded-md text-blue-700 font-semibold outline-1 pl-2 pr-8' onChange={handleSelect}>
                                        <option>Choose Type</option>
                                        <option value="wholesale" /* selected={clientData.type === 'WholeSale'} */>WholeSale</option>
                                        <option value="Retail" /* selected={clientData.type === 'Retail'}*/>Retail</option>
                                    </select>
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

export default ModalClient