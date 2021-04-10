import { useStore } from "react-redux";
import { RootStateType } from "app/type/RootStateType";

export default function useAppStore() {
  return useStore<RootStateType>();
}
