import { useDispatch } from "react-redux";
import { AppDispatchType } from "app/type/AppDispatchType";

export default function useAppDispatch() {
  return useDispatch<AppDispatchType>();
}
