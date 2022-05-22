import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface SettingsState {
    hue : number, // [0,255]
    saturation : number, // [0,255]
    leafVals : Set<number>,
    pathVals : Set<number>
}

const initialState : SettingsState = {
    hue:68,
    saturation:91,
    leafVals: new Set<number>(),
    pathVals: new Set<number>()
}

export const settingsSlice = createSlice({
    name : 'settings',
    initialState,
    reducers : {
        setHue : (state, action : PayloadAction<number>) => { state.hue = action.payload;},
        setSaturation : (state, action : PayloadAction<number>) => { state.saturation = action.payload;},
        addLeafVals : (state, action : PayloadAction<number[]>) => { action.payload.forEach(v=>state.leafVals.add(v))},
        addPathVals : (state, action : PayloadAction<number[]>) => { action.payload.forEach(v=>state.pathVals.add(v))},
        resetVals :   (state) => { state.leafVals = new Set<number>(); state.pathVals=new Set<number>();}
    }
});

export const {setHue, setSaturation, addLeafVals, addPathVals, resetVals} = settingsSlice.actions;

export const selectHue = ( state : RootState) => state.settings.hue;
export const selectSaturation = ( state : RootState) => state.settings.saturation;
export const selectLeafVals   = ( state : RootState) => state.settings.leafVals;
export const selectPathVals   = ( state : RootState) => state.settings.pathVals;

export default settingsSlice.reducer;