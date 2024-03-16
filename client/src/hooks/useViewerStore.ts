import { create } from 'zustand';

type useViewerStoreProps = {
  currentViewerId: number;
  setCurrentViewerId: (id: number) => void;
  firstViewportsCount: number;
  secondViewportsCount: number;
  setFirstViewportsCount: (count: number) => void;
  setSecondViewportsCount: (count: number) => void;
  splitViewportsBy: 'cols' | 'rows';
  setSplitViewportsBy: (splitMode: 'cols' | 'rows') => void;
};

const useViewerStore = create<useViewerStoreProps>((set) => ({
  currentViewerId: 0,
  setCurrentViewerId: (id: number) => set({ currentViewerId: id }),
  firstViewportsCount: 1,
  secondViewportsCount: 0,
  setFirstViewportsCount: (count: number) =>
    set({ firstViewportsCount: count }),
  setSecondViewportsCount: (count: number) =>
    set({ secondViewportsCount: count }),
  splitViewportsBy: 'cols',
  setSplitViewportsBy: (splitMode: 'cols' | 'rows') =>
    set({ splitViewportsBy: splitMode }),
}));

export default useViewerStore;
