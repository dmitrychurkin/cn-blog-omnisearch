import { useDispatch } from "react-redux";
import { AppDispatch } from "app/type/AppDispatchType";

export default function useAppDispatch() {
  return useDispatch<AppDispatch>();
}
