import { useState, useRef, useEffect } from 'react';
import { CATEGORY } from '../../types/category';
import { PAGINATION } from '../../types/pagination';
import DefaultLayout from '../../layout/DefaultLayout';
import Swal from 'sweetalert2';
import { toast } from "react-toastify"
import AnimatedText from '../../components/AnimatedText/AnimatedText';
import axios from '../../api/axios';
import formatDate from '../../function/FormatDate'
import Typewriter from 'typewriter-effect';
import NotificationLayout from '../../layout/NotificationLayout';
import { useParams } from 'react-router-dom';

const NotificationList = () => {


  const {id} = useParams()

  return (
    <DefaultLayout>
      <NotificationLayout>
        <div className='bg-white h-full w-full pl-0 pt-8 md:pl-8 md: pt-0'>
          <div className='bg-black/40'>
          <h2>Notificationafasdfaf{id}</h2>
ajahdjk
          </div>
        </div>
      </NotificationLayout>
    </DefaultLayout>
  );
};

export default NotificationList;
