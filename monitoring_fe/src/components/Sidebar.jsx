import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 h-screen bg-slate-900 text-white p-5 fixed">
      <h2 className="text-2xl font-bold mb-8">📊 Divisi Planner</h2>
      <nav className="flex flex-col gap-4">
        <Link
          to="/divisi/all-task"
          className={`p-2 rounded ${
            isActive("/divisi/all-task") ? "bg-slate-700" : ""
          }`}
        >
          📁 All Division Task
        </Link>
        <Link
          to="/divisi/my-task"
          className={`p-2 rounded ${
            isActive("/divisi/my-task") ? "bg-slate-700" : ""
          }`}
        >
          📌 My Division Task
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
