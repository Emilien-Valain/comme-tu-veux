import { z } from "zod";
import { sql } from "@vercel/postgres";
import { v4 as uuidv4 } from "uuid"; // Recommended for UUID generation

// Define the base choice schema
const ChoiceSchema = z.object({
  id: z.string().uuid(),
  value: z
    .string()
    .min(1, { message: "Choice must not be empty" })
    .max(100, { message: "Choice must be less than 100 characters" }),
});

// Group creation schema
const GroupCreationSchema = z.object({
  contestId: z.string().uuid(),
  groupName: z
    .string()
    .min(2, { message: "Group name must be at least 2 characters" })
    .max(50, { message: "Group name must be less than 50 characters" }),
  choices: z
    .array(ChoiceSchema)
    .min(2, { message: "At least 2 choices are required" })
    .max(10, { message: "Maximum 10 choices allowed" }),
});

// State type for form errors and messages
export type GroupCreationState = {
  errors?: {
    groupName?: string[];
    choices?: string[];
  };
  message?: string | null;
};

// Server action for group creation
export async function createGroup(
  prevState: GroupCreationState,
  formData: FormData
) {
  const generatedContestId = uuidv4();

  const validatedFields = GroupCreationSchema.safeParse({
    contestId: generatedContestId,
    groupName: formData.get("groupName"),
    choices: Array.from({ length: 10 })
      .map((_, index) => ({
        id: uuidv4(),
        value: formData.get(`choice${index + 1}`) as string,
      }))
      .filter((choice) => choice.value.trim() !== ""),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to create group",
    };
  }

  const { groupName, choices, contestId } = validatedFields.data;

  try {
    // Remove the assignment if you don't need the result
    await sql`
      INSERT INTO contests (id, name) 
      VALUES (${contestId}, ${groupName})
    `;

    const choiceValues = choices.map(
      (choice) => `(${contestId}, '${choice.id}', '${choice.value}')`
    );

    await sql.query(`
      INSERT INTO choices (contest_id, id, value) 
      VALUES ${choiceValues.join(",")}
    `);
  } catch (error) {
    console.error("Failed to create group:", error);
    return {
      message: "Failed to create group",
    };
  }

  return {
    message: "Group created successfully",
  };
}
