import { create } from 'zustand';

import type { Biomarker, Lookup } from '@/types/settings.type';
import type { LaboratoryTest } from '@/app/(dsahboard)/settings/_components/LaboratoryTestsColumn';
import type { Modality } from '@/app/(dsahboard)/settings/_components/ModalitiesColumn';

type useSettingsStoreProps = {
  isFormOpen: boolean;
  openForm: () => void;
  closeForm: () => void;
  currentLookup: Lookup | null;
  setCurrentLookup: (lookup: Lookup | null) => void;
  currentModality: Modality | null;
  setCurrentModality: (modality: Modality | null) => void;
  currentLaboratoryTest: LaboratoryTest | null;
  setCurrentLaboratoryTest: (laboratoryTest: LaboratoryTest | null) => void;
  currentBiomarker: Biomarker | null;
  setCurrentBiomarker: (biomarker: Biomarker | null) => void;
  resetEntity: () => void;
};

const useSettingsStore = create<useSettingsStoreProps>((set) => ({
  isFormOpen: false,
  openForm: () => set({ isFormOpen: true }),
  closeForm: () => set({ isFormOpen: false }),
  currentLookup: null,
  setCurrentLookup: (lookup) => set({ currentLookup: lookup }),
  currentModality: null,
  setCurrentModality: (modality) => set({ currentModality: modality }),
  currentLaboratoryTest: null,
  setCurrentLaboratoryTest: (laboratoryTest) =>
    set({ currentLaboratoryTest: laboratoryTest }),
  currentBiomarker: null,
  setCurrentBiomarker: (biomarker) => set({ currentBiomarker: biomarker }),
  resetEntity: () =>
    set({
      currentLookup: null,
      currentModality: null,
      currentLaboratoryTest: null,
      currentBiomarker: null,
    }),
}));

export default useSettingsStore;
