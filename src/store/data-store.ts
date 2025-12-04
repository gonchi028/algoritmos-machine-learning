import { create } from "zustand";
import { TableData } from "@/lib/calculations";

type Store = {
  data: number[];
  orderedData: number[];
  setData: (data: number[]) => void;
  tableData: TableData[];
  setTableData: (tableData: TableData[]) => void;
};

export const useDataStore = create<Store>((set) => ({
  data: [],
  orderedData: [],
  setData: (data) => {
    set({ data });

    const orderedData = [...data];
    const n = data.length;
    let gap = Math.floor(n / 2);
    while (gap > 0) {
      for (let i = gap; i < n; i++) {
        const temp = orderedData[i];
        let j = i;
        while (j >= gap && orderedData[j - gap] > temp) {
          orderedData[j] = orderedData[j - gap];
          j -= gap;
        }
        orderedData[j] = temp;
      }
      gap = Math.floor(gap / 2);
    }
    set({ orderedData });
  },
  tableData: [],
  setTableData: (tableData) => {
    set({ tableData });
  },
}));
