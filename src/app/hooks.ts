import { useEffect } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
    }, []) 
}
