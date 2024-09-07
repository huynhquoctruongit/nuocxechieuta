import { create } from "zustand";

const useStateModal = create((set) => ({
  openLogin: false,
  openOnboarding: false,
  openRemind: false,
  setOpenRemind: (value) => set({ openRemind: value }),
  setOpenLogin: (value) => set({ openLogin: value }),
  setOpenOnboarding: (value) => set({ openOnboarding: value }),
}));

export default useStateModal;
