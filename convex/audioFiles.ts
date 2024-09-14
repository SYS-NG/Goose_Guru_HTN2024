import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation } from "./_generated/server";

/* Use this link for documentation https://docs.convex.dev/file-storage/upload-files */

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const sendAudioFile = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not signed in");
    }
    await ctx.db.insert("audioFiles", {
      userId: userId,
      storageID: args.storageId,
      format: "audio",
    });
  },
});