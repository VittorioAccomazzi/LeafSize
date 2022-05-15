import { useState } from "react";

//
// This hook is effectively used to share the state across three components.
// see details in https://towardsdev.com/react-hooks-design-pattern-c5d5e92e1055
//


export type EditModeType = {
    mode: string;
    setMode: React.Dispatch<React.SetStateAction<string>>;
}

export enum EditModes {
    Image = "image",
    Pathogen = "pathogen",
    Leaf = "leaf"
}

/**
 * set/get the state of the editing mode :
 *  - image : panning / zooming the image
 *  - pathogen : drawing the area of the pathogen
 *  - leaf : drowing the area of the leaf
 * @returns 
 */
export default function useEditMode () {
    const [mode, setMode] = useState<string>(EditModes.Image);
    return {mode, setMode}
}