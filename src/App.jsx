import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Rsvp from "./pages/Rsvp";
import SchedulePage from "./pages/SchedulePage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="rsvp" element={<Rsvp />} />
        <Route path="schedule" element={<SchedulePage />} />
      </Route>
    </Routes>
  );
}
