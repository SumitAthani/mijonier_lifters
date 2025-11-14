import { atom } from "jotai";

export const userRoleAtom = atom<"admin" | "doctor" | "patient">("doctor");
