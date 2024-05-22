import { publicProcedure, router, protectedProcedure } from "@/lib/server/trpc";
import { z } from "zod";
export const computersRouter = router({
  getComputers: publicProcedure.query(async () => {
    return [
      { id: 1, name: "Apple I" },
      { id: 2, name: "Apple II" },
      { id: 3, name: "Macintosh" },
    ];
  }),

  getComplaints: protectedProcedure.query(async ({ ctx }) => {
    const complaints = await ctx.db.complaint.findMany({
      where: {
        OR: [
          { userId: ctx.session.user.id },
          { targetId: ctx.session.user.id },
        ],
      },
    });
    return complaints;
  }),
  getUsers: publicProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.user.findMany({where:{usertype:'Department'}});
    return users;
  }),

  createComplaint: publicProcedure
    .input(
      z.object({
        name: z.string(),
        submittedTo: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const complaint = await ctx.db.complaint.create({
        data: {
          name: input.name,
          userId: ctx.session?.user.id as string,
          targetId: input.submittedTo,
        },
      });

      return complaint;
    }),

  getCompalintById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const complaint = await ctx.db.complaint.findFirst({
        where: { id: input.id },
      });
      return complaint;
    }),

  editComplaint: publicProcedure
    .input(
      z.object({
        name: z.string(),
        submittedTo: z.string(),
        status: z.string(),
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const complaint = await ctx.db.complaint.update({
        data: {
          name: input.name,
          targetId: input.submittedTo,
          // @ts-ignore
          status: input.status as unknown as string,
        },
        where: { id: input.id },
      });
    }),

  getUserById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.db.user.findFirst({ where: { id: input.id } });
      return user;
    }),
});
