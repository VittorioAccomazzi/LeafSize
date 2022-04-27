// original code from https://usehooks.com/useKeyPress/
// see also https://stackoverflow.com/questions/24108197/how-to-detect-key-pressed-in-typescript
// which clarifies that we need to use the definition of KeyboardEvent from typescript and not react !

import  { useEffect, useState } from "react";

export default function useShiftKey () {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState<boolean>(false);

  // If pressed key is our target key then set to true
  const  downHandler = ( ev : KeyboardEvent) =>{
      setKeyPressed( ev.shiftKey)
  }
  // If released key is our target key then set to false
  const upHandler = (e : KeyboardEvent) => {
    setKeyPressed( e.shiftKey);
  };

  // Add event listeners
  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return keyPressed;
}