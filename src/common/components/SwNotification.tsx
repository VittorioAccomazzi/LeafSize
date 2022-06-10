
import React from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SwNotification( ){
    return (<ToastContainer style={{ width: "420px" }}
        position="bottom-right"
        autoClose={8000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        />)
}

export function onUpdate (registration: ServiceWorkerRegistration) : void {
    toast('🖐 New version available: reopen the app.');
}

export function onSuccess(registration: ServiceWorkerRegistration) : void {
    toast('🖐 You can download the app from the URL bar.');
}