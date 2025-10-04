import React, { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { Provider, useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "./store/tasksSlice";
import store from "./store/store";
import Nav from "./components/nav";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { listenToAuth } from "./store/authSlice";
import LoginPage from "./auth/LoginPage";
import RegisterPage from "./auth/RegisterPage";
import TasksPage from "./pages/TasksPage";
import TaskDetailsPage from "./pages/TaskDetailsPage";

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const loadTasks = async () => {
      if (user) {
        try {
          await dispatch(fetchTasks());
        } catch (error) {
          toast.error("Error fetching tasks from Firebase", { autoClose: 2000 });
        }
      }
    };

    loadTasks();
  }, [dispatch, user]);

  useEffect(() => {
    dispatch(listenToAuth());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <DndProvider backend={HTML5Backend}>
        <ToastContainer />
        <div className="bg-gray-100 min-h-screen">
          <Nav />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/"
              element={user ? <TasksPage /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/tasks/:id"
              element={user ? <TaskDetailsPage /> : <Navigate to="/login" replace />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </DndProvider>
    </BrowserRouter>
  );
};

const RootApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default RootApp;
