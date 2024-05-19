import * as z from "zod"
import { STATUS_TYPE } from "@prisma/client"
import { CompleteUser, relatedUserSchema } from "./index"

export const complaintSchema = z.object({
  id: z.string(),
  name: z.string(),
  userId: z.string(),
  status: z.nativeEnum(STATUS_TYPE),
  targetId: z.string(),
})

export interface CompleteComplaint extends z.infer<typeof complaintSchema> {
  createdBy: CompleteUser
  target: CompleteUser
}

/**
 * relatedComplaintSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedComplaintSchema: z.ZodSchema<CompleteComplaint> = z.lazy(() => complaintSchema.extend({
  createdBy: relatedUserSchema,
  target: relatedUserSchema,
}))
