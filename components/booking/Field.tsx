import type { ReactNode } from "react";

export function Field({
  id,
  label,
  hint,
  error,
  optional,
  children,
  className = "",
}: {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label}
        {optional && <span className="ml-2 font-normal text-ink-soft">(optional)</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="field-hint mt-2">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}

/** aria-describedby wiring for an input inside <Field>. */
export function describedBy(id: string, error?: string, hint?: boolean) {
  return error ? `${id}-error` : hint ? `${id}-hint` : undefined;
}
