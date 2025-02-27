
export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const articleio = await import('@/lib/article-io');
        await articleio.setupDirectories();
    }
}
