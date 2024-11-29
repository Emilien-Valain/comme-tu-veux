import { z } from 'zod';
import { sql } from '@vercel/postgres';

// Define the base choice schema
const ChoiceSchema = z.object({
  id: z.string().uuid(),
  value: z.string()
    .min(1, { message: "Choice must not be empty" })
    .max(100, { message: "Choice must be less than 100 characters" })
});

// Group creation schema
const GroupCreationSchema = z.object({
  groupName: z.string()
    .min(2, { message: "Group name must be at least 2 characters" })
    .max(50, { message: "Group name must be less than 50 characters" }),
  choices: z.array(ChoiceSchema)
    .min(2, { message: "At least 2 choices are required" })
    .max(10, { message: "Maximum 10 choices allowed" })
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
export async function createGroup(prevState: GroupCreationState, formData: FormData) {
  const validatedFields = GroupCreationSchema.safeParse({
    groupName: formData.get("groupName"),
    choices: Array.from({ length: 10 })
      .map((_, index) => ({
        id: crypto.randomUUID(),
        value: formData.get(`choice${index + 1}`) as string
      }))
      .filter(choice => choice.value.trim() !== '')
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to create group"
    };
  }

  const { groupName, choices } = validatedFields.data;
  try {
    await sql`INSERT INTO contests (name) VALUES (${groupName}) RETURNING *`;
    const contestId = contest[0].id;
    const choiceValues = choices.map(
      (choice) => sql`(${contestId}, ${choice.value})`
    );
    await sql`INSERT INTO choices (contest_id, value) VALUES ${sql.join(
      choiceValues,
      ","
    )}`;
  }

  // TODO: Implement actual group creation logic
  console.log('Group created:', validatedFields.data);

  return {
    message: "Group created successfully"
  };
}