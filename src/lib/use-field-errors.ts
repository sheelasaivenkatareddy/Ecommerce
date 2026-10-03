import { type FormEvent, useState } from "react";

/**
 * Field errors from the last submission that disappear as soon as the customer edits that
 * field, and come back fresh on the next submission.
 */
export function useFieldErrors(fieldErrors: Record<string, string> | undefined) {
  const [edited, setEdited] = useState({ source: fieldErrors, names: [] as string[] });

  // A new submission result: forget which fields were edited (React's "reset state on prop change").
  if (edited.source !== fieldErrors) setEdited({ source: fieldErrors, names: [] });
  const editedNames = edited.source === fieldErrors ? edited.names : [];

  return {
    errorFor: (name: string) => (editedNames.includes(name) ? undefined : fieldErrors?.[name]),
    onChange: (event: FormEvent<HTMLFormElement>) => {
      const { name } = event.target as HTMLInputElement;
      if (fieldErrors?.[name] && !editedNames.includes(name)) {
        setEdited({ source: fieldErrors, names: [...editedNames, name] });
      }
    },
  };
}
