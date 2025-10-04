import React from "react";
import TaskAdder from "../components/taskAdder";
import TaskSections from "../components/TaskSections";

const TasksPage = () => {
  return (
    <>
      <TaskAdder />
      <TaskSections />
    </>
  );
};

export default TasksPage;

