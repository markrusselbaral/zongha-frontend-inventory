import React, { useEffect, useState } from 'react'
import { IoCloseSharp} from "react-icons/io5";
import axios from '../../api/axios';
import { toast } from 'react-toastify';

import { FaUserPlus } from "react-icons/fa6";
import { PRICINGPRODUCT, PRICINGCLIENT, PRICINGADD, PRICINGDATABASE } from '../../types/pricing';


interface ModalPricingProps {
    clickOn: (e: React.MouseEvent<HTMLDivElement>) => void;
    isOpenModal: boolean;
    handleModal: () => void;
    editId: number | null;
    pricingDataList: PRICINGDATABASE[];
    productList : PRICINGPRODUCT[];
    clientList : PRICINGCLIENT[];
    handleFetchData: () => Promise<void>;
  }


const ModalPricing: React.FC<ModalPricingProps> = ({ clickOn, isOpenModal, handleModal, editId,  pricingDataList, productList, clientList, /* categoryList, */ handleFetchData}) => {

    const [isAutoSuggest, setIsAutoSuggest] = useState<boolean>(false)
    const [isAutoSuggestClient, setIsAutoSuggestClient] = useState<boolean>(false)

    const [pricingData, setPricingData] =  useState<PRICINGADD>({
        item_id : null,
        item_name: "",
        name: "",
        client_id : null,
        client_name : '',
        product_id : null,
        price : null
    });

    const handleResetForm = () => {
        setPricingData({...pricingData,
            item_id : null,
            item_name: "",
            name: "",
            client_id : null,
            client_name : '',
            product_id : null,
            price : null
        });
    }



    const handleInput = (e : React.ChangeEvent<HTMLInputElement>) => {
        const inputName = e.target.name
        const inputValue = e.target.value

        setPricingData({
            ...pricingData, [inputName] : inputValue
        })
    }
    // const handleInputCapitalize = (e : React.ChangeEvent<HTMLInputElement>) => {
    //     const inputName = e.target.name
    //     const inputValue = e.target.value

    //     setClientData({
    //         ...clientData, [inputName] : handleCapitalize(inputValue)
    //     })
    // }
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

    const handleInputAuto = (e : React.ChangeEvent<HTMLInputElement>) => {
        const inputName = e.target.name
        const inputValue = e.target.value

        setPricingData({
            ...pricingData, [inputName] : inputValue, item_id : null, name: '', product_id: null
        })
        setIsAutoSuggest(true)
    }

    const handleInputAutoClient = (e : React.ChangeEvent<HTMLInputElement>) => {
        const inputName = e.target.name
        const inputValue = e.target.value

        setPricingData({
            ...pricingData, [inputName] : inputValue, client_id : null
        })
        setIsAutoSuggestClient(true)
    }

    // const handleSelect = (e : React.ChangeEvent<HTMLSelectElement>) => {
    //     const selectName = e.target.name
    //     const selectValue = e.target.value

    //     setClientData({
    //         ...clientData, [selectName] : selectValue
    //     })

    // }


    // and naghandle sa kung iupdate ang data sa Pricing
    const fetchItem = () => {
        if(editId){
            console.log(pricingDataList)
            const dataPricing  = pricingDataList.find(item => item.id === editId)
            console.log('asdfadgafffsad',dataPricing)
            if(dataPricing){
                setPricingData({...pricingData, item_id : dataPricing.product_id, product_id : dataPricing.product_id ,item_name : dataPricing.product_name, name: dataPricing.warehouse_name, client_id : dataPricing.client_id, client_name : dataPricing.client_name , price : dataPricing.price })
            }
        }else{
        //     item_id : null, item_name: "", name: "", client_id : null, client_name : '', product_id : null, price : null
            // setClientData({...clientData, name: "", tin_name : "", tin_number : '', type : ''})
            setPricingData ({...pricingData, item_id : null, item_name: "", name: "", client_id : null, client_name : '', product_id : null, price : null})
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


    const handleSubmitPricing = async(e : React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log("price data brother",pricingData)
            try {
                if(!editId){
                    const response = await axios.post('/api/pricing', {product_id: pricingData.product_id, client_id : pricingData.client_id, price : pricingData.price})
                    console.log(response)
                    toast.success(
                        `${pricingData.item_name} ${response.data.message}`,
                        {
                            position : toast.POSITION.TOP_RIGHT
                        }
                    )
                }else{
                    const response = await axios.put(`/api/pricing/${editId}`, {product_id: pricingData.product_id, client_id : pricingData.client_id, price : pricingData.price})
                    console.log(response)
                    toast.success(
                        `${pricingData.item_name} ${response.data.message}`,
                        {
                            position : toast.POSITION.TOP_RIGHT
                        }
                    )
                }

                handleResetForm()
            } catch (error: any) {
                console.log(error)
                toast.error(
                    `${pricingData.name} ${error.response.data.message}`,
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
                <h2>{editId ? "Update Pricing" : "Add Pricing"}</h2>
            </div>
            <div className='h-[2px] w-full bg-blue-600 dark:bg-white mb-2'/>
            <div className='h-full'>
                <form action="" onSubmit={handleSubmitPricing}>
                    <div className='flex w-full gap-1 md:gap-4 flex-col mb-6 h-full'>
                        <div className='relative flex flex-col w-full '>
                            <label htmlFor="item_name" className='pb-1 pl-1 font-semibold flex gap-2'>Product Name 
                                <span className='italic text-red-600 font-normal text-[13px] '>Required*{pricingData.item_id} {pricingData.product_id}</span>
                            </label>
                            <div className='relative w-full'>
                                <IoCloseSharp className={`absolute top-[10px] right-2 bg-blue-700/50 p-[1px] rounded-full ${pricingData.item_name === '' ? 'invisible' : 'visible'}`} onClick={() => setPricingData({...pricingData, item_name : '', item_id: null, name: '',product_id: null})}/>
                                <input type="text" name="item_name" id="item_name" required placeholder='Beef Steak' value={pricingData.item_name} className='h-9 w-full bg-black/10 dark:bg-white border-[1px] border-blue-600 rounded-md text-blue-700 font-semibold outline-1 pl-2 pr-8' onChange={handleInputAuto}/>
                                <ul className={`absolute top-full left-0 bg-white border-2 border-blue-500 p-1 z-20 w-full  overflow-y-auto rounded-md ${pricingData.item_name && isAutoSuggest ? "visible" : "invisible"}`}>
                                    {productList.filter(item => {
                                        const pName = pricingData.item_name.toLowerCase();
                                        const sPName = item.item.name.toLowerCase()
                                        return pName && sPName.includes(pName)
                                    }).length === 0 ?
                                        (
                                            <li className='px-2'>No data found</li>
                                        )
                                     :
                                        (productList.filter(item => {
                                            const pName = pricingData.item_name.toLowerCase();
                                            const sPName = item.item.name.toLowerCase()
                                            return pName && sPName.includes(pName)
                                        }).map((item, index) => (
                                                <li key={index} value={item.item.id ? String(item.item.id) : '0'} className='cursor-pointer px-2 hover:bg-graydark/30 dark:text-black' onClick={() => {setPricingData({...pricingData, item_name: item.item.name, item_id: item.item.id ?? 0, name : item.name,product_id:item.product_id}); setIsAutoSuggest(false)}}>{item.item.name} ({item.name})</li>
                                        )))
                                    }
                                </ul>
                            </div>
                        </div>
                        <div className='flex flex-col w-full '>
                            <label htmlFor="warehouse" className='pb-1 pl-1 font-semibold'>Warehouse</label>
                            <div className='relative w-full'>
                                {/* <IoCloseSharp className={`absolute top-[10px] right-2 bg-blue-700/50 p-[1px] rounded-full ${product.pCode === '' ? 'invisible' : 'visible'}`} onClick={() => setProduct({...product, pCode : ''})}/> */}
                                <input type="text" name="warehouse" id="warehouse" placeholder='Warehouse' disabled title='disabled' value={pricingData.name} className='h-9 w-full bg-black/10 dark:bg-white border-[1px] border-blue-600 rounded-md text-blue-700 font-semibold outline-1 pl-2 pr-8'/>
                            </div>
                        </div>
                        <div className='relative flex flex-col w-full '>
                            <label htmlFor="item_name" className='pb-1 pl-1 font-semibold flex gap-2'>Client Name 
                                <span className='italic text-red-600 font-normal text-[13px] '>Required*{pricingData.client_id}</span>
                            </label>
                            <div className='relative w-full'>
                                <IoCloseSharp className={`absolute top-[10px] right-2 bg-blue-700/50 p-[1px] rounded-full ${pricingData.client_name === '' ? 'invisible' : 'visible'}`} onClick={() => setPricingData({...pricingData, client_name : '', client_id:  null})}/>
                                <input type="text" name="client_name" id="client_name" required placeholder='Beef Steak' value={pricingData.client_name} className='h-9 w-full bg-black/10 dark:bg-white border-[1px] border-blue-600 rounded-md text-blue-700 font-semibold outline-1 pl-2 pr-8' onChange={handleInputAutoClient}/>
                                <ul className={`absolute top-full left-0 bg-white border-2 border-blue-500 p-1 z-20 w-full  overflow-y-auto rounded-md ${pricingData.client_name && isAutoSuggestClient ? "visible" : "invisible"}`}>
                                    {clientList.filter(item => {
                                        const pName = pricingData.client_name.toLowerCase();
                                        const sPName = item.name.toLowerCase()
                                        return pName && sPName.includes(pName)
                                    }).length === 0 ?
                                        (
                                            <li className='px-2'>No data found</li>
                                        )
                                     :
                                        (clientList.filter(item => {
                                            const pName = pricingData.client_name.toLowerCase();
                                            const sPName = item.name.toLowerCase()
                                            return pName && sPName.includes(pName)
                                        }).map((item, index) => (
                                                <li key={index} value={item.id ? String(item.id) : '0'} className='cursor-pointer px-2 hover:bg-graydark/30 dark:text-black' onClick={() => {setPricingData({...pricingData, client_name: item.name, client_id: item.id ?? 0}); setIsAutoSuggestClient(false)}}>{item.name}</li>
                                        )))
                                    }
                                </ul>
                            </div>
                        </div>
                        <div className='relative flex flex-col w-full '>
                            <label htmlFor="tin_number" className='pb-1 pl-1 font-semibold flex gap-2'>WholeSale Price 
                                <span className='italic text-red-600 font-normal text-[13px] '>Required*</span>
                            </label>
                            <div className='relative w-full'>
                                <IoCloseSharp className={`absolute top-[10px] right-2 bg-blue-700/50 p-[1px] rounded-full ${pricingData.price === null ? 'invisible' : 'visible'}`} onClick={() => setPricingData({...pricingData, price : null})}/>
                                <input type="text" name="price" id="price" required placeholder='0' value={pricingData.price ?? ''} className='h-9 w-full bg-black/10 dark:bg-white border-[1px] border-blue-600 rounded-md text-blue-700 font-semibold outline-1 pl-2 pr-8' onChange={handleInput}/>
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

export default ModalPricing