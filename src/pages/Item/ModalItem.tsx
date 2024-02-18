import React, { useEffect, useState, useRef } from 'react'
import { ITEM, ITEMDATABASE } from '../../types/item'
import { CATEGORY } from '../../types/category';
import { IoCloseSharp} from "react-icons/io5";
import { MdAddShoppingCart} from "react-icons/md";
import axios from '../../api/axios';
import { toast } from 'react-toastify';


interface ModalItemProps {
    clickOn: (e: React.MouseEvent<HTMLDivElement>) => void;
    isOpenModal: boolean;
    handleModal: () => void;
    editId: number | null;
    itemDataList: ITEMDATABASE[];
    categoryList : CATEGORY[];
    handleFetchData: () => Promise<void>;
  }


const ModalItem: React.FC<ModalItemProps> = ({ clickOn, isOpenModal, handleModal, editId, itemDataList, categoryList, handleFetchData}) => {

    const fileRef = useRef<HTMLInputElement>(null)

    const [itemData, setItemData] =  useState<ITEM>({
        iName: "",
        iImage: {},
        iImageName : '',
        iCategory : '',
        iCategoryId: null,
    });

    const handleResetForm = () => {
        setItemData({...itemData,
            iName: "",
            iImage: {},
            iImageName : '',
            iCategory: '',
            iCategoryId: null,
        });
        if ((fileRef.current as any)?.value) {
            (fileRef.current as any).value = '';
        }
    }



    const handleInput = (e : React.ChangeEvent<HTMLInputElement>) => {
        const inputName = e.target.name
        const inputValue = e.target.value

        setItemData({
            ...itemData, [inputName] : inputValue
        })
    }
    const handleInputImage = (e : React.ChangeEvent<HTMLInputElement>) => {
        const inputName = e.target.name
        const inputValue = e.target.files && e.target.files[0]


        // console.log(inputValue.name)
        setItemData({
            ...itemData,
            [inputName] : inputValue,
            iImageName : inputValue?.name || ''
        })
    }

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
        const splitSelectValue = selectValue.split(',')

        setItemData({
            ...itemData, [selectName] : splitSelectValue[1], iCategoryId : Number(splitSelectValue[0])
        })
    }

    const fetchItem = () => {
        if(editId){
            console.log(itemDataList)
            const dataItem  = itemDataList.find(item => item.id === editId)
            const categoryName = categoryList.find(item => item.id === dataItem?.category_id)
            if(dataItem){
            console.log("helllo",categoryName)
                console.log(typeof dataItem.image)
                setItemData({...itemData, iName : dataItem.name, iCategory : categoryName?.name || '', iImageName : dataItem.image.toString() , iCategoryId : dataItem.category_id})
            }
        }else{
            setItemData({...itemData, iName: "",  iImage: {}, iCategory : '', iImageName : '' , iCategoryId: 0})
        }
        // console.log(itemData.iName)
    }


    useEffect(() => {
        fetchItem()
    },[editId])

    useEffect(() => {
        if(!editId){
            // setItemData({...itemData, iName: "",  iImage: {}, iCategory : '', iCategoryId: 0})
            handleResetForm()
        }
    } ,[isOpenModal === false])



    const handleSubmitItem = async(e : React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()

        const categoryId: number = itemData.iCategoryId || 0; // Assuming 0 as a default value if iCategoryId is not available
        const image: File | null = itemData.iImage instanceof File ? itemData.iImage : null;
        const formData = new FormData();
        formData.append('_method', editId ? 'PUT' : 'POST');
        formData.append('name', itemData.iName);
        formData.append('category_id', categoryId.toString()); // Convert number to string
        if (image) {
            formData.append('image', image);
        }

            try {
                if(!editId){
                    for (const [key, value] of formData.entries()) {
                        console.log(`${key}: ${value}`);
                    }
                    // console.log(itemData.iImage)
                    // console.log(formData)
                    const response = await axios.post('/api/item', formData)
                    console.log(response.data.message)
                    toast.success(
                        `${itemData.iName} ${response.data.message}`,
                        {
                            position : toast.POSITION.TOP_RIGHT
                        }
                    )
                }else{
                    // console.log("you update it",editId, formData)
                    // console.log(itemData.iImage)
                    for (const [key, value] of formData.entries()) {
                        console.log(`${key}: ${value}`);
                    }
                    const response = await axios.post(`/api/item/${editId}`, formData)
                    console.log(response)
                    toast.success(
                        `${itemData.iName} ${response.data.message}`,
                        {
                            position : toast.POSITION.TOP_RIGHT
                        }
                    )
                }

                // handleResetForm()
            } catch (error: any) {
                console.log(error)
                toast.error(
                    `${itemData.iName} ${error.response.data.message}`,
                    {
                        position : toast.POSITION.TOP_RIGHT
                    }
                )
            }
            handleFetchData()
            handleResetForm()
            handleModal()
            console.log(itemData)
    }

  return (
    <section className={`relative overflow-hidden py-2 px-6 h-fit w-[90%] md:[50%] lg:w-[40%] border-2 border-blue-600 dark:border-white rounded-xl bg-white dark:bg-boxdark text-black dark:text-white ${!isOpenModal ? "invisible scale-50 opacity-0" : "visible scale-100 opacity-1"} transition-all duration-200 delay-75`} onClick={clickOn}>
            <IoCloseSharp className='absolute top-0 right-0 bg-[#ff0000] rounded-bl-xl text-white h-7 w-10 p-[3px]' onClick={handleModal}/>
            <div className='flex gap-2 text-2xl font-semibold items-center mb-2'>
                <MdAddShoppingCart />
                <h2>{editId ? "Update Item" : "Add Item"}</h2>
            </div>
            <div className='h-[2px] w-full bg-blue-600 dark:bg-white mb-2'/>
            <div className='h-full'>
                <form action="" onSubmit={handleSubmitItem}>
                    <div className='flex w-full gap-1 md:gap-4 flex-col mb-6 h-full'>
                        <div className='relative flex flex-col w-full '>
                            <label htmlFor="iName" className='pb-1 pl-1 font-semibold flex gap-2'>Item Name 
                                <span className='italic text-red-600 font-normal text-[13px] '>Required*</span>
                            </label>
                            <div className='relative w-full'>
                                <IoCloseSharp className={`absolute top-[10px] right-2 bg-blue-700/50 p-[1px] rounded-full ${itemData.iName === '' ? 'invisible' : 'visible'}`} onClick={() => setItemData({...itemData, iName : ''})}/>
                                <input type="text" name="iName" id="iName" required placeholder='Beef Steak' value={itemData.iName} className='h-9 w-full bg-black/10 dark:bg-white border-[1px] border-blue-600 rounded-md text-blue-700 font-semibold outline-1 pl-2 pr-8' onChange={handleInput}/>
                            </div>
                        </div>
                        {/* <div className='flex flex-col w-full '>
                            <label htmlFor="pImage" className='pb-1 pl-1 font-semibold'>Item Image</label>
                            <div className='relative w-full'>
                                <IoCloseSharp className={`absolute top-[10px] right-2 bg-blue-700/50 p-[1px] z-20 rounded-full ${product.pImage === '' ? 'invisible' : 'visible'}`} onClick={() => setProduct({...product, pImage : ''})}/>
                                <input type="file" ref={fileRef} accept="image/png, image/jpeg, image/jpg, image/webp" name="iImage" id="iImage" className='p-1 rounded-md z-10 absolute w-full' onChange={handleInputImage}/>
                                <input type="text" className='h-9 w-full bg-black/10 dark:bg-white border-[1px] border-blue-600 rounded-md text-blue-700 font-semibold z-0 outline-1 pl-2 pr-8'/>
                            </div>
                        </div> */}
                        <div className='flex flex-col w-full '>
                            <label htmlFor="iImage" className='pb-1 pl-1 font-semibold'>Item Image</label>
                            <div className='relative w-full'>
                                <input type="file" ref={fileRef} accept="image/png, image/jpeg, image/jpg, image/webp" name="iImage" id="iImage" className='p-1 rounded-md z-10 absolute w-full hidden' onChange={handleInputImage}/>
                                {/* <input type="text" className='h-9 w-full bg-black/10 dark:bg-white border-[1px] border-blue-600 rounded-md text-blue-700 font-semibold z-0 outline-1 pl-2 pr-8'/> */}
                                <div className='flex h-9 w-full bg-black/10 dark:bg-white border-[1px] border-blue-600 rounded-md text-blue-700 font-semibold overflow-hidden' onClick={() => fileRef.current && fileRef.current.click()}>
                                    <button type='button' id='file' className='w-40 border-r-[1px] bg-blue-300'>Choose File</button>
                                    <span  id="" className='h-9 w-full px-2 bg-blue-50 flex items-center flex-wrap cursor-pointer'>{itemData.iImageName ? itemData.iImageName : "No File Choosen"}</span>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col w-full '>
                            <label htmlFor="iCategory" className='pb-1 pl-1 font-semibold flex gap-2'>Item Category
                                <span className='italic text-red-600 font-normal text-[13px] '>Required*</span>
                            </label>
                            <div className='relative w-full'>
                                {/* <IoCloseSharp className={`absolute top-[10px] right-2 bg-blue-700/50 p-[1px] rounded-full ${product.pWarehouse === '' ? 'invisible' : 'visible'}`} onClick={() => setProduct({...product, pWarehouse : 'Choose Warehouse'})}/> */}
                                {/* <input type="text" name="pWarehouse" id="pWarehouse" placeholder='Beef Steak' value={product.pWarehouse} className='h-9 w-full bg-black/10 dark:bg-white border-[1px] border-blue-600 rounded-md text-blue-700 font-semibold outline-1 pl-2 pr-8' onChange={handleInput}/> */}
                                <select name="iCategory" id="iCategory" required className='h-9 w-full bg-black/10 dark:bg-white border-[1px] border-blue-600 rounded-md text-blue-700 font-semibold outline-1 pl-2 pr-8' onChange={handleSelect}>
                                    <option>Choose Category</option>
                                    {categoryList.map((item,index) => (
                                        <option key={index} value={`${item.id},${item.name}`} selected={itemData.iCategory === item.name}>{item.name}</option>
                                    ))}
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

export default ModalItem