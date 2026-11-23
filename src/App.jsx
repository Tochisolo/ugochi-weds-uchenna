import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Rsvp from "./pages/Rsvp";
import SchedulePage from "./pages/SchedulePage";
import Gallery from "./pages/Gallery";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="rsvp" element={<Rsvp />} />
        <Route path="schedule" element={<SchedulePage />} />
        <Route path="gallery" element={<Gallery />} />
      </Route>
      {/* Managers only: not linked anywhere, no guest nav, protected by the server's ADMIN_KEY */}
      <Route path="manager" element={<Dashboard />} />
    </Routes>
  );
}
