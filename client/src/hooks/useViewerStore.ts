import { create } from 'zustand';

type useViewerStoreProps = {
  currentViewerId: number;
  setCurrentViewerId: (id: number) => void;
  rows: number;
  cols: number;
  setRows: (rows: number) => void;
  setCols: (cols: number) => void;
};

const useViewerStore = create<useViewerStoreProps>((set) => ({
  currentViewerId: 0,
  setCurrentViewerId: (id: number) => set({ currentViewerId: id }),
  rows: 1,
  cols: 1,
  setRows: (rows: number) => set({ rows }),
  setCols: (cols: number) => set({ cols }),
}));

export default useViewerStore;
