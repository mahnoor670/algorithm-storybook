import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "./MainMenu";
import BinarySearch from "./BinarySearch";
import BubbleSort from "./BubbleSort";
import SelectionSort from "./SelectionSort";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/binary-search" element={<BinarySearch />} />
        <Route path="/bubble-sort" element={<BubbleSort />} />
        <Route path="/selection-sort" element={<SelectionSort />} />
      </Routes>
    </BrowserRouter>
  );
}