/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as aiModels from "../aiModels.js";
import type * as apiKeys from "../apiKeys.js";
import type * as audit from "../audit.js";
import type * as auth from "../auth.js";
import type * as chat from "../chat.js";
import type * as containers from "../containers.js";
import type * as emailTemplates from "../emailTemplates.js";
import type * as http from "../http.js";
import type * as inspections from "../inspections.js";
import type * as prompts from "../prompts.js";
import type * as quotes from "../quotes.js";
import type * as settings from "../settings.js";
import type * as sourcing from "../sourcing.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  aiModels: typeof aiModels;
  apiKeys: typeof apiKeys;
  audit: typeof audit;
  auth: typeof auth;
  chat: typeof chat;
  containers: typeof containers;
  emailTemplates: typeof emailTemplates;
  http: typeof http;
  inspections: typeof inspections;
  prompts: typeof prompts;
  quotes: typeof quotes;
  settings: typeof settings;
  sourcing: typeof sourcing;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
