import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import HomePrePlanning from "./pages/Preplanning";
import TambahPesawat from "./pages/Add";
import MyTask from "./pages/MyTask";
import MyTask2 from "./pages/MyTask2";
import MyTask3 from "./pages/MyTask3";
import MyTask4 from "./pages/MyTask4";
import MyTask5 from "./pages/MyTask5";
import MyTask6 from "./pages/MyTask6";
import MyTask7 from "./pages/MyTask7";
import HomePlanner from "./pages/Planner";
import AllDivisionTask from "./pages/AllDiv";
import SidebarLayout from "./pages/SidebarLayout";
import SidebarLayout2 from "./pages/SidebarLayout2";

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Routes outside of Sidebar */}
        {/* <Route path="/home-preplanning" element={<HomePrePlanning />} />
        <Route path="/tambah-pesawat" element={<TambahPesawat />} /> */}
        <Route path="/planner" element={<SidebarLayout2 />}>
          <Route index element={<HomePlanner />} />
          <Route path="all" element={<AllDivisionTask />} />
          <Route path="my-task2" element={<MyTask2 />} />
          <Route path="my-task3" element={<MyTask3 />} />
          <Route path="my-task4" element={<MyTask4 />} />
          <Route path="my-task5" element={<MyTask5 />} />
          <Route path="my-task6" element={<MyTask6 />} />
          <Route path="my-task7" element={<MyTask7 />} />
        </Route>

        {/* Routes using SidebarLayout */}
        <Route path="/preplanning" element={<SidebarLayout />}>
          <Route index element={<HomePrePlanning />} />
          <Route path="tambah-pesawat" element={<TambahPesawat />} />
          <Route path="my-task" element={<MyTask />} />
          <Route path="all" element={<AllDivisionTask />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
