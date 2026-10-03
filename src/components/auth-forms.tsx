"use client";

import { LoaderCircle } from "lucide-react";
import { useActionState } from "react";
import { type AuthFormState, signIn, signUp } from "@/actions/auth";
import { useFieldErrors } from "@/lib/use-field-errors";
import { Field, FormAlert } from "./form-field";

function SubmitButton({ pending, children }: { pending: boolean; children: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-wait disabled:bg-indigo-400"
    >
      {pending && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

export function SignInForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(signIn, {});
  const { errorFor, onChange } = useFieldErrors(state.fieldErrors);

  return (
    <form action={formAction} onChange={onChange} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      {state.error && <FormAlert>{state.error}</FormAlert>}
      <Field label="Email" name="email" type="email" autoComplete="email" required defaultValue={state.values?.email} error={errorFor("email")} />
      <Field label="Password" name="password" type="password" autoComplete="current-password" required error={errorFor("password")} />
      <SubmitButton pending={pending}>{pending ? "Signing in…" : "Sign in"}</SubmitButton>
    </form>
  );
}

export function SignUpForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(signUp, {});
  const { errorFor, onChange } = useFieldErrors(state.fieldErrors);

  return (
    <form action={formAction} onChange={onChange} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      {state.error && <FormAlert>{state.error}</FormAlert>}
      <Field label="Full name" name="name" autoComplete="name" required defaultValue={state.values?.name} error={errorFor("name")} />
      <Field label="Email" name="email" type="email" autoComplete="email" required defaultValue={state.values?.email} error={errorFor("email")} />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        required
        placeholder="At least 8 characters"
        error={errorFor("password")}
      />
      <SubmitButton pending={pending}>{pending ? "Creating your account…" : "Create account"}</SubmitButton>
    </form>
  );
}
