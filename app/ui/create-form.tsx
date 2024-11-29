"use client";
import React, { useActionState } from "react";
import { Choice, Contest } from "@/app/lib/definitions";
import { createContest, State } from "@/app/lib/action";
// import { Button } from './Button';

// interface Choice {
//   id: number;
//   value: string;
// }

// interface FormState {
//   groupName: string;
//   choices: Choice[];
// }

export default function GroupCreationForm() {
  const initialState: State = {
    groupName: "",
    choices: [{ id: 1, value: "" }],
  };
  const [state, formAction] = useActionState(createContest, initialState);

  return (
    <form
      action={formAction}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4">Create a Group</h2>

      <input
        type="text"
        name="groupName"
        placeholder="Group Name"
        required
        className="w-full p-2 mb-4 border rounded"
      />

      {state.choices.map((_: Choice, index: number) => (
        <div key={index} className="flex mb-2">
          <input
            type="text"
            name={`choice${index + 1}`}
            placeholder={`Choice ${index + 1}`}
            required
            className="flex-grow p-2 mr-2 border rounded"
          />
        </div>
      ))}

      <div className="flex justify-between mt-4">
        <button
          type="submit"
          formAction={(formData) => {
            const newState = {
              ...state,
              choices: [
                ...state.choices,
                { id: state.choices.length + 1, value: "" },
              ],
            };
            formAction(newState);
          }}
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
