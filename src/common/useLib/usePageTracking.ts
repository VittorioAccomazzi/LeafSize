import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import GA from '../utils/GA'

/**
 * tracking page view per Google Analytics.
 * original from 
 * https://stackoverflow.com/questions/34836500/how-to-set-up-google-analytics-for-react-router
 */
export default function usePageTracking() {
    const location = useLocation();
    useEffect(()=>{
        GA.pageView(location.pathname);
    },[location])
}