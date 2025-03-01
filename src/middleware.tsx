import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from './stack';

export async function middleware(request: NextRequest) {
    const requestHeaders = new Headers(request.headers);
    if (requestHeaders.get('x-forwarded-for') !== undefined) {
        // Add geo data to request header
        const userIP = (requestHeaders.get('x-forwarded-for') ?? '::1').toString().split(', ')[0];
        requestHeaders.set('user-ip', userIP);
    }

    // Auth check

    const user = await stackServerApp.getUser();
    const isAdmin = async () => {
        if (!user) {
            return false;
        }

        if ((await user.listTeams()).find((item) => item.id === (process.env.SITE_ADMIN_TEAM_ID ?? '')) !== undefined) {
            return true;
        }

        return false;
    };

    if (await isAdmin()) {
        requestHeaders.set('is-admin', 'true');
    }

    const regexPattern = new RegExp('^\/articles\/([^ \/]*\/edit|create)$');
    if (!(await isAdmin()) && (regexPattern.test(request.nextUrl.pathname) || request.nextUrl.searchParams.has('draft'))) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // We must pass the headers!
    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    return response;
}
