import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const target = url.searchParams.get('redirect') || '/dashboard/resume-builder';
  const response = NextResponse.redirect(new URL(target, request.url));
  response.cookies.set('student_auth', 'true', {
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return response;
}
