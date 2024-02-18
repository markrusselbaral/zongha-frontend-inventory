import React, { useEffect, useState } from 'react'
import { CATEGORY } from '../../types/category';
import { IoCloseSharp} from "react-icons/io5";
import axios from '../../api/axios';
import { toast } from 'react-toastify';

import { TbPlaylistAdd } from "react-icons/tb";


interface ModalCategoryProps {
    clickOn: (e: React.MouseEvent<HTMLDivElement>) => void;
    isOpenModal: boolean;
    handleModal: () => void;
    editId: number | null;
    categoryList: CATEGORY[];
  }


const ModalCategory: React.FC<ModalCategoryProps> = ({ clickOn, isOpenModal, handleModal, editId, categoryList}) => {

    const [category, setCategory] =  useState({
        cId : 0,
        cName: "",
    });

    const handleInput = (e : React.ChangeEvent<HTMLInputElement>) => {
        const inputName = e.target.name
        const inputValue = e.target.value

        setCategory({
            ...category, [inputName] : inputValue
        })
    }

    const fetchCategory = () => {
        if(editId){
        const dataCategory  = categoryList.find(item => item.id === editId)
        console.log(dataCategory)
            if(dataCategory){
                setCategory({...category, cName : dataCategory.name , cId : dataCategory.id })
            }
        }else{
            setCategory({...category, cName: "", cId : 0})
        }
    }

    useEffect(() => {
        fetchCategory()
    },[editId])

    useEffect(() => {
        if(!editId){
            setCategory({...category, cName: "", cId : 0})
        }
    } ,[isOpenModal === false])


    // handling of api category data
    const handleSubmit = async(e : React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
            try {
                if(!editId){
                    const response = await axios.post('/api/category', {name : category.cName})
                    console.log(response)
                    toast.success(
                        `${category.cName} ${response.data.message}`,
                        {
                            position : toast.POSITION.TOP_RIGHT
                        }
                    )
                }else{
                    const response = await axios.put(`/api/category/${editId}`, {name : category.cName})
                    console.log(response)
                    toast.success(
                        `${category.cName} ${response.data.message}`,
                        {
                            position : toast.POSITION.TOP_RIGHT
                        }
                    )
                }
            } catch (error : any) {
                console.log(error.response.data.error.name)
                toast.error(
                    `${category.cName} ${error.response.data.error.name}`,
                    {
                        position : toast.POSITION.TOP_RIGHT
                    }
                )
            }
        handleModal()
    }

  return (
    <section className={`relative overflow-hidden py-2 px-6 h-fit w-[90%] md:[50%] lg:w-[40%] border-2 border-blue-600 dark:border-white rounded-xl bg-white dark:bg-boxdark text-black dark:text-white ${!isOpenModal ? "invisible scale-50 opacity-0" : "visible scale-100 opacity-1"} transition-all duration-200 delay-75`} onClick={clickOn}>
            <IoCloseSharp className='absolute top-0 right-0 bg-[#ff0000] rounded-bl-xl text-white h-7 w-10 p-[3px]' onClick={handleModal}/>
            <div className='flex gap-2 text-2xl font-semibold items-center mb-2'>
                <TbPlaylistAdd />
                <h2>{editId ? "Update Category" : "Add Category"}</h2>
            </div>
            <div className='h-[2px] w-full bg-blue-600 dark:bg-white mb-2'/>
            <div className='h-full'>
                <form action="" onSubmit={handleSubmit}>
                    <div className='flex w-full gap-1 md:gap-4 flex-col mb-6 h-full'>
                        <div className='flex flex-col w-full '>
                            <label htmlFor="cName" className='pb-1 pl-1 font-semibold flex gap-2'>Category Name
                                {/* <span className='italic text-red-600 font-normal text-[13px] '>Required*</span> */}
                            </label>
                            <div className='relative w-full'>
                                <IoCloseSharp className={`absolute top-[10px] right-2 bg-blue-700/50 p-[1px] rounded-full ${category.cName !== '' ? 'visible' : 'invisible'}`} onClick={() => setCategory({...category, cName : ''})}/>
                                <input type="text" name="cName" id="cName" placeholder='ex: Beef' value={category.cName} className='h-9 w-full bg-black/10 dark:bg-white border-[1px] border-blue-600 rounded-md text-blue-700 font-semibold outline-1 pl-2 pr-8' onChange={handleInput}/>
                            </div>
                        </div>
                    </div>
                    <div className='h-[2px] bg-blue-600 dark:bg-white mb-2'/>
                    <div className='mt-4 flex justify-end gap-4 mb-4'>
                        <button type='submit' className='px-6  h-9 rounded-md  bg-blue-600 dark:bg-blue-500 text-white dark:text-black flex justify-center items-center'>{!editId ? 'Submit' : 'Update'}</button>
                        <button type='button' className='px-6 bg-red-600 h-9 rounded-md dark:bg-red-500 text-white dark:text-black flex justify-center items-center' onClick={handleModal}>Close</button>
                    </div>
                </form>
            </div>
    </section>
  )
}

export default ModalCategory