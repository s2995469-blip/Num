"use client";

import { useActionState } from "react";
import { login, type LoginState } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="grid gap-6">
      {state.error && (
        <p role="alert" className="border-l-2 border-[#9b3b2e] bg-[#f6e9e4] px-4 py-3 text-[0.95rem]">
          {state.error}
        </p>
      )}
      <div>
        <label htmlFor="email" className="field-label">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="field-input"
          defaultValue={state.email}
          key={state.email}
        />
      </div>
      <div>
        <label htmlFor="password" className="field-label">
          Password
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="field-input" />
      </div>
      <button type="submit" disabled={pending} className="btn btn-primary w-full disabled:opacity-70">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
