import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/play/(.*)',
  '/api/gifts/(.*)/public',
  '/api/generate/(.*)',
  '/api/__workflow(.*)',
  '/__wkf_(.*)',  // Internal workflow routes
  '/.well-known/(.*)',  // Workflow well-known routes
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/waitlist(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip workflow routes entirely - they don't need auth
    '/((?!_next|__wkf_|\\.well-known|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
