import React, { ReactNode,ReactElement, useEffect, useState} from 'react';
import { IoIosNotifications } from "react-icons/io";
import { MdEditNotifications } from "react-icons/md";
import { BiSolidNotification } from "react-icons/bi";
import { NavLink, useLocation, useParams } from 'react-router-dom';


const Notification = [
    {
        id : 1,
        name : 'All',
        color : 'bg-[#FF605C]',
        to : '/notification/0',
        icon : <IoIosNotifications className='text-black'/>
    },
    {
        id : 2,
        name : 'Product',
        color : 'bg-[#FFBD44]',
        to : '/notification/1',
        icon : <MdEditNotifications className='text-black'/>
    },
    {
        id : 3,
        name : 'Due Date',
        color : 'bg-[#00CA4E]',
        to : '/notification/2',
        icon : <BiSolidNotification className='text-black'/>
    },
]

type NOTIFICATION = {
    id : number,
    name : string,
    color: string,
    to: string,
    icon :ReactElement
}

const NotificationLayout: React.FC<{ children: ReactNode }> = ({ children }) => {

    const location = useLocation()
    const { pathname } = location

    // const {id} = useParams()
    // const notifId = id ? parseInt(id) : undefined;

  return (
    <div className="flex flex-col md:flex-row dark:bg-boxdark-2 dark:text-bodydark h-[100vh]">
      <div className='bg-blue-500 rounded-tl-full md:rounded-bl-full md:rounded-tr-none rounded-bl-none rounded-tr-full flex flex-row md:flex-col justify-start pl-10 pt-0 md:pl-0 md:pt-10 gap-4 '>
        {Notification.map((item : NOTIFICATION,index : number) =>(
            <NavLink to={item.to} key={index} className={`relative my-2 mx-0 md:my-0 md:mx-2 rounded-full ${item.color} justify-center items-center group ${item.to === pathname && 'translate-y-5 translate-x-0 md:translate-x-7 md:translate-y-0 border-[1px] border-white'} transition-all duration-200 delay-75`}>
                <div className='h-10 w-10 rounded-full text-2xl flex justify-center items-center'>{item.icon}</div>
                <h2 className='absolute top-full left-[-20px] md:left-full md:top-2 w-20 bg-[#1c2434] rounded-full text-white flex justify-center items-center opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100'>{item.name}</h2>
            </NavLink>
        ))
        }
      </div>
      <div className="flex flex-col w-full ">
        {children}
      </div>
    </div>
  );
};

export default NotificationLayout;
