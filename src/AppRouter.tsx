import Selection from "./pages/selection/Selection";
import Settings from "./pages/settings/Settings";
import Process from "./pages/process/Process";
import Result from "./pages/result/Result";
import {Routes, Route, MemoryRouter} from "react-router-dom";
import { root } from "./app/const";

export default function AppRouter () {
    return (
        <MemoryRouter   initialEntries={[root]} initialIndex={1}>
            <Routes>
                <Route path="/LeafSize">
                    <Route path="" element={<Selection/>}/>
                    <Route path="settings" element={<Settings/>}/>
                    <Route path="process" element={<Process/>}/>
                    <Route path="result" element={<Result/>}/>
                </Route>
            </Routes>
        </MemoryRouter>
    )
}

