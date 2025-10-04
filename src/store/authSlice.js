import { createSlice } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const initialState = {
  user: null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const listenToAuth = () => (dispatch) => {
  dispatch(authSlice.actions.setStatus("loading"));
  onAuthStateChanged(auth, async (fbUser) => {
    if (fbUser) {
      // Fetch user data from Firestore to get the name
      try {
        const userDoc = await getDoc(doc(db, "users", fbUser.uid));
        const userData = userDoc.data();
        const user = { 
          uid: fbUser.uid, 
          email: fbUser.email,
          name: userData?.name || null
        };
        dispatch(authSlice.actions.setUser(user));
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Fallback to basic user data if Firestore fetch fails
        const user = { uid: fbUser.uid, email: fbUser.email, name: null };
        dispatch(authSlice.actions.setUser(user));
      }
    } else {
      dispatch(authSlice.actions.setUser(null));
    }
    dispatch(authSlice.actions.setStatus("idle"));
  });
};

export const register = (name, email, password) => async (dispatch) => {
  dispatch(authSlice.actions.setStatus("loading"));
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Store user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: email,
      createdAt: new Date()
    });
    
    dispatch(authSlice.actions.setStatus("idle"));
  } catch (e) {
    dispatch(authSlice.actions.setError(e.message));
    dispatch(authSlice.actions.setStatus("idle"));
  }
};

export const login = (email, password) => async (dispatch) => {
  dispatch(authSlice.actions.setStatus("loading"));
  try {
    await signInWithEmailAndPassword(auth, email, password);
    dispatch(authSlice.actions.setStatus("idle"));
  } catch (e) {
    dispatch(authSlice.actions.setError(e.message));
    dispatch(authSlice.actions.setStatus("idle"));
  }
};

export const logout = () => async (dispatch) => {
  dispatch(authSlice.actions.setStatus("loading"));
  try {
    await signOut(auth);
    dispatch(authSlice.actions.setUser(null));
    // Clear tasks when user logs out
    dispatch({ type: 'tasks/setTasks', payload: [] });
    dispatch(authSlice.actions.setStatus("idle"));
  } catch (e) {
    dispatch(authSlice.actions.setError(e.message));
    dispatch(authSlice.actions.setStatus("idle"));
  }
};

export default authSlice.reducer;

