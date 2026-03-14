"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Check, Copy, X } from "lucide-react";

const PROMPT = `# Code Principles from The Unwrap

Apply these principles when writing code.

## Sorting

Sort all code elements alphabetically by default: struct fields, object properties, function parameters, class methods, import statements, enum values.

Break this rule only when there is a documented reason. Alphabetical order is the only convention that needs no explanation.

## Primitives

Wrap primitive types in domain-specific newtypes by default. A \`UserId\` is not a string. An \`Email\` is not a string. A \`Price\` is not a number.

- Validate once at system boundaries (user input, API responses)
- Pass the strong type everywhere inside the system
- Never pass raw \`string\` or \`number\` when a domain type exists

## Data Structures

Obsess over data structures before algorithms. A well-designed struct makes the rest of the code obvious.

- Make illegal states unrepresentable using the type system
- Prefer flat, explicit structures over nested, implicit ones
- If your struct needs a comment to be understood, it's probably wrong

## Error Handling

Return errors as typed values. No throws. No panics.

Every function that can fail returns a discriminated union (Result/Either). The caller is forced to handle the error. The type signature tells the truth.

\`\`\`typescript
// Bad
function getUser(id: UserId): User { // lies — can throw
  throw new NotFoundError();
}

// Good
function getUser(id: UserId): Result<User, NotFoundError | DatabaseError> {
  // caller must handle both cases
}
\`\`\`

Exceptions are only acceptable at system boundaries (unrecoverable errors, process crashes).

## Dependencies

Pass dependencies explicitly through constructor or method parameters. Never use singletons, global state, or dependency injection frameworks.

\`\`\`typescript
// Bad — hidden dependency
class UserService {
  save(user: User) {
    Database.getInstance().save(user); // where did this come from?
  }
}

// Good — explicit dependency
class User {
  save(store: Store): Result<void, DatabaseError> {
    return store.persist(this);
  }
}
\`\`\`

If a dependency is not in the function signature, it should not exist.
`.trim();

export function AIPromptDialog() {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(PROMPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="inline-flex items-center cursor-pointer px-4 py-1.5 rounded-full text-sm font-medium bg-blue-600 text-white hover:bg-blue-500 transition-colors">
          Use with AI
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl max-h-[80vh] -translate-x-1/2 -translate-y-1/2 flex flex-col rounded-lg border border-white/10 bg-black/40 backdrop-blur-xl shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <div>
              <Dialog.Title className="text-base font-semibold text-white">
                AI Prompt
              </Dialog.Title>
              <Dialog.Description className="text-sm text-white/50 mt-0.5">
                Paste into your CLAUDE.md, Cursor rules, or any AI config file
              </Dialog.Description>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={copy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-white/20 text-sm font-medium text-white/80 hover:bg-white/10 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </button>
              <Dialog.Close className="p-1.5 rounded-md text-white/60 hover:bg-white/10 hover:text-white transition-colors" aria-label="Close">
                <X className="w-4 h-4" />
              </Dialog.Close>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <pre className="h-full p-5 text-xs leading-relaxed font-mono whitespace-pre-wrap bg-[#1e1e2e] text-[#cdd6f4] rounded-lg">
              {PROMPT}
            </pre>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
