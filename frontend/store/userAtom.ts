import { atom } from "jotai";

export const userRoleAtom = atom<"admin" | "doctor" | "patient">("doctor");

export type UserType = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "doctor" | "patient";
};

const savedUser = localStorage.getItem("user");

export const userAtom = atom<UserType | null>(
  savedUser ? JSON.parse(savedUser) : null
);


export const setUserAtom = atom(
  null,
  (get, set, newUser: UserType | null) => {
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("user");
    }
    set(userAtom, newUser);
  }
);
