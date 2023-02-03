import "./App.css";
import Landing from "./page/Landing";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Register from "./page/Register";
import Error from "./page/Error";
import {
  AddJob,
  AllJobs,
  Profile,
  SharedLayout,
  Stats,
} from "./page/dashboard";
import { ProtectedRoute } from "./page";
function App() {
  return (
    <div>
      <BrowserRouter>
        {/* <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/register">Register</Link>
          <Link to="/landing">Home</Link>
        </nav> */}
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <SharedLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Stats />} />
            <Route path="all-jobs" element={<AllJobs />} />
            <Route path="add-job" element={<AddJob />} />
            <Route path="profile" element={<Profile />}></Route>
          </Route>
          <Route path="/register" element={<Register />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
