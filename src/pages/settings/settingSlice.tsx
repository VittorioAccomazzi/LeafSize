import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface SettingsState {
    hue : number, // [0,255]
    saturation : number // [0,255]
}

const initialState : SettingsState = {
    hue:68,
    saturation:91
}

export const settingsSlice = createSlice({
    name : 'settings',
    initialState,
    reducers : {
        setHue : (state, action : PayloadAction<number>) => { state.hue = action.payload;},
        setSaturation : (state, action : PayloadAction<number>) => { state.saturation = action.payload;}
    }
});

export const {setHue, setSaturation} = settingsSlice.actions;

export const selectHue = ( state : RootState) => state.settings.hue;
export const selectSaturation = (state : RootState) => state.settings.saturation;

export default settingsSlice.reducer;