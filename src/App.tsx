import { BrowserRouter, Routes, Route } from "react-router";
import { Navbar } from "@/components";
import { LinearRegressionPage, LogisticRegressionPage } from "@/pages";
import { Toaster } from "@/components/ui/sonner";

export const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<LinearRegressionPage />} />
          <Route path="/logistic" element={<LogisticRegressionPage />} />
        </Routes>
      </div>
      <Toaster position="top-center" richColors theme="light" />
    </BrowserRouter>
  );
};
