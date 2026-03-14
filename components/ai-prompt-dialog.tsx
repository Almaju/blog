"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Check, Copy, X } from "lucide-react";

const PROMPT_COMMON = `# Code Principles from The Unwrap

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

`;

const PROMPT_TYPESCRIPT = PROMPT_COMMON + `## Error Handling

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

const PROMPT_RUST = PROMPT_COMMON + `## Error Handling

Return errors as typed values. No panics in business logic.

Every function that can fail returns \`Result<T, E>\`. The caller is forced to handle the error. The type signature tells the truth.

\`\`\`rust
// Bad
fn get_user(id: UserId) -> User { // lies — can panic
    panic!("not found");
}

// Good
fn get_user(id: UserId) -> Result<User, AppError> {
    // caller must handle both cases
}
\`\`\`

\`unwrap()\` and \`expect()\` are only acceptable in tests or truly unrecoverable situations.

## Dependencies

Pass dependencies explicitly through function or constructor parameters. Never use global state or lazy statics for business logic.

\`\`\`rust
// Bad — hidden dependency
impl UserService {
    fn save(&self, user: User) {
        DATABASE.lock().unwrap().save(user); // where did this come from?
    }
}

// Good — explicit dependency
impl User {
    fn save(&self, store: &Store) -> Result<(), DatabaseError> {
        store.persist(self)
    }
}
\`\`\`

If a dependency is not in the function signature, it should not exist.
`.trim();

const PROMPT_PYTHON = PROMPT_COMMON + `## Error Handling

Handle errors explicitly. Do not let exceptions silently propagate through business logic.

Catch exceptions at system boundaries. Inside the domain, use explicit return types (e.g. with the \`returns\` library) or sentinel values that force the caller to deal with failure.

\`\`\`python
# Bad — exception silently propagates
def get_user(user_id: UserId) -> User:
    return db.query(user_id)  # raises if not found — caller has no idea

# Good — failure is visible in the signature
def get_user(user_id: UserId) -> User | None:
    result = db.query(user_id)
    return result if result else None
\`\`\`

Exceptions are only acceptable at system boundaries (unrecoverable errors, framework entry points).

## Dependencies

Pass dependencies explicitly through function or \`__init__\` parameters. Never reach for module-level globals or service locators in business logic.

\`\`\`python
# Bad — hidden dependency
class UserService:
    def save(self, user: User) -> None:
        Database.get_instance().save(user)  # where did this come from?

# Good — explicit dependency
class User:
    def save(self, store: Store) -> None:
        store.persist(self)
\`\`\`

If a dependency is not in the function signature, it should not exist.
`.trim();

const PROMPTS = {
  TypeScript: PROMPT_TYPESCRIPT,
  Rust: PROMPT_RUST,
  Python: PROMPT_PYTHON,
} as const;

type Language = keyof typeof PROMPTS;

export function AIPromptDialog() {
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState<Language>("TypeScript");

  function copy() {
    navigator.clipboard.writeText(PROMPTS[language]);
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

          <div className="flex gap-1 px-5 pt-3">
            {(Object.keys(PROMPTS) as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  language === lang
                    ? "bg-white/20 text-white"
                    : "text-white/50 hover:text-white/80 hover:bg-white/10"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-auto p-4">
            <pre className="h-full p-5 text-xs leading-relaxed font-mono whitespace-pre-wrap bg-[#1e1e2e] text-[#cdd6f4] rounded-lg">
              {PROMPTS[language]}
            </pre>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
