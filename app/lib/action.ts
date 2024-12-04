import { z } from "zod";
import { sql } from "@vercel/postgres";
import { v4 as uuidv4 } from "uuid";

// Ensure the POSTGRES_URL environment variable is loaded
if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL environment variable is not defined");
}

const ChoiceSchema = z.object({
  id: z.string().uuid(),
  name: z
    .string()
    .min(1, { message: "Choice must not be empty" })
    .max(100, { message: "Choice must be less than 100 characters" }),
});

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

export type GroupCreationState = {
  errors?: {
    groupName?: string[];
    choices?: string[];
  };
  message?: string | null;
};

export async function createGroup(
  prevState: GroupCreationState,
  formData: FormData
) {
  console.log("FormData:", formData);
  const generatedContestId = uuidv4();
  console.log("CONTEST NAME : ", formData.get("name"));

  // Dynamically create the choices array based on the form data
  const choices = [];
  let index = 1;
  let choice = formData.get(`choice${index}`);
  while (choice) {
    choices.push({
      id: uuidv4(),
      name: choice as string,
    });
    index++;
    choice = formData.get(`choice${index}`);
  }

  const validatedFields = GroupCreationSchema.safeParse({
    contestId: generatedContestId,
    groupName: formData.get("name") as string,
    choices,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to create group",
    };
  }

  const {
    groupName,
    choices: validatedChoices,
    contestId,
  } = validatedFields.data;

  try {
    await sql`
      INSERT INTO contests (id, name)
      VALUES (${contestId}, ${groupName})
    `;

    const choiceValues = validatedChoices.map(
      (choice) => `(${contestId}, '${choice.id}', '${choice.name}')`
    );

    await sql.query(`
      INSERT INTO choices (contest_id, id, name)
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
