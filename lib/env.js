export function validateEnv() {
    const requiredEnvVars = {
        MONGODB_URI: process.env.MONGODB_URI,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    };

    const missingVars = Object.entries(requiredEnvVars)
        .filter(([, value]) => !value)
        .map(([key]) => key);

    if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}\n` + 'Please check your .env.local file.');
    }

    return requiredEnvVars;
}

export function getEnv() {
    return {
        mongodbUri: process.env.MONGODB_URI,
        nextAuthSecret: process.env.NEXTAUTH_SECRET,
        nextAuthUrl: process.env.NEXTAUTH_URL,
        nodeEnv: process.env.NODE_ENV || 'development',
        isDevelopment: process.env.NODE_ENV !== 'production',
        isProduction: process.env.NODE_ENV === 'production',
    };
}
