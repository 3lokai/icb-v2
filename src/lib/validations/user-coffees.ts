import { z } from "zod";

export const userCoffeeStatusEnum = z.enum(
  ["logged", "brewing", "finished", "rated"],
  { message: "Status must be logged, brewing, finished, or rated" }
);

export const addUserCoffeeSchema = z.object({
  coffeeId: z.string().uuid("Invalid coffee ID"),
  status: userCoffeeStatusEnum.optional(),
});

export const updateUserCoffeeSchema = z.object({
  userCoffeeId: z.string().uuid("Invalid user coffee entry ID"),
  status: userCoffeeStatusEnum.optional(),
  photo: z.string().url("Invalid photo URL").nullable().optional(),
});

export const removeUserCoffeeSchema = z.object({
  userCoffeeId: z.string().uuid("Invalid user coffee entry ID"),
});

export type AddUserCoffeeFormData = z.infer<typeof addUserCoffeeSchema>;
export type UpdateUserCoffeeFormData = z.infer<typeof updateUserCoffeeSchema>;
export type RemoveUserCoffeeFormData = z.infer<typeof removeUserCoffeeSchema>;
