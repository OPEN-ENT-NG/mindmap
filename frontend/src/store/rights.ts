import { RightRole } from "edifice-ts-client";
import { create } from "zustand";

type UserRights = Record<RightRole, boolean>;

interface UserRightsState {
  userRights: UserRights;
  setUserRights: (rights: UserRights) => void;
}

/**
 * Basic store for managing "rights" array
 * Must be use with a custom hook
 */
export const useUserRightsStore = create<UserRightsState>((set) => ({
  userRights: {
    creator: false,
    contrib: false,
    manager: false,
    read: false,
  },
  setUserRights: (rights: UserRights) => set({ userRights: rights }),
}));
