import { z } from "zod";

// Sacred IDs — never rename once shipped (will break existing rows).
export const assetTypeSchema = z.enum([
  "ph_tagline",
  "ph_description",
  "ph_first_comment",
  "hn_post",
  "reddit_sideproject",
  "reddit_indiehackers",
  "reddit_saas",
  "x_thread",
  "linkedin_post",
  "email_outreach",
]);
export type AssetType = z.infer<typeof assetTypeSchema>;

export const generatedAssetSchema = z.object({
  id: z.string().uuid(),
  launch_id: z.string().uuid(),
  asset_type: assetTypeSchema,
  content: z.string(),
  edited_content: z.string().nullable(),
  generation_count: z.number().int().min(1),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type GeneratedAsset = z.infer<typeof generatedAssetSchema>;
