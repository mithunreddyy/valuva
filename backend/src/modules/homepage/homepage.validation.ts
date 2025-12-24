import { z } from "zod";

// Currently, homepage endpoints do not accept any params or query/body payloads
// that need validation. This file exists for consistency with the module
// structure and to allow easy extension in the future.

export const getHomepageSectionsSchema = z.object({});

export const getHomepageFeaturedSchema = z.object({});

export const getHomepageNewArrivalsSchema = z.object({});

export const getHomepageBestSellersSchema = z.object({});
