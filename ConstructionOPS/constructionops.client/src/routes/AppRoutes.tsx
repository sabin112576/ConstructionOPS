import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import { projectRoutes }
    from "../feautures/projects/projectRoutes";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/projects"
                            replace
                        />
                    }
                />

                {projectRoutes()}

            </Routes>
        </BrowserRouter>
    );
}