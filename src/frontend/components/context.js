import { createContext, useContext } from "@wordpress/element";
export const AppContext = createContext();
export const useAppContext = () => {
	return useContext(AppContext);
};
