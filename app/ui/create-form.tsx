"use client";

import React, { useState } from "react";

interface Choice {
  id: number;
  value: string;
}

export default function GroupCreationForm() {
  const [groupName, setGroupName] = useState("");
  const [choices, setChoices] = useState<Choice[]>([{ id: 1, value: "" }]);

  const addChoice = () => {
    const newChoiceId =
      choices.length > 0 ? Math.max(...choices.map((c) => c.id)) + 1 : 1;
    setChoices([...choices, { id: newChoiceId, value: "" }]);
  };

  const updateChoice = (id: number, newValue: string) => {
    setChoices(
      choices.map((choice) =>
        choice.id === id ? { ...choice, value: newValue } : choice
      )
    );
  };

  const removeChoice = (id: number) => {
    setChoices(choices.filter((choice) => choice.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement group creation logic
    console.log("Group Name:", groupName);
    console.log("Choices:", choices);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4">Create a Group</h2>

      <input
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Group Name"
        required
        className="w-full p-2 mb-4 border rounded"
      />

      {choices.map((choice, index) => (
        <div key={choice.id} className="flex mb-2">
          <input
            type="text"
            value={choice.value}
            onChange={(e) => updateChoice(choice.id, e.target.value)}
            placeholder={`Choice ${index + 1}`}
            required
            className="flex-grow p-2 mr-2 border rounded"
          />
          {choices.length > 1 && (
            <button
              type="button"
              onClick={() => removeChoice(choice.id)}
              className="bg-red-500 text-white px-3 py-2 rounded"
            >
              ✕
            </button>
          )}
        </div>
      ))}

      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={addChoice}
          className="bg-green-500 hover:bg-green-600"
        >
          Add Choice
        </button>
        <button type="submit" className="bg-blue-500 hover:bg-blue-600">
          Create Group
        </button>
      </div>
    </form>
  );
}
