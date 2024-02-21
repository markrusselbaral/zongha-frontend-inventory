import React, { useEffect, useState } from 'react'
import { WAREHOUSE } from '../../types/warehouse'
import { PRODUCT, PRODUCTADD, PRODUCTDATABASE } from '../../types/product';
import { IoCloseSharp} from "react-icons/io5";
import { MdAddShoppingCart} from "react-icons/md";
import { ITEMDATABASE } from '../../types/item';
import handleCapitalize from '../../components/TextCapitalize/TextCapitalize';
import axios from '../../api/axios';
import { toast } from 'react-toastify';
import { PRICINGCLIENT, PRICINGPRODUCT } from '../../types/pricing';
import { PURCHASEADD, PURCHASEDATABASE,PURCHASECLIENT, PURCHASEPRODUCT } from '../../types/purchase';
import TinFormatter from '../../components/TinFormatter/TinFormatter'

interface ModalPurchaseProps {
    clickOn: (e: React.MouseEvent<HTMLDivElement>) => void;
    isOpenModal: boolean;
    handleModal: () => void;
    editId: number | null;
    purchaseData?: PURCHASEDATABASE[];
    clientList: PURCHASECLIENT[];
    productList : PURCHASEPRODUCT[];
    // warehouseList: WAREHOUSE[];
    // itemDataList : ITEMDATABASE[];
    handleFetchData : () => Promise<void>;
  }


const ModalPurchase: React.FC<ModalPurchaseProps> = ({ clickOn, isOpenModal, handleModal, editId, purchaseData, clientList, productList, handleFetchData}) => {

    const [isAutoSuggest, setIsAutoSuggest] = useState<boolean>(false)
    const [isAutoSuggestProduct, setIsAutoSuggestProduct] = useState<boolean>(false)

    const [purchase, setPurchase] =  useState<PURCHASEADD>({
        client_id : null,
        client_name : '',
        date : '',
        mode_of_payment : '',
        product_name: '',
        price: null,
        product_code : '',
        product_id : null,
        product_quantity : null,
        quantity : null,
        status : '',
        tin_name: '',
        tin_number : '',
        total_price : null,
        type : '',
        warehouse_id : null,
        warehouse_name : '',
    });

    const handleResetForm = () => {
        setPurchase({...purchase, 
            client_id : null,
        client_name : '',
        date : '',
        mode_of_payment : '',
        product_name: '',
        price: null,
        product_code : '',
        product_id : null,
        product_quantity : null,
        quantity : null,
        status : '',
        tin_name: '',
        tin_number : '',
        total_price : null,
        type : '',
        warehouse_id : null,
        warehouse_name : '',
        })
        setQuantityValid('')
    }

    const handleInput = (e : React.ChangeEvent<HTMLInputElement>) => {
        const inputName = e.target.name
        const inputValue = e.target.value

        setPurchase({
            ...purchase, [inputName] : inputValue
        })
    }

    const handleInputAuto = (e : React.ChangeEvent<HTMLInputElement>) => {
        const inputName = e.target.name
        const inputValue = e.target.value

        setPurchase({
            ...purchase, [inputName] : inputValue , client_id : null, tin_name : '', tin_number : '', type : '', product_name : '', product_id: null, warehouse_name : '', price : null, product_quantity : null,quantity : null
        })
        setIsAutoSuggest(true)
    }

    const handleInputAutoProduct = (e : React.ChangeEvent<HTMLInputElement>) => {
        const inputName = e.target.name
        const inputValue = e.target.value

        setPurchase({
            ...purchase, [inputName] : inputValue , product_id : null, warehouse_name : '',price : null, product_quantity : null, quantity : null
        })
        setQuantityValid('')
        setIsAutoSuggestProduct(true)
    }

    const handleSelect = (e : React.ChangeEvent<HTMLSelectElement>) => {
        const selectName = e.target.name
        const selectValue = e.target.value

        //  [selectName] : selectValue and selectValue and hinundan maong dili mu reset and form sa select akoang gipulihan ug splitSelectValue[1]
        setPurchase({
            ...purchase, [selectName] : selectValue
        })
    }

    const [quantityValid, setQuantityValid] = useState<string>('')

    const handleInputQuantity = (e : React.ChangeEvent<HTMLInputElement>) => {
        const inputName = e.target.name
        const inputValue = e.target.value

        // if(purchase.product_quantity){
            // if(purchase.product_quantity > parseInt(inputValue)){
            //     setQuantityValid('')
            //     setPurchase({
            //         ...purchase, [inputName] : inputValue
            //     })
            // }else{
            //     setQuantityValid('Stock error')
            //     setPurchase({
            //         ...purchase, [inputName] : purchase.product_quantity
            //     })
            // }
        // }

        if(purchase.product_quantity){
            if (purchase.product_quantity > parseInt(inputValue)) {
                setQuantityValid('');
                setPurchase({
                    ...purchase,
                    [inputName]: inputValue
                });
            // totalPrice()
            } else {
                setQuantityValid('Limited Stock');
                if (parseInt(inputValue) > purchase.product_quantity) {
                    setPurchase({
                        ...purchase,
                        [inputName]: purchase.product_quantity.toString() // Display product_quantity
                    });
                    // alert('limited')
                    // totalPrice()
                } else {
                    setQuantityValid('');
                    setPurchase({
                        ...purchase,
                        [inputName]: inputValue // Allow to erase if input value is within range
                    });
                    // alert('unlimited')
                    // totalPrice()
                }
            }
        }   
    }
    useEffect(() => {
        if(purchase.quantity && purchase.price){
            const priceTotal = purchase.quantity * purchase.price
            console.log(priceTotal.toLocaleString())
            setPurchase({...purchase, total_price : priceTotal})
        }else{
            setPurchase({...purchase, total_price : null})
        }
    },[purchase.quantity, purchase.price])

    const formatDate = (date : string) => {
        const dateObj = new Date(date);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();
    
        return `${year}-${month}-${day}`;
    }
    

    const fetchProduct = () => {
        if(editId){
        const dataProduct  = purchaseData?.find(item => item.id === editId)
        console.log("dataProductttt",editId,dataProduct)
            if(dataProduct){
                setPurchase({...purchase, 
                    client_id : dataProduct.client_id,
                    client_name : dataProduct.client_name,
                    date : formatDate(dataProduct.date),
                    mode_of_payment : dataProduct.mode_of_payment,
                    product_name: dataProduct.name,
                    price: dataProduct.price,
                    product_code : dataProduct.product_code,
                    product_id : dataProduct.product_id,
                    product_quantity : dataProduct.product_quantity,
                    quantity : dataProduct.quantity,
                    status : dataProduct.status,
                    tin_name: dataProduct.tin_name,
                    tin_number : dataProduct.tin_number,
                    total_price : dataProduct.total_price,
                    type : dataProduct.type,
                    warehouse_id : null,
                    warehouse_name : dataProduct.warehouse_name,
                })
            }
        }else{
            // setProduct({...product, pName: "", pId: 0, pCode: "",  pWarehouse : "", pWarehouseId: 0, pQuantity : 0, pPrice : 0, })
        }
    }

    useEffect(() => {
        fetchProduct()
    },[editId])

//   const handleClientProductList = async() => {
//     try {
//       const response = await axios.get('/api/purchase/create?client_id=1&product_id=1')
//       console.log("clientlist",response)
//       // setClientList(response.data.clients)
//       // console.log("productlist",response.data.products)
//       // setProductList(response.data)
//     } catch (error) {
//       console.log(error)
//     }
//   }

    useEffect(() => {
        if(!editId){
            // setProduct({...product, pName: "", pId: 0, pCode: "", pWarehouse : "", pWarehouseId: 0, pQuantity : 0, pPrice : 0, })
            handleResetForm()
        }
    } ,[isOpenModal === false])


    const handleSubmit = async(e : React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log("PURCHASE",purchase)
            try {
                if(!editId){
                    if(purchase.client_id){
                        const response = await axios.post('/api/purchase',{
                            date : purchase.date,
                            product_id : purchase.product_id,
                            client_id : purchase.client_id,
                            name : purchase.client_name,
                            type : purchase.type,
                            price : purchase.price,
                            quantity : purchase.quantity,
                            total_price : purchase.total_price,
                            status : purchase.status,
                            mode_of_payment : purchase.mode_of_payment
                        })
                        console.log(response)
                        toast.success(
                            `Purchase ${response.data.message}`,
                            {
                                position : toast.POSITION.TOP_RIGHT
                            }
                        )
                    }else{
                        const response = await axios.post('/api/purchase',{
                            date : purchase.date,
                            product_id : purchase.product_id,
                            client_id : null,
                            name : purchase.client_name,
                            price : purchase.price,
                            type : 'Retail',
                            quantity : purchase.quantity,
                            total_price : purchase.total_price,
                            status : purchase.status,
                            mode_of_payment : purchase.mode_of_payment
                        })
                        console.log("add without client id",response)
                        toast.success(
                            `Purchase ${response.data.message}`,
                            {
                                position : toast.POSITION.TOP_RIGHT
                            }
                        )
                    }
                }else{
                    // alert("update")
                    const response = await axios.put(`/api/purchase/${editId}`,{
                        date : purchase.date,
                        product_id : purchase.product_id,
                        client_id : purchase.client_id,
                        type : purchase.type,
                        price : purchase.price,
                        quantity : purchase.quantity,
                        total_price : purchase.total_price,
                        status : purchase.status,
                        mode_of_payment : purchase.mode_of_payment
                    })
                    console.log(response)
                    toast.success(
                        `Purchase ${response.data.message}`,
                        {
                            position : toast.POSITION.TOP_RIGHT
                        }
                    )
                    // const response = await axios.put(`/api/product/${editId}`, {item_id: product.pId, quantity : product.pQuantity, price : product.pPrice, warehouse_id : product.pWarehouseId})
                    // console.log(response)
                    // toast.success(
                    //     `${product.pName} ${response.data.message}`,
                    //     {
                    //         position: toast.POSITION.TOP_RIGHT
                    //     }
                    // )
                }
            } catch (error) {
                console.log(error)
            }
            handleFetchData()
            handleResetForm()
            handleModal()
    }

    const handleClientSuggest = async(item : PURCHASECLIENT, id: number) => {
        console.log(id)
        setIsAutoSuggest(false)
        try {
            const response = await axios.get(`/api/purchase/create?client_id=${id}&product_id=${purchase.product_id}`)
            console.log("api/client", response)
            const responseData = response.data.data
            setPurchase({...purchase, price : responseData.price, tin_name : responseData.tin_name, tin_number : responseData.tin_number, type : responseData.type,client_name: handleCapitalize(item.name), client_id: item.id ?? 0})
        } catch (error) {
            console.log(error)
        }
        // setPurchase({...purchase, client_name: handleCapitalize(item.name), client_id: item.id ?? 0});
    }

    const handleProductSuggest = async(item : PURCHASEPRODUCT, id: number) => {
        console.log(id)
        setIsAutoSuggestProduct(false)
        try {
            const response = await axios.get(`/api/purchase/create?client_id=${purchase.client_id}&product_id=${id}`)
            console.log("api/client", response)
            const responseData = response.data.data
            setPurchase({...purchase, product_quantity : responseData.quantity, price : responseData.price, tin_name : responseData.tin_name, tin_number : responseData.tin_number, type : responseData.type, product_name: item.item.name, product_id: item.product_id ?? 0 , warehouse_name : item.name})
        } catch (error) {
            console.log(error)
        }
        // setPurchase({...purchase, client_name: handleCapitalize(item.name), client_id: item.id ?? 0});
    }


  return (
    <section className={`relative overflow-hidden py-2 px-6 h-fit w-[90%] md:w-[90%] lg:w-[70%] border-2 border-blue-600 dark:border-white rounded-xl bg-white dark:bg-boxdark text-black dark:text-white ${!isOpenModal ? "invisible scale-50 opacity-0" : "visible scale-100 opacity-1"} transition-all duration-200 delay-75`} onClick={clickOn}>
            <IoCloseSharp className='absolute top-0 right-0 bg-[#ff0000] rounded-bl-xl text-white h-7 w-10 p-[3px]' onClick={handleModal}/>
            <div className='flex gap-2 text-2xl font-semibold items-center mb-2'>
                <MdAddShoppingCart />
                <h2>{editId ? "Update Purchase" : "Add Purchase"}</h2>
            </div>
            <div className='h-[2px] w-full bg-blue-600 dark:bg-white mb-2'/>
            <div className='h-full'>
                <form action="" onSubmit={handleSubmit}>
                {/* modalScroll  h-60 p-[6px] overflow-y-scroll -- para sa scroll kung gamay ang screen */}
                    <div className='modalScroll flex gap-1 md:gap-4 flex-col md:flex-row h-[60vh] overflow-y-auto md:h-fit'>
                        <div className='flex w-full gap-1 md:gap-4 flex-col mb-6'>
                            <div className='flex flex-col w-full '>
                                <label htmlFor="date" className='pb-1 pl-1 font-semibold'>Date</label>
                                <div className='relative w-full'>
                                    <IoCloseSharp className={`absolute top-[10px] right-2 bg-blue-700/50 p-[1px] rounded-full ${purchase.date === '' ? 'invisible' : 'visible'}`} onClick={() => setPurchase({...purchase, date : ''})}/>
                                    <input type="date" name="date" id="date" placeholder='' value={purchase.date} className='h-9 w-full bg-black/10 dark:bg-white border-[1px] border-blue-600 rounded-md text-blue-700 font-semibold outline-1 pl-2 pr-8' onChange={handleInput}/>
                                </div>
                            </div>
                            <div className='relative flex flex-col w-full '>
                                <label htmlFor="client_name" className='pb-1 pl-1 font-semibold flex gap-2'>Client Name {/*{purchase.tin_name}{purchase.tin_number}{purchase.type}*/}
                                    <span className='italic text-red-600 font-normal text-[13px] '>Required*{purchase.client_id}</span>
                                </label>
                                {/* <input type="text" name='pId' className='hidden' value={product.pId ?? ''}/> */}
                                <div className='relative w-full'>
                                    <IoCloseSharp className={`absolute top-[10px] right-2 bg-blue-700/50 p-[1px] rounded-full ${purchase.client_name === '' ? 'invisible' : 'visible'}`} onClick={() => setPurchase({...purchase, client_name : '', client_id: null,tin_name : '', tin_number : '', type : '', product_name : '', product_id: null, warehouse_name : '', price : null, product_quantity : null, quantity : null})}/>
                                    <input type="text" name="client_name" id="client_name" required placeholder='Juan Dela Cruz' value={purchase.client_name} className='h-9 w-full bg-black/10 dark:bg-white border-[1px] border-blue-600 rounded-md text-blue-700 font-semibold outline-1 pl-2 pr-8' onChange={handleInputAuto} />
                                    <ul className={`absolute top-full left-0 bg-white border-2 border-blue-500 p-1 z-20 w-full  overflow-y-auto rounded-md ${purchase.client_name && isAutoSuggest ? "visible" : "invisible"}`}>
                                        {clientList.filter(item => {
                                            const pName = purchase.client_name.toLowerCase();
                                            const sPName = item.name.toLowerCase()
                                            return pName && sPName.includes(pName)
                                        }).length === 0 ?
                                            (
                                                <li className='relative px-2'>No data found <IoCloseSharp className='absolute top-[5px] right-1 bg-blue-700/50 p-[1px] rounded-full' onClick={() => setIsAutoSuggest(false)}/></li>
                                            )
                                        :
                                            (clientList.filter(item => {
                                                const pName = purchase.client_name.toLowerCase();
                                                const sPName = item.name.toLowerCase()
                                                return pName && sPName.includes(pName)
                                            }).map((item, index) => (
                                                    <li key={index} value={item.id ? String(item.id) : '0'} className='px-2 hover:bg-graydark/30 dark:text-black' onClick={() => {handleClientSuggest(item, item.id)}}>{item.name}</li>
                                            )))
                                        }
                                    </ul>
                                </div>
                            </div>
                            <div className='flex flex-col w-full '>
                                <label htmlFor="" className='pb-1 pl-1 font-semibold flex gap-2'>Client Information</label>
                                <div className='relative w-full h-9 flex'>
                                    <h2 className='w-1/2 font-semibold'>Tin Name:<span className='font-normal'> {purchase.tin_name}</span></h2>
                                    <h2 className='font-semibold'>Tin Number:<span className='font-normal'> {purchase.tin_number}</span></h2>
                                </div>
                            </div>
                            
                            <div className='flex flex-col w-full '>
                                <label htmlFor="mode_of_payment" className='pb-1 pl-1 font-semibold flex gap-2'>Mode of Payment
                                    <span className='italic text-red-600 font-normal text-[13px] '>Required*</span>
                                </label>
                                <div className='relative w-full'>
                                    {/* <IoCloseSharp className={`absolute top-[10px] right-2 bg-blue-700/50 p-[1px] rounded-full ${product.pWarehouse === '' ? 'invisible' : 'visible'}`} onClick={() => setProduct({...product, pWarehouse : 'Choose Warehouse'})}/> */}
                                    {/* <input type="text" name="pWarehouse" id="pWarehouse" placeholder='Beef Steak' value={product.pWarehouse} className='h-9 w-full bg-black/10 dark:bg-white border-[1px] border-blue-600 rounded-md text-blue-700 font-semibold outline-1 pl-2 pr-8' onChange={handleInput}/> */}
                                    <select name="mode_of_payment" id="mode_of_payment" required className='h-9 w-full bg-black/10 dark:bg-white border-[1px] border-blue-600 rounded-md text-blue-700 font-semibold outline-1 pl-2 pr-8' value={purchase.mode_of_payment} onChange={handleSelect}>
                                        <option>Choose Mode Payment</option>
                                        <option value='Gcash'>Gcash</option>
                                        <option value='Seabank'>Seabank</option>
                                    </select>
                                </div>
                            </div>
                            <div className='flex flex-col w-full '>
                                <label htmlFor="status" className='pb-1 pl-1 font-semibold flex gap-2'>Status
                                    <span className='italic text-red-600 font-normal text-[13px] '>Required*</span>
                                </label>
                                <div className='relative w-full'>
                                    {/* <IoCloseSharp className={`absolute top-[10px] right-2 bg-blue-700/50 p-[1px] rounded-full ${product.pWarehouse === '' ? 'invisible' : 'visible'}`} onClick={() => setProduct({...product, pWarehouse : 'Choose Warehouse'})}/> */}
                                    {/* <input type="text" name="pWarehouse" id="pWarehouse" placeholder='Beef Steak' value={product.pWarehouse} className='h-9 w-full bg-black/10 dark:bg-white border-[1px] border-blue-600 rounded-md text-blue-700 font-semibold outline-1 pl-2 pr-8' onChange={handleInput}/> */}
                                    <select name="status" id="status" required className='h-9 w-full bg-black/10 dark:bg-white border-[1px] border-blue-600 rounded-md text-blue-700 font-semibold outline-1 pl-2 pr-8' value={purchase.status} onChange={handleSelect}>
                                        <option>Choose Status</option>
                                        <option value='Paid'>Paid</option>
                                        <option value='Unpaid'>Unpaid</option>
                                        <option value='Pending'>Pending</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className='flex w-full gap-1 md:gap-4 flex-col mb-6'>
                            <div className='relative flex flex-col w-full '>
                                <label htmlFor="product_name" className='pb-1 pl-1 font-semibold flex gap-2'>Product Name 
                                    <span className='italic text-red-600 font-normal text-[13px] '>Required*{purchase.product_id}</span>
                                </label>
                                {/* <input type="text" name='pId' className='hidden' value={product.pId ?? ''}/> */}
                                <div className='relative w-full'>
                                    <IoCloseSharp className={`absolute top-[10px] right-2 bg-blue-700/50 p-[1px] rounded-full ${purchase.product_name === '' ? 'invisible' : 'visible'}`} onClick={() => {setPurchase({...purchase, product_name : '', product_id: null, warehouse_name : '', price : null, product_quantity : null, quantity : null}); setQuantityValid('')}}/>
                                    <input type="text" name="product_name" id="product_name" required placeholder='Beef Steak' value={purchase.product_name} className='h-9 w-full bg-black/10 dark:bg-white border-[1px] border-blue-600 rounded-md text-blue-700 font-semibold outline-1 pl-2 pr-8' onChange={handleInputAutoProduct}/>
                                    <ul className={`absolute top-full left-0 bg-white border-2 border-blue-500 p-1 z-20 w-full  overflow-y-auto rounded-md ${purchase.product_name && isAutoSuggestProduct ? "visible" : "invisible"}`}>
                                        {productList.filter(item => {
                                            const pName = purchase.product_name.toLowerCase();
                                            const sPName = item.item.name.toLowerCase()
                                            return pName && sPName.includes(pName)
                                        }).length === 0 ?
                                            (
                                                <li className='px-2'>No data found</li>
                                            )
                                        :
                                            (productList.filter(item => {
                                                const pName = purchase.product_name.toLowerCase();
                                                const sPName = item.item.name.toLowerCase()
                                                return pName && sPName.includes(pName)
                                            }).map((item, index) => (
                                                    <li key={index} value={item.product_id ? String(item.product_id) : '0'} className='px-2 hover:bg-graydark/30 dark:text-black' onClick={() => {handleProductSuggest(item,item.product_id)}}>{item.item.name} ({item.name})</li>
                                            )))
                                        }
                                    </ul>
                                </div>
                            </div>
                            <div className='flex flex-col w-full '>
                                <label htmlFor="warehouse_name" className='pb-1 pl-1 font-semibold'>Warehouse</label>
                                <div className='relative w-full'>
                                    {/* <IoCloseSharp className={`absolute top-[10px] right-2 bg-blue-700/50 p-[1px] rounded-full ${purchase.date === '' ? 'invisible' : 'visible'}`} onClick={() => setPurchase({...purchase, date : ''})}/> */}
                                    <input type="text" name="warehouse_name" id="warehouse_name" disabled title='Disabled' placeholder='' value={purchase.warehouse_name} className='h-9 w-full bg-black/10 dark:bg-white border-[1px] border-blue-600 rounded-md text-blue-700 font-semibold outline-1 pl-2 pr-8' onChange={handleInput}/>
                                </div>
                            </div>
                            <div className='flex flex-col w-full '>
                                <label htmlFor="price" className='pb-1 pl-1 font-semibold'>Price</label>
                                <div className='relative w-full'>
                                    {/* <IoCloseSharp className={`absolute top-[10px] right-2 bg-blue-700/50 p-[1px] rounded-full ${purchase.date === '' ? 'invisible' : 'visible'}`} onClick={() => setPurchase({...purchase, date : ''})}/> */}
                                    <input type="text" name="price" id="price" disabled title='Disabled' placeholder='' value={purchase.price ?? ''} className='h-9 w-full bg-black/10 dark:bg-white border-[1px] border-blue-600 rounded-md text-blue-700 font-semibold outline-1 pl-2 pr-8' onChange={handleInput}/>
                                </div>
                            </div>
                            <div className='flex flex-col w-full '>
                                <label htmlFor="quantity" className='pb-1 pl-1 font-semibold'>Quantity 
                                <span className='italic text-red-600 font-normal text-[13px] '> ({purchase.product_quantity} kg) {quantityValid}</span>
                                </label>
                                <div className='relative w-full'>
                                    <IoCloseSharp className={`absolute top-[10px] right-2 bg-blue-700/50 p-[1px] rounded-full ${purchase.quantity === null ? 'invisible' : 'visible'}`} onClick={() => {setQuantityValid('');setPurchase({...purchase, quantity : null})}}/>
                                    <input type="number" min={0} name="quantity" id="quantity" placeholder='' value={purchase.quantity ?? ''} className='h-9 w-full bg-black/10 dark:bg-white border-[1px] border-blue-600 rounded-md text-blue-700 font-semibold outline-1 pl-2 pr-8' onChange={handleInputQuantity}/>
                                </div>
                            </div>
                            <div className='flex flex-col w-full '>
                                <label htmlFor="total_price" className='pb-1 pl-1 font-semibold'>Total Price 
                                {/* <span className='italic text-red-600 font-normal text-[13px] '> ({purchase.product_quantity} kg) {quantityValid}</span> */}
                                </label>
                                <div className='relative w-full'>
                                    <IoCloseSharp className={`absolute top-[10px] right-2 bg-blue-700/50 p-[1px] rounded-full ${purchase.total_price === null ? 'invisible' : 'visible'}`} onClick={() => {setQuantityValid('');setPurchase({...purchase, total_price : null})}}/>
                                    <input type="number" min={0} name="total_price" id="total_price" placeholder='' value={purchase.total_price ?? ''} className='h-9 w-full bg-black/10 dark:bg-white border-[1px] border-blue-600 rounded-md text-blue-700 font-semibold outline-1 pl-2 pr-8' onChange={handleInput}/>
                                </div>
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

export default ModalPurchase

