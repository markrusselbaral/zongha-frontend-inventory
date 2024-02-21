import React, { useEffect, useState } from 'react'
import { WAREHOUSE } from '../../types/warehouse'
import { PRODUCT, PRODUCTADD, PRODUCTDATABASE } from '../../types/product';
import { IoCloseSharp} from "react-icons/io5";
import { MdAddShoppingCart} from "react-icons/md";
import { ITEMDATABASE } from '../../types/item';
import handleCapitalize from '../../components/TextCapitalize/TextCapitalize';
import axios from '../../api/axios';
import { toast } from 'react-toastify';


interface ModalProductProps {
    clickOn: (e: React.MouseEvent<HTMLDivElement>) => void;
    isOpenModal: boolean;
    handleModal: () => void;
    editId: number | null;
    productData?: PRODUCTDATABASE[];
    warehouseList: WAREHOUSE[];
    itemDataList : ITEMDATABASE[];
    handleFetchData : () => Promise<void>;
  }


const ModalProduct: React.FC<ModalProductProps> = ({ clickOn, isOpenModal, handleModal, editId, productData,warehouseList, itemDataList, handleFetchData}) => {

    const [isAutoSuggest, setIsAutoSuggest] = useState<boolean>(false)

    const [product, setProduct] =  useState<PRODUCTADD>({
        pName: "",
        pId: null,
        pCode: "",
        pWarehouse : "",
        pWarehouseId: null,
        pQuantity : null,
        pPrice : null,
    });

    const handleResetForm = () => {
        setProduct({...product, 
            pName: "",
            pId: null,
            pCode: "",
            pWarehouse : "",
            pWarehouseId: null,
            pQuantity : null,
            pPrice : null,
        })
    }

    const handleInput = (e : React.ChangeEvent<HTMLInputElement>) => {
        const inputName = e.target.name
        const inputValue = e.target.value

        setProduct({
            ...product, [inputName] : inputValue
        })
    }

    const handleInputAuto = (e : React.ChangeEvent<HTMLInputElement>) => {
        const inputName = e.target.name
        const inputValue = e.target.value

        setProduct({
            ...product, [inputName] : inputValue, pCode : ''
        })
        setIsAutoSuggest(true)
    }

    const handleSelect = (e : React.ChangeEvent<HTMLSelectElement>) => {
        const selectName = e.target.name
        const selectValue = e.target.value
        const splitSelectValue = selectValue.split(',')

        //  [selectName] : selectValue and selectValue and hinundan maong dili mu reset and form sa select akoang gipulihan ug splitSelectValue[1]
        setProduct({
            ...product, [selectName] : splitSelectValue[1], pWarehouseId : Number(splitSelectValue[0])
        })
    }

    const fetchProduct = () => {
        if(editId){
        const dataProduct  = productData?.find(item => item.id === editId)
        console.log(dataProduct)
            if(dataProduct){
                setProduct({...product, pId : dataProduct.item_id, pName : dataProduct.name, pCode: dataProduct.product_code,  pWarehouse : dataProduct.warehouse.name, pWarehouseId : dataProduct.warehouse.id, pQuantity : dataProduct.quantity, pPrice : dataProduct.price })
            }
        }else{
            setProduct({...product, pName: "", pId: 0, pCode: "",  pWarehouse : "", pWarehouseId: 0, pQuantity : 0, pPrice : 0, })
        }
    }

    useEffect(() => {
        fetchProduct()
    },[editId])

    useEffect(() => {
        if(!editId){
            // setProduct({...product, pName: "", pId: 0, pCode: "", pWarehouse : "", pWarehouseId: 0, pQuantity : 0, pPrice : 0, })
            handleResetForm()
        }
    } ,[isOpenModal === false])


    const handleSubmit = async(e : React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            if(!editId){
                const response = await axios.post('/api/product',{item_id: product.pId, quantity : product.pQuantity, price : product.pPrice, warehouse_id : product.pWarehouseId})
                console.log(response)
                toast.success(
                    `${product.pName} ${response.data.message}`,
                    {
                        position : toast.POSITION.TOP_RIGHT
                    }
                )
            }else{
                // alert("update")
                const response = await axios.put(`/api/product/${editId}`, {item_id: product.pId, quantity : product.pQuantity, price : product.pPrice, warehouse_id : product.pWarehouseId})
                console.log(response)
                toast.success(
                    `${product.pName} ${response.data.message}`,
                    {
                        position: toast.POSITION.TOP_RIGHT
                    }
                )
            }
        } catch (error) {
            console.log(error)
        }
            handleFetchData()
            handleResetForm()
            handleModal()
    }

  return (
    <section className={`relative overflow-hidden py-2 px-6 h-fit w-[90%] md:[50%] lg:w-[40%] border-2 border-blue-600 dark:border-white rounded-xl bg-white dark:bg-boxdark text-black dark:text-white ${!isOpenModal ? "invisible scale-50 opacity-0" : "visible scale-100 opacity-1"} transition-all duration-200 delay-75`} onClick={clickOn}>
            <IoCloseSharp className='absolute top-0 right-0 bg-[#ff0000] rounded-bl-xl text-white h-7 w-10 p-[3px]' onClick={handleModal}/>
            <div className='flex gap-2 text-2xl font-semibold items-center mb-2'>
                <MdAddShoppingCart />
                <h2>{editId ? "Update Product" : "Add Product"}</h2>
            </div>
            <div className='h-[2px] w-full bg-blue-600 dark:bg-white mb-2'/>
            <div className='h-full'>
                <form action="" onSubmit={handleSubmit}>
                {/* modalScroll  h-60 p-[6px] overflow-y-scroll -- para sa scroll kung gamay ang screen */}
                    <div className='flex w-full gap-1 md:gap-4 flex-col mb-6'>
                        <div className='relative flex flex-col w-full '>
                            <label htmlFor="pName" className='pb-1 pl-1 font-semibold flex gap-2'>Product Name 
                                <span className='italic text-red-600 font-normal text-[13px] '>Required*</span>
                            </label>
                            <input type="text" name='pId' className='hidden' value={product.pId ?? ''}/>
                            <div className='relative w-full'>
                                <IoCloseSharp className={`absolute top-[10px] right-2 bg-blue-700/50 p-[1px] rounded-full ${product.pName === '' ? 'invisible' : 'visible'}`} onClick={() => setProduct({...product, pName : '', pId: 0, pCode: ''})}/>
                                <input type="text" name="pName" id="pName" required placeholder='Beef Steak' value={product.pName} className='h-9 w-full bg-black/10 dark:bg-white border-[1px] border-blue-600 rounded-md text-blue-700 font-semibold outline-1 pl-2 pr-8' onChange={handleInputAuto}/>
                                <ul className={`absolute top-full left-0 bg-white border-2 border-blue-500 p-1 z-20 w-full  overflow-y-auto rounded-md ${product.pName && isAutoSuggest ? "visible" : "invisible"}`}>
                                    {itemDataList.filter(item => {
                                        const pName = product.pName.toLowerCase();
                                        const sPName = item.name.toLowerCase()
                                        return pName && sPName.includes(pName)
                                    }).length === 0 ?
                                        (
                                            <li className='px-2'>No data found</li>
                                        )
                                     :
                                        (itemDataList.filter(item => {
                                            const pName = product.pName.toLowerCase();
                                            const sPName = item.name.toLowerCase()
                                            return pName && sPName.includes(pName)
                                        }).map((item, index) => (
                                                <li key={index} value={item.id ? String(item.id) : '0'} className='px-2 hover:bg-graydark/30 dark:text-black' onClick={() => {setProduct({...product, pName: item.name, pId: item.id ?? 0, pCode:item.product_code }); setIsAutoSuggest(false)}}>{item.name}</li>
                                        )))
                                    }
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
                        {/* <div className='flex flex-col w-full '> */}
                        {/* placeholder='' value={product.pImage} */}
                            {/* <label htmlFor="pImage" className='pb-1 pl-1 font-semibold'>Product Image</label>
                            <div className='relative w-full'>
                                <IoCloseSharp className={`absolute top-[10px] right-2 bg-blue-700/50 p-[1px] rounded-full ${product.pImage === '' ? 'invisible' : 'visible'}`} onClick={() => setProduct({...product, pImage : ''})}/>
                                <input type="file" accept="image/png, image/jpeg, image/jpg, image/webp" name="pImage" id="pImage" className='h-9 w-full bg-black/10 dark:bg-white border-[1px] border-blue-600 rounded-md text-blue-700 font-semibold outline-1 pl-2 pr-8' onChange={handleInputImage}/>
                            </div>
                        </div> */}
                        <div className='flex flex-col w-full '>
                            <label htmlFor="pWarehouse" className='pb-1 pl-1 font-semibold flex gap-2'>Warehouse
                                <span className='italic text-red-600 font-normal text-[13px] '>Required*</span>
                            </label>
                            <div className='relative w-full'>
                                {/* <IoCloseSharp className={`absolute top-[10px] right-2 bg-blue-700/50 p-[1px] rounded-full ${product.pWarehouse === '' ? 'invisible' : 'visible'}`} onClick={() => setProduct({...product, pWarehouse : 'Choose Warehouse'})}/> */}
                                {/* <input type="text" name="pWarehouse" id="pWarehouse" placeholder='Beef Steak' value={product.pWarehouse} className='h-9 w-full bg-black/10 dark:bg-white border-[1px] border-blue-600 rounded-md text-blue-700 font-semibold outline-1 pl-2 pr-8' onChange={handleInput}/> */}
                                <select name="pWarehouse" id="pWarehouse" required className='h-9 w-full bg-black/10 dark:bg-white border-[1px] border-blue-600 rounded-md text-blue-700 font-semibold outline-1 pl-2 pr-8' onChange={handleSelect}>
                                    <option>Choose Warehouse</option>
                                    {warehouseList.slice(1).map((item,index) => (
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
                                <input type="number" min="0" name="pQuantity" id="pQuantity" required placeholder='0' value={product.pQuantity ?? ''} className='h-9 w-full bg-black/10 dark:bg-white border-[1px] border-blue-600 rounded-md text-blue-700 font-semibold outline-1 pl-2 pr-8' onChange={handleInput}/>
                            </div>
                        </div>
                        <div className='flex flex-col w-full '>
                            <label htmlFor="pQuantity" className='pb-1 pl-1 font-semibold flex gap-2'>Price
                                <span className='italic text-red-600 font-normal text-[13px] '>Required*</span>
                            </label>
                            <div className='relative w-full'>
                                <IoCloseSharp className={`absolute top-[10px] right-2 bg-blue-700/50 p-[1px] rounded-full ${product.pPrice === 0 || !product.pPrice ? 'invisible' : 'visible'}`} onClick={() => setProduct({...product, pPrice : 0})}/>
                                <input type="number" min="0" name="pPrice" id="pPrice" required placeholder='0' value={product.pPrice ?? ''} className='h-9 w-full bg-black/10 dark:bg-white border-[1px] border-blue-600 rounded-md text-blue-700 font-semibold outline-1 pl-2 pr-8' onChange={handleInput}/>
                            </div>
                        </div>
                    </div>
                    <div className='h-[2px] bg-blue-600 dark:bg-white mb-2'/>
                    <div className='mt-4 flex justify-end gap-4 mb-4'>
                        <button type='submit' className='px-6  h-9 rounded-md  bg-blue-600 dark:bg-blue-500 text-white dark:text-black flex justify-center items-center'>Submit</button>
                        <button type='button' className='px-6 bg-red-600 h-9 rounded-md dark:bg-red-500 text-white dark:text-black flex justify-center items-center' onClick={handleModal}>Close</button>
                    </div>
                </form>
            </div>
    </section>
  )
}

export default ModalProduct