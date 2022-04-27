import Selection from "./pages/selection/Selection";
import Settings from "./pages/settings/Settings";
import Process from "./pages/process/Process";
import Result from "./pages/result/Result";
import {Routes, Route, BrowserRouter} from "react-router-dom";

export default function () {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Selection/>}/>
                <Route path="settings" element={<Settings/>}/>
                <Route path="process" element={<Process/>}/>
                <Route path="result" element={<Result/>}/>
            </Routes>
        </BrowserRouter>
    )
}