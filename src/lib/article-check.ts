import { z, ZodError } from 'zod';

export interface MDField {
    title: string;
    description: string;
    date: string;
    tags: Set<string>;
    geoAllow?: Set<string>;
    geoBlock?: Set<string>;
}

const schema = z
    .object({
        title: z.string(),
        description: z.string(),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
        tags: z.array(z.string()).min(1).transform((val) => new Set(val)),
        geoAllow: z
            .array(z.string())
            .transform((val) => new Set(val))
            .optional(),
        geoBlock: z
            .array(z.string())
            .transform((val) => new Set(val))
            .optional(),
    })
    .refine((obj) => !(obj.geoAllow && obj.geoBlock), { message: 'geoAllow and geoBlock cannot be present at the same time' });

export type MDFieldValidObject = z.infer<typeof schema>;

type MDFieldValidationResult = { success: true; data: MDFieldValidObject } | { success: false; error: ZodError };

export function checkMDField(obj: unknown): MDFieldValidationResult {
    const result = schema.safeParse(obj);
    return result.success ? { success: true, data: result.data } : { success: false, error: result.error };
}
