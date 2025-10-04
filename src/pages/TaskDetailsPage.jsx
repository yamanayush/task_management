import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const TaskDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const task = useSelector((s) => s.tasks.tasks.find((t) => t.id === id));

  if (!task) {
    return (
      <div className="p-6">
        <div className="bg-white p-6 rounded-xl">Task not found.</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white p-6 rounded-xl">
        <button className="text-purple-700 mb-4" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 className="text-2xl font-semibold">{task.name}</h1>
        <div className="text-gray-600 mt-2">{task.description || "No description"}</div>
        <div className="mt-4 text-sm">Due: {task.date}</div>
        <div className="mt-2 text-sm">Status: {task.status}</div>
        <div className="mt-2 text-sm">Priority: {task.priority}</div>
        {task.assigneeEmail && (
          <div className="mt-2 text-sm">Assignee: {task.assigneeEmail}</div>
        )}
      </div>
    </div>
  );
};

export default TaskDetailsPage;

