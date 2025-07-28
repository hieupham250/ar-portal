import { Route, Routes } from "react-router-dom";
import ARAutoRenderer from "./components/ARAutoRenderer";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/ar/:id" element={<ARAutoRenderer />} />
      </Routes>
    </>
  );
}
