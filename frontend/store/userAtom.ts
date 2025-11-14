import { atom } from "jotai";

export type UserType = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "doctor" | "patient";
  hospital: string;
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
