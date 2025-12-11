import { NavLink } from "react-router";
import { TrendingUp, Binary } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-800">
              Algoritmos ML
            </span>
          </div>
          <div className="flex space-x-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              <TrendingUp className="h-4 w-4" />
              <span>Regresión Lineal</span>
            </NavLink>
            <NavLink
              to="/logistic"
              className={({ isActive }) =>
                `flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              <Binary className="h-4 w-4" />
              <span>Regresión Logística</span>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};
