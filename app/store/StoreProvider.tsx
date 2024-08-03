"use client";
import React, { createContext, ReactNode } from "react";
import { RootStore } from ".";


export const StoreContext = createContext(RootStore);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  return (
    <StoreContext.Provider value={RootStore}>{children}</StoreContext.Provider>
  );
};