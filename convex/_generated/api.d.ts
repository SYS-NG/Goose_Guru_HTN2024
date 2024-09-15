/* prettier-ignore-start */

/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as audioFiles from "../audioFiles.js";
import type * as audioTranscription from "../audioTranscription.js";
import type * as auth from "../auth.js";
import type * as codeExecution from "../codeExecution.js";
import type * as codeSubmissions from "../codeSubmissions.js";
import type * as codingProblems from "../codingProblems.js";
import type * as conversation from "../conversation.js";
import type * as http from "../http.js";
import type * as interview from "../interview.js";
import type * as messages from "../messages.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  audioFiles: typeof audioFiles;
  audioTranscription: typeof audioTranscription;
  auth: typeof auth;
  codeExecution: typeof codeExecution;
  codeSubmissions: typeof codeSubmissions;
  codingProblems: typeof codingProblems;
  conversation: typeof conversation;
  http: typeof http;
  interview: typeof interview;
  messages: typeof messages;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

/* prettier-ignore-end */
