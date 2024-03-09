import { create } from 'zustand';

type UseTableOptions = {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  countPerPage: number;
  setCountPerPage: (count: number) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  searchValue: string;
  setSearchValue: (searchValue: string) => void;
  currentGender: string;
  setCurrentGender: (gender: 'all' | 'male' | 'female') => void;
  currentStatus: string;
  setCurrentStatus: (status: 'all' | 'active' | 'inactive') => void;
  reset: () => void;
};

export const useTableOptions = create<UseTableOptions>((set) => ({
  currentPage: 1,
  setCurrentPage: (page) => set({ currentPage: page }),
  countPerPage: 10,
  setCountPerPage: (count) => set({ countPerPage: count }),
  sortBy: 'joinedAt-desc',
  setSortBy: (sortBy) => set({ sortBy }),
  searchValue: '',
  setSearchValue: (searchValue) => set({ searchValue }),
  currentGender: 'all',
  setCurrentGender: (gender) => set({ currentGender: gender }),
  currentStatus: 'all',
  setCurrentStatus: (status) => set({ currentStatus: status }),
  reset: () =>
    set({
      currentPage: 1,
      countPerPage: 10,
      sortBy: 'joinedAt-desc',
      searchValue: '',
      currentGender: 'all',
      currentStatus: 'all',
    }),
}));
