"use client";
import React, { useState } from "react";
import { Choice } from "@/app/lib/definitions";
import { createGroup, GroupCreationState } from "@/app/lib/action";
import { v4 as uuidv4 } from "uuid";

export default function GroupCreationForm() {
  const initialState: GroupCreationState = { errors: {}, message: null };
  const [state, setState] = useState(initialState);

  const [choices, setChoices] = useState<Choice[]>([
    { id: uuidv4(), name: "" },
  ]);

  const addChoice = () => {
    setChoices([...choices, { id: uuidv4(), name: "" }]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const result = await createGroup(state, formData);
    setState(result);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4">Create a Group</h2>

      {state.errors?.groupName && (
        <p className="text-red-500 mb-2">{state.errors.groupName[0]}</p>
      )}
      <input
        type="text"
        name="name"
        placeholder="Group Name"
        required
        className="w-full p-2 mb-4 border rounded"
      />

      {choices.map((choice, index) => (
        <div key={choice.id} className="flex mb-2">
          {state.errors?.choices && (
            <p className="text-red-500 mb-2">{state.errors.choices[0]}</p>
          )}
          <input
            type="text"
            name={`choice${index + 1}`}
            placeholder={`Choice ${index + 1}`}
            required
            className="flex-grow p-2 mr-2 border rounded"
          />
          {choices.length > 1 && (
            <button
              type="button"
              onClick={() => setChoices(choices.filter((_, i) => i !== index))}
              className="bg-red-500 text-white px-3 py-2 rounded"
            >
              ✕
            </button>
          )}
        </div>
      ))}

      {state.message && (
        <p
          className={`mt-2 ${
            state.message.includes("successfully")
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {state.message}
        </p>
      )}

      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={addChoice}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Choice
        </button>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Group
        </button>
      </div>
    </form>
  );
}
