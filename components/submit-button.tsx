'use client';
import React from 'react';
import { useFormStatus } from 'react-dom';
import { type ComponentProps } from 'react';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import clsx from 'clsx';

const defaultButtonClasses = "bg-blue-500 hover:bg-blue-400 active:bg-blue-600 text-white font-medium text-sm h-10 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";

type SubmitButtonProps = ComponentProps<typeof Button> & {
  pendingText?: string;
};

export function SubmitButton({ children, pendingText, className, ...props }: SubmitButtonProps) {
  const { pending, action } = useFormStatus();

  const isPending = pending && action === props.formAction;

  return (
    <Button
      type="submit"
      disabled={pending}
      className={clsx(defaultButtonClasses, className)}
      {...props}
    >
      {isPending ? (
        <>
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          {pendingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}