/**
 * Where the blog application lives.
 *
 * The blog is a separate deployment that reads the same Payload API, so its address
 * cannot be derived from this app's routes: it comes from the environment and falls
 * back to the local dev server of `apps/blog`, which is where it runs while developing.
 */
export const BLOG_URL = process.env.BLOG_URL?.trim() || 'http://localhost:3200'
