import React from 'react';
import { headers, cookies } from 'next/headers';
import { SubmitButton } from '@/components/submit-button';
import { APIResponse } from '@/types/types';
import { redirect } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const signInWithEmail = async (formData: FormData) => {
  'use server';
  const origin = headers().get('origin');
  const email = formData.get('email') as string;
  const pnum = formData.get('pnum') as string;

  const response = await fetch(`${origin}/api/auth/login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, pnum }),
  });

  const data: APIResponse = await response.json();
  if (response.ok) {
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      const cookieParts = setCookieHeader.split(';');
      const [cookieNameValue, ...cookieOptions] = cookieParts;
      const [cookieName, cookieValue] = cookieNameValue.split('=').map(part => part.trim());

      const cookieOptionsObj: Record<string, string> = {
        name: cookieName,
        value: cookieValue
      };

      for (const option of cookieOptions) {
        const [key, value] = option.split('=');
        cookieOptionsObj[key.trim()] = value ? value.trim() : '';
      }

      cookies().set({
        name: cookieOptionsObj['name'],
        value: cookieOptionsObj['value'],
        httpOnly: Object.prototype.hasOwnProperty.call(cookieOptionsObj, 'HttpOnly'),
        secure: process.env.NODE_ENV === 'production',
        maxAge: parseInt(cookieOptionsObj['Max-Age']),
        path: cookieOptionsObj['Path'],
      });
      return redirect('/label');
    }
  }

  return redirect(`/login?message=${data.message}`);
};

export default function Login({ searchParams }: { searchParams: { message: string } }) {
  return (
    <div className="flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
      <form className="mt-40 flex w-full flex-1 flex-col gap-2 text-foreground animate-in">
        <Label htmlFor="email">이메일</Label>
        <Input className="mb-6 px-4 py-2" name="email" placeholder="you@example.com" required />
        <Label htmlFor="pnum">참여자 번호</Label>
        <Input className="mb-6 px-4 py-2" name="pnum" placeholder="제공받은 참여자 번호" required />
        {searchParams?.message && (
          <Button asChild variant="destructive">
            <span>{searchParams.message}</span>
          </Button>
        )}
        <SubmitButton
          formAction={signInWithEmail}
          className="mb-2 rounded-md bg-green-700 px-4 py-2 text-foreground"
          pendingText="이메일로 로그인중..."
        >
          로그인
        </SubmitButton>
      </form>
    </div>
  );
}
