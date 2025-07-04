import React, { createContext, useContext, useReducer, useEffect } from "react";

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
};

// Auth context
const AuthContext = createContext();

// Auth actions
const AUTH_ACTIONS = {
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGOUT: "LOGOUT",
  SET_LOADING: "SET_LOADING",
  SET_USER: "SET_USER",
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token on app start
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Verify token with backend
      fetch("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            dispatch({
              type: AUTH_ACTIONS.LOGIN_SUCCESS,
              payload: {
                user: data.data.user,
                token: token,
              },
            });
          } else {
            // Invalid token
            localStorage.removeItem("token");
            dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        });
    } else {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.status === "success") {
        localStorage.setItem("token", data.data.token);
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: data.data.user,
            token: data.data.token,
          },
        });
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: "Network error" };
    }
  };

  // Register function
  const register = async (name, username, password, confirmPassword) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, username, password, confirmPassword }),
      });

      const data = await response.json();

      if (data.status === "success") {
        localStorage.setItem("token", data.data.token);
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: data.data.user,
            token: data.data.token,
          },
        });
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: "Network error" };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // Update user function
  const updateUser = (userData) => {
    dispatch({
      type: AUTH_ACTIONS.SET_USER,
      payload: userData,
    });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
