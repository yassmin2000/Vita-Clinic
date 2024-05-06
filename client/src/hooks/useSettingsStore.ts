import { create } from 'zustand';

import type {
  Biomarker,
  LaboratoryTest,
  Lookup,
  Medication,
  PriceLookup,
  Therapy,
} from '@/types/settings.type';

type useSettingsStoreProps = {
  isFormOpen: boolean;
  openForm: () => void;
  closeForm: () => void;
  currentLookup: Lookup | null;
  setCurrentLookup: (lookup: Lookup | null) => void;
  currentMedication: Medication | null;
  setCurrentMedication: (medication: Medication | null) => void;
  currentPriceLookup: PriceLookup | null;
  setCurrentPriceLookup: (priceLookup: PriceLookup | null) => void;
  currentTherapy: Therapy | null;
  setCurrentTherapy: (therapy: Therapy | null) => void;
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
  currentMedication: null,
  setCurrentMedication: (medication) => set({ currentMedication: medication }),
  currentPriceLookup: null,
  setCurrentPriceLookup: (priceLookup) =>
    set({ currentPriceLookup: priceLookup }),
  currentTherapy: null,
  setCurrentTherapy: (therapy) => set({ currentTherapy: therapy }),
  currentLaboratoryTest: null,
  setCurrentLaboratoryTest: (laboratoryTest) =>
    set({ currentLaboratoryTest: laboratoryTest }),
  currentBiomarker: null,
  setCurrentBiomarker: (biomarker) => set({ currentBiomarker: biomarker }),
  resetEntity: () =>
    set({
      currentLookup: null,
      currentPriceLookup: null,
      currentTherapy: null,
      currentLaboratoryTest: null,
      currentBiomarker: null,
    }),
}));

export default useSettingsStore;
