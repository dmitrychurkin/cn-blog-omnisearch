import { TypedUseSelectorHook, useSelector } from "react-redux";
import { RootStateType } from "app/type/RootStateType";

const useAppSelector: TypedUseSelectorHook<RootStateType> = useSelector;

export default useAppSelector;
