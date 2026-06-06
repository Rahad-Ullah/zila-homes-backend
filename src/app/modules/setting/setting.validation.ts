import { z } from 'zod';

// update setting validation
const updateSettingValidation = z.object({
  body: z.object({
    platformFeePercentage: z.number().min(0).max(100).optional(),
    contactInfo: z.object({
      email: z.string().email().optional(),
      phone: z.coerce.string().optional(),
      whatsApp: z.string().optional(),
      address: z.string().optional(),
      location: z.object({
        type: z.enum(['Point']).default('Point').optional(),
        coordinates: z.array(z.number()).optional(),
      }).optional(),
    }).optional(),
    socialLinks: z.object({
      facebook: z.string().url().optional(),
      instagram: z.string().url().optional(),
      twitter: z.string().url().optional(),
      linkedin: z.string().url().optional(),
      youtube: z.string().url().optional(),
      tiktok: z.string().url().optional(),
      reddit: z.string().url().optional(),
      weChat: z.string().url().optional(),
      discord: z.string().url().optional(),
      telegram: z.string().url().optional(),
    }).optional(),
  }).strict(),
});

export const SettingValidations = {
  updateSettingValidation,
};