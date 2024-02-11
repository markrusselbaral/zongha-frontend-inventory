import React, { useEffect, useState } from 'react'
import { WAREHOUSE } from '../../types/warehouse'
import { PRODUCT } from '../../types/product';
import { IoCloseSharp} from "react-icons/io5";
import { MdAddShoppingCart} from "react-icons/md";


interface ModalProductProps {
    clickOn: (e: React.MouseEvent<HTMLDivElement>) => void;
    isOpenModal: boolean;
    handleModal: () => void;
    editId: number | null;
    productList: PRODUCT[];
  }

const warehouseList: WAREHOUSE[] = [
    {
        id : 1,
        name : "Warehouse 1",
        location : 'cavite',
    },
    {
        id : 2,
        name : "Warehouse 2",
        location : 'quezon',
    }
] 

const ModalProduct: React.FC<ModalProductProps> = ({ clickOn, isOpenModal, handleModal, editId, productList}) => {

    const [isAutoSuggest, setIsAutoSuggest] = useState<boolean>(false)

    const [product, setProduct] =  useState({
        pName: "",
        pId: 0,
        pCode: "",
        pImage: "",
        pWarehouse : "",
        pWarehouseId: 0,
        pQuantity : 0,
        pPrice : 0,
    });

    const handleInput = (e : React.ChangeEvent<HTMLInputElement>) => {
        const inputName = e.target.name
        const inputValue = e.target.value

        setProduct({
            ...product, [inputName] : inputValue
        })
    }
    const handleInputImage = (e : React.ChangeEvent<HTMLInputElement>) => {
        const inputName = e.target.name
        const inputValue = e.target.files && e.target.files[0]

        console.log(inputValue)

        if (inputValue !== null && inputValue !== undefined) {
            setProduct({
                ...product,
                [inputName]: inputValue.name
            });
        }
    }

    const handleInputAuto = (e : React.ChangeEvent<HTMLInputElement>) => {
        const inputName = e.target.name
        const inputValue = e.target.value

        setProduct({
            ...product, [inputName] : inputValue
        })
        setIsAutoSuggest(true)
    }

    const handleSelect = (e : React.ChangeEvent<HTMLSelectElement>) => {
        const selectName = e.target.name
        const selectValue = e.target.value
        const splitSelectValue = selectValue.split(',')

        setProduct({
            ...product, [selectName] : selectValue, pWarehouseId : Number(splitSelectValue[0])
        })
    }

    const fetchProduct = () => {
        if(editId){
        const dataProduct  = productList.find(item => item.id === editId)
        console.log(dataProduct)
            if(dataProduct){
                setProduct({...product, pId : dataProduct.id, pName : dataProduct.name, pCode: dataProduct.pcode, pImage: dataProduct.image, pWarehouse : dataProduct.warehouse, pQuantity : dataProduct.quantity, pPrice : dataProduct.price })
            }
        }else{
            setProduct({...product, pName: "", pId: 0, pCode: "", pImage: "", pWarehouse : "", pWarehouseId: 0, pQuantity : 0, pPrice : 0, })
        }
    }

    useEffect(() => {
        fetchProduct()
    },[editId])

    useEffect(() => {
        if(!editId){
            setProduct({...product, pName: "", pId: 0, pCode: "", pImage: "", pWarehouse : "", pWarehouseId: 0, pQuantity : 0, pPrice : 0, })
        }
    } ,[isOpenModal === false])

  return (
    <section className={`relative overflow-hidden py-2 px-6 h-fit md:h-[85%] w-[90%] md:[50%] lg:w-[40%] border-2 border-blue-600 dark:border-white rounded-xl bg-white dark:bg-boxdark text-black dark:text-white ${!isOpenModal ? "invisible scale-50 opacity-0" : "visible scale-100 opacity-1"} transition-all duration-200 delay-75`} onClick={clickOn}>
            <IoCloseSharp className='absolute top-0 right-0 bg-[#ff0000] rounded-bl-xl text-white h-7 w-10 p-[3px]' onClick={handleModal}/>
            <div className='flex gap-2 text-2xl font-semibold items-center mb-2'>
                <MdAddShoppingCart />
                <h2>{editId ? "Update Product" : "Add Product"}</h2>
            </div>
            <div className='h-[2px] w-full bg-blue-600 dark:bg-white mb-2'/>
            <div className='h-full'>
                <form action="" >
                    <div className='flex w-full gap-1 md:gap-4 flex-col mb-6 h-full'>
                        <div className='relative flex flex-col w-full '>
                            <label htmlFor="pName" className='pb-1 pl-1 font-semibold flex gap-2'>Product Name 
                                <span className='italic text-red-600 font-normal text-[13px] '>Required*</span>
                            </label>
                            <input type="text" name='pId' className='hidden'/>
                            <div className='relative w-full'>
                                <IoCloseSharp className={`absolute top-[10px] right-2 bg-blue-700/50 p-[1px] rounded-full ${product.pName === '' ? 'invisible' : 'visible'}`} onClick={() => setProduct({...product, pName : '', pId: 0})}/>
                                <input type="text" name="pName" id="pName" required placeholder='Beef Steak' value={product.pName} className='h-9 w-full bg-black/10 dark:bg-white border-[1px] border-blue-600 rounded-md text-blue-700 font-semibold outline-1 pl-2 pr-8' onChange={handleInputAuto}/>
                                <ul className={`absolute top-full left-0 bg-white border-2 border-blue-500 p-1 z-20 w-full  overflow-y-auto rounded-md ${product.pName && isAutoSuggest ? "visible" : "invisible"}`}>
                                    {productList.filter(item => {
                                        const pName = product.pName.toLowerCase();
                                        const sPName = item.name.toLowerCase()
                                        return pName && sPName.includes(pName)
                                    }).map((item, index) => (
                                            <li key={index} value={item.id} className='px-2 hover:bg-graydark/30 dark:text-black' onClick={() => {setProduct({...product, pName: item.name, pId: item.id }); setIsAutoSuggest(false)}}>{item.name}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className='flex flex-col w-full '>
                            <label htmlFor="pCode" className='pb-1 pl-1 font-semibold'>Product Code</label>
                            <div className='relative w-full'>
                                {/* <IoCloseSharp className={`absolute top-[10px] right-2 bg-blue-700/50 p-[1px] rounded-full ${product.pCode === '' ? 'invisible' : 'visible'}`} onClick={() => setProduct({...product, pCode : ''})}/> */}
                                <input type="text" name="pCode" id="pCode" placeholder='' disabled title='disabled' value={product.pCode} className='h-9 w-full bg-black/10 dark:bg-white border-[1px] border-blue-600 rounded-md text-blue-700 font-semibold outline-1 pl-2 pr-8' onChange={handleInput}/>
                            </div>
                        </div>
                        <div className='flex flex-col w-full '>
                        {/* placeholder='' value={product.pImage} */}
                            <label htmlFor="pImage" className='pb-1 pl-1 font-semibold'>Product Image</label>
                            <div className='relative w-full'>
                                <IoCloseSharp className={`absolute top-[10px] right-2 bg-blue-700/50 p-[1px] rounded-full ${product.pImage === '' ? 'invisible' : 'visible'}`} onClick={() => setProduct({...product, pImage : ''})}/>
                                <input type="file" accept="image/png, image/jpeg, image/jpg, image/webp" name="pImage" id="pImage" className='h-9 w-full bg-black/10 dark:bg-white border-[1px] border-blue-600 rounded-md text-blue-700 font-semibold outline-1 pl-2 pr-8' onChange={handleInputImage}/>
                            </div>
                        </div>
                        <div className='flex flex-col w-full '>
                            <label htmlFor="pWarehouse" className='pb-1 pl-1 font-semibold flex gap-2'>Warehouse
                                <span className='italic text-red-600 font-normal text-[13px] '>Required*</span>
                            </label>
                            <div className='relative w-full'>
                                {/* <IoCloseSharp className={`absolute top-[10px] right-2 bg-blue-700/50 p-[1px] rounded-full ${product.pWarehouse === '' ? 'invisible' : 'visible'}`} onClick={() => setProduct({...product, pWarehouse : 'Choose Warehouse'})}/> */}
                                {/* <input type="text" name="pWarehouse" id="pWarehouse" placeholder='Beef Steak' value={product.pWarehouse} className='h-9 w-full bg-black/10 dark:bg-white border-[1px] border-blue-600 rounded-md text-blue-700 font-semibold outline-1 pl-2 pr-8' onChange={handleInput}/> */}
                                <select name="pWarehouse" id="pWarehouse" required className='h-9 w-full bg-black/10 dark:bg-white border-[1px] border-blue-600 rounded-md text-blue-700 font-semibold outline-1 pl-2 pr-8' onChange={handleSelect}>
                                    <option>Choose Warehouse</option>
                                    {warehouseList.map((item,index) => (
                                        <option key={index} value={`${item.id},${item.name}`} selected={product.pWarehouse === item.name}>{item.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className='flex flex-col w-full '>
                            <label htmlFor="pQuantity" className='pb-1 pl-1 font-semibold flex gap-2'>Quantity
                                <span className='italic text-red-600 font-normal text-[13px] '>Required*</span>
                            </label>
                            <div className='relative w-full'>
                                <IoCloseSharp className={`absolute top-[10px] right-2 bg-blue-700/50 p-[1px] rounded-full ${product.pQuantity === 0 || !product.pQuantity ? 'invisible' : 'visible'}`} onClick={() => setProduct({...product, pQuantity : 0})}/>
                                <input type="number" min="0" name="pQuantity" id="pQuantity" required placeholder='0' value={product.pQuantity} className='h-9 w-full bg-black/10 dark:bg-white border-[1px] border-blue-600 rounded-md text-blue-700 font-semibold outline-1 pl-2 pr-8' onChange={handleInput}/>
                            </div>
                        </div>
                        <div className='flex flex-col w-full '>
                            <label htmlFor="pQuantity" className='pb-1 pl-1 font-semibold flex gap-2'>Price
                                <span className='italic text-red-600 font-normal text-[13px] '>Required*</span>
                            </label>
                            <div className='relative w-full'>
                                <IoCloseSharp className={`absolute top-[10px] right-2 bg-blue-700/50 p-[1px] rounded-full ${product.pPrice === 0 || !product.pPrice ? 'invisible' : 'visible'}`} onClick={() => setProduct({...product, pPrice : 0})}/>
                                <input type="number" min="0" name="pPrice" id="pPrice" required placeholder='0' value={product.pPrice} className='h-9 w-full bg-black/10 dark:bg-white border-[1px] border-blue-600 rounded-md text-blue-700 font-semibold outline-1 pl-2 pr-8' onChange={handleInput}/>
                            </div>
                        </div>
                    </div>
                    <div className='h-[2px] bg-blue-600 dark:bg-white mb-2'/>
                    <div className='mt-4 flex justify-end gap-4 h-24 mb-4'>
                        <button type='submit' className='px-6  h-9 rounded-md  bg-blue-600 dark:bg-blue-500 text-white dark:text-black flex justify-center items-center'>Submit</button>
                        <button type='button' className='px-6 bg-red-600 h-9 rounded-md dark:bg-red-500 text-white dark:text-black flex justify-center items-center' onClick={handleModal}>Close</button>
                    </div>
                </form>
            </div>
    </section>
  )
}

export default ModalProduct