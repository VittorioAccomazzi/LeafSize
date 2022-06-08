import { useEffect, useMemo } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ImageFinalized, selectFinalized } from '../pages/process/ProcessSlice';
import { root } from './const';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// redirect to selection page if there are no files selected.
export const useAutomaticRedirect = (files : FileSystemFileHandle []|null ) => {
    const navigate = useNavigate();
    useEffect(()=> {
        if(!(files?.length)) navigate(root)
    }, []) // eslint-disable-line  react-hooks/exhaustive-deps -- shall ran only once.
}


// simple hook to select the images which still need processing from the store.

const searchElement = ( list : ImageFinalized [], name : string ) : boolean => list.findIndex(el=>el.name===name) >= 0
export const  useImagesToProcess = ( imageList : string [] ) => {
    const imgFinalized = useAppSelector(selectFinalized);
    const imagesToProcess = useMemo(()=>imageList.filter( v => !searchElement(imgFinalized,v) ) , []); // eslint-disable-line  react-hooks/exhaustive-deps -- on purpose this shall be computed only once.
    return imagesToProcess;
}
