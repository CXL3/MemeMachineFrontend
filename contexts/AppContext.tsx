import React, { createContext, useReducer, ReactNode } from 'react';
import { reducer, initialState, AppState, AppAction } from './reducer';

interface AppContextProps {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

export const AppContext = createContext<AppContextProps>({
  state: initialState,
  dispatch: () => null,
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
