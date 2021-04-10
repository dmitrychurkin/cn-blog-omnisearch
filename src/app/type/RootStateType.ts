import { store } from "../store";

export type RootStateType = ReturnType<typeof store.getState>;
