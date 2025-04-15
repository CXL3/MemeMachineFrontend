export interface AppState {
    isAuthenticated: boolean;
    user: string | null;
  }
  
  export type AppAction =
    | { type: 'LOGIN'; payload: string }
    | { type: 'LOGOUT' };
  
  export const initialState: AppState = {
    isAuthenticated: false,
    user: null,
  };
  
  export const reducer = (state: AppState, action: AppAction): AppState => {
    switch (action.type) {
      case 'LOGIN':
        return { ...state, isAuthenticated: true, user: action.payload };
      case 'LOGOUT':
        return { ...state, isAuthenticated: false, user: null };
      default:
        return state;
    }
  };
  