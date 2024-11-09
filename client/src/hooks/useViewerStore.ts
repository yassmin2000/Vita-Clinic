import { create } from 'zustand';

interface ViewerStore {
  isCornerstoneInitialized: boolean;
  setIsCornerstoneInitialized: (isInitialized: boolean) => void;
  currentViewerId: number;
  setCurrentViewerId: (id: number) => void;
  layoutType: string;
  setLayoutType: (layoutType: string) => void;
  selectedSeries: string[];
  setSelectedSeries: (series: string[]) => void;
  setSelectedSeriesByIndex: (index: number, seriesId: string) => void;
}

const useViewerStore = create<ViewerStore>((set) => ({
  isCornerstoneInitialized: false,
  setIsCornerstoneInitialized: (isInitialized: boolean) =>
    set({ isCornerstoneInitialized: isInitialized }),
  currentViewerId: 0,
  setCurrentViewerId: (id: number) => set({ currentViewerId: id }),
  layoutType: '1_big',
  setLayoutType: (layoutType: string) => set({ layoutType }),
  selectedSeries: [],
  setSelectedSeries: (series: string[]) => set({ selectedSeries: series }),
  setSelectedSeriesByIndex: (index: number, seriesId: string) =>
    set((state) => {
      const series = [...state.selectedSeries];
      series[index] = seriesId;
      return { selectedSeries: series };
    }),
}));

export default useViewerStore;
