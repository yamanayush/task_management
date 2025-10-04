import { createSlice } from "@reduxjs/toolkit";
import {
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

const tasksCollection = collection(db, "tasks");

const initialState = {
  tasks: [],
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id
      );
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
  },
});


export const fetchTasks = () => async (dispatch, getState) => {
  try {
    const user = getState().auth.user;
    
    // Clear existing tasks
    dispatch(tasksSlice.actions.setTasks([]));
    
    let tasks = [];
    
    if (user?.uid) {
      // Fetch all tasks and filter by user UID
      const allTasksQuery = query(tasksCollection, limit(50));
      const allTasksSnapshot = await getDocs(allTasksQuery);
      const allTasks = allTasksSnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      
      // Filter by user UID in JavaScript (client-side filtering)
      tasks = allTasks.filter(task => task.assigneeUid === user.uid);
      
      // Sort by createdAt in JavaScript
      tasks.sort((a, b) => {
        const aTime = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const bTime = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return bTime - aTime; // Descending order
      });
      
      // Limit to 10 tasks
      tasks = tasks.slice(0, 10);
    } else {
      const allTasksQuery = query(tasksCollection, limit(10));
      const querySnapshot = await getDocs(allTasksQuery);
      tasks = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    }
    
    // Use setTasks to replace existing tasks
    dispatch(tasksSlice.actions.setTasks(tasks));
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};


export const addTask = (task) => async (dispatch, getState) => {
  try {
    const user = getState().auth.user;
    const payload = {
      ...task,
      assigneeUid: user?.uid || null,
      assigneeEmail: user?.email || null,
      assigneeName: user?.name || null,
      createdAt: serverTimestamp(),
    };
    await setDoc(doc(db, "tasks", task.id), payload);
    dispatch(tasksSlice.actions.addTask({ ...payload, id: task.id }));
  } catch (error) {
    console.error("Error adding task:", error);
  }
};

export const updateTask = (task) => async (dispatch) => {
  try {
    const taskRef = doc(db, "tasks", task.id);
    const { id, ...data } = task;
    await updateDoc(taskRef, data);
    dispatch(tasksSlice.actions.updateTask(task));
  } catch (error) {
    console.error("Error updating task:", error);
  }
};

export const deleteTask = (id) => async (dispatch) => {
  try {
    await deleteDoc(doc(db, "tasks", id));
    dispatch(tasksSlice.actions.deleteTask(id));
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

export default tasksSlice.reducer;
