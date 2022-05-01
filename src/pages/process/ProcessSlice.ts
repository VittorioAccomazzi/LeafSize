import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface ImageFinalized {
    name : string,
    areas: number []
}

export interface FinalizedState {
    images : ImageFinalized []
}

const initialState : FinalizedState = {
    images : []
}

export const  finalizeSlice = createSlice ({
    name : 'finalized',
    initialState,
    reducers : {
        addImagesToFinalized : (state, action : PayloadAction<ImageFinalized[]>) =>{
            state.images.push( ...action.payload);
        },
        clearImagesFinalized : (state ) =>{
            state.images = [];
        }
    }
})

// Reducers
export const {addImagesToFinalized, clearImagesFinalized} = finalizeSlice.actions;

// selectors
export const selectFinalized = ( state : RootState )=> state.finalized.images;

export default finalizeSlice.reducer;