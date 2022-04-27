import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface SelectionState {
    numDishes : number;
    numLeafs  : number;
    folder    : FileSystemDirectoryHandle|null;
    files     : FileSystemFileHandle[]|null
}

const initialState : SelectionState ={
    numDishes : 4,
    numLeafs : 2,
    folder : null,
    files : null
}

export const  selectionSlice = createSlice ({
    name : 'selection',
    initialState,
    reducers : {
        setNumDishes : (state, action : PayloadAction<number>) =>{
            state.numDishes = action.payload;
        },
        setNumLeafs : ( state, action : PayloadAction<number>) => {
            state.numLeafs = action.payload;
        },
        setFolder : ( state, action : PayloadAction<FileSystemDirectoryHandle>) =>{
            state.folder = action.payload;
            state.files = [];
        },
        setFiles : (state, action : PayloadAction<FileSystemFileHandle[]>) => {
            state.files = action.payload;
        }
    }
})

// Reducers
export const { setNumDishes, setNumLeafs, setFolder, setFiles } = selectionSlice.actions;

// selectors
export const selectNumDishes= ( state: RootState ) => state.selection.numDishes;
export const selectNumLeafs = ( state: RootState ) => state.selection.numLeafs;
export const selectFolder   = ( state: RootState ) => state.selection.folder;
export const selectFiles    = ( state: RootState ) => state.selection.files; 

// finally export the reducers
export default selectionSlice.reducer;
