import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "./MainMenu";
import BinarySearch from "./BinarySearch";
import BubbleSort from "./BubbleSort";
import SelectionSort from "./SelectionSort";
import InsertionSort from "./InsertionSort";
import MergeSort from "./MergeSort";
import QuickSort from "./QuickSort";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/binary-search" element={<BinarySearch />} />
        <Route path="/bubble-sort" element={<BubbleSort />} />
        <Route path="/selection-sort" element={<SelectionSort />} />
        <Route path="/insertion-sort" element={<InsertionSort />} />
        <Route path="/merge-sort" element={<MergeSort />} />
        <Route path="/quick-sort" element={<QuickSort />} />

        
      </Routes>
    </BrowserRouter>
  );
}