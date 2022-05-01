import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../../app/store';
import {clearImagesFinalized} from '../process/ProcessSlice'

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
        setNumLeafs: ( state, action : PayloadAction<number>) => {
            state.numLeafs = action.payload;
        },
        setFolder: ( state, action : PayloadAction<FileSystemDirectoryHandle>) =>{
            state.folder = action.payload;
            state.files = [];
        },
        setFiles : (state, action : PayloadAction<FileSystemFileHandle[]>) => {
            state.files = action.payload;
        }
    }
})

// all the reducers here need to clear the result, if any.
export const setNumDishes = (num: number): AppThunk => (
    dispatch
  ) => {
      dispatch(selectionSlice.actions.setNumDishes(num));
      dispatch(clearImagesFinalized())
  }

  export const setNumLeafs = ( num : number ): AppThunk => (
    dispatch
  ) => {
      dispatch(selectionSlice.actions.setNumLeafs(num));
      dispatch(clearImagesFinalized())
  }

  export const setFolder = ( folder: FileSystemDirectoryHandle ): AppThunk => (
    dispatch
  ) => {
      dispatch(selectionSlice.actions.setFolder(folder));
      dispatch(clearImagesFinalized())
  }

  export const setFiles = ( files: FileSystemFileHandle [] ): AppThunk => (
    dispatch
  ) => {
      dispatch(selectionSlice.actions.setFiles(files));
      dispatch(clearImagesFinalized())
  }

// selectors
export const selectNumDishes= ( state: RootState ) => state.selection.numDishes;
export const selectNumLeafs = ( state: RootState ) => state.selection.numLeafs;
export const selectFolder   = ( state: RootState ) => state.selection.folder;
export const selectFiles    = ( state: RootState ) => state.selection.files; 

// finally export the reducers
export default selectionSlice.reducer;
