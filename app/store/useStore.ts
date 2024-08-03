import { useContext } from "react";
import { StoreContext } from "./StoreProvider";


export const useStores = () => {
  return useContext(StoreContext);
};