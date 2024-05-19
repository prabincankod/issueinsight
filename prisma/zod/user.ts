import * as z from "zod"
import { USER_TYPE } from "@prisma/client"
import { CompleteSession, relatedSessionSchema, CompleteComplaint, relatedComplaintSchema } from "./index"

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  hashedPassword: z.string(),
  name: z.string().nullish(),
  parentsNo: z.string().nullish(),
  usertype: z.nativeEnum(USER_TYPE),
})

export interface CompleteUser extends z.infer<typeof userSchema> {
  sessions: CompleteSession[]
  createdComplaints: CompleteComplaint[]
  targetedComplaints: CompleteComplaint[]
}

/**
 * relatedUserSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedUserSchema: z.ZodSchema<CompleteUser> = z.lazy(() => userSchema.extend({
  sessions: relatedSessionSchema.array(),
  createdComplaints: relatedComplaintSchema.array(),
  targetedComplaints: relatedComplaintSchema.array(),
}))
