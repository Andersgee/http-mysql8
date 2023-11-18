import { z } from "zod";
const envSchema = z.object({
    DATABASE_URL: z.string(),
    DB_HTTP_AUTH_HEADER: z.string(),
});
function formatErrors(errors) {
    return Object.entries(errors)
        .map(([name, value]) => {
        if (value && "_errors" in value)
            return `${name}: ${value._errors.join(", ")}\n`;
    })
        .filter(Boolean);
}
const parsedSchema = envSchema.safeParse(process.env);
if (!parsedSchema.success) {
    console.error("❌ Invalid env vars:\n", ...formatErrors(parsedSchema.error.format()));
    throw new Error("Invalid environment variables");
}
