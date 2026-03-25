"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Check, Copy, X } from "lucide-react";

const PROMPT_COMMON = `# Code Principles from The Unwrap

Apply these principles when writing code.

## Sorting

Sort alphabetically by default: struct fields, object properties, function parameters, class methods, import statements, enum values, table columns. Every list.

Break this rule only when documented. Visibility grouping (constructor → public → private), natural call-convention order for function parameters, and semantically inseparable method pairs are legitimate exceptions — but the exception must exist in the code as a comment, not in your head.

## Primitives

Wrap every primitive that carries domain meaning in a dedicated type. \`UserId\` is not a \`string\`. \`Email\` is not a \`string\`. \`Price\` is not a \`number\`.

Validate once at system boundaries (user input, external API responses). Pass the strong type everywhere inside the system. Never pass a raw primitive when a domain type exists.

## Structs and Method Ownership

Data and the operations that belong with it live together. \`user.save(store)\`, not \`UserRepository.save(user)\`. \`url.parse()\`, not \`UrlParser.parse(url)\`.

Name things after what they actually are. A todo API has a \`RestApi\`, a \`Todo\`, a \`Store\`. It does not have a \`TodoController\`, \`TodoService\`, or \`RequestHandler\`. If you wouldn't say "I built a UserRepository" to a colleague, don't build one.

Free functions are almost always a smell. Every function in a \`utils\` file is a method on a type that doesn't exist yet. \`parse_url(s)\` belongs on \`Url\`. \`format_user(user)\` belongs on \`User\`. The 1% exception is genuinely stateless math (\`clamp\`, \`min\`, \`max\`) with no natural subject.

Fluent API as a design check: if \`User::create(email).save(store)\` reads naturally, the design is probably right. If you can't figure out what method goes on something, the design is telling you something is wrong.

A struct with 25 methods is three types that haven't been separated yet. Ask: do all these methods operate on the same data? Split what can stand alone.

## Comments

Delete comments that explain what the code does. Fix the code instead. The comment is a confession that the code failed to explain itself.

Two legitimate comment types:
1. **Context the code cannot express**: a ticket link, a bug reference, the WHY behind a workaround that looks wrong but isn't.
2. **Substantive TODOs**: what needs to change, why it wasn't done now, with a ticket reference.

Never commit commented-out code. \`git log\` exists.

## Migrations

Commit two files per schema change: \`schema.sql\` (what the database looks like now) and \`migrate.sql\` (how to get there from the last version). Git holds the rest.

Never accumulate numbered migration files (\`V001\`, \`V002\`, \`V043\`). Nobody can read the schema without replaying all of them. \`schema.sql\` is always the current truth. \`migrate.sql\` is the single step forward. The previous schema version already lives in git — you don't need it in the directory.

`;

const PROMPT_TYPESCRIPT = PROMPT_COMMON + `## Errors

Every function that can fail returns a discriminated union. No throws in business logic.

\`\`\`typescript
// Bad — lies in the signature
function getUser(id: string): User { throw new NotFoundError() }

// Good — honest signature
type Result<T, E> = { type: "Ok"; data: T } | { type: "Err"; err: E }

type UserError =
  | { type: "NotFoundError"; userId: string }
  | { type: "NetworkError"; retryable: true }

function getUser(id: string): Result<User, UserError> { ... }
\`\`\`

Typed errors let you make real decisions: retry \`NetworkError\`, show form errors for \`ValidationError\`, refresh token on \`AuthError\`. Pattern match on the variant. Don't guess with catch blocks.

Throws are only acceptable at startup (missing config, failed DB connection at boot) or invariant violations that prove programmer error. Never in business logic.

## Dependencies

Pass dependencies explicitly through constructor or method parameters. No singletons. No DI frameworks.

\`\`\`typescript
// Bad — hidden dependency
class UserService {
  getUser(id: string) { return Database.instance.query(id) }
}

// Good — explicit
class UserService {
  constructor(private db: Database) {}
  getUser(id: string) { return this.db.query(id) }
}
\`\`\`

If a dependency is not in the type signature, it should not exist. Wire everything in \`main\`. Module-level infrastructure (logger, config) is the one exception: visible at the import level, never mocked in tests.

## Testing

Use real in-memory implementations, not mocks. Mocks test your assumptions. Real implementations test your code.

\`\`\`typescript
// Bad — tests the assumption, not the constraint
findByEmail: jest.fn().mockResolvedValue(null)

// Good — enforces the actual uniqueness rule
class MemDatabase implements Database {
  private users = new Map<string, User>()
  async insertUser(user: NewUser): Promise<User> {
    const existing = await this.findUserByEmail(user.email)
    if (existing) throw new Error(\`Email exists: \${user.email}\`)
    const created = { id: crypto.randomUUID(), ...user }
    this.users.set(created.id, created)
    return created
  }
}
\`\`\`

Build the feature. Then test what you built. Don't write tests before you understand the shape of the code — requirements are fuzzy until they aren't. The one exception: write the failing test the moment you find a bug. At that point you have exact requirements (the input, the wrong output, the right output). That's when test-first pays off. Over time this builds a suite that reflects real failure modes. 90% unit tests (fast, in-process), 10% integration tests (one per external boundary, happy path only), 0% E2E in regular CI.

## Frontend State

Model application state as a discriminated union before writing a single component. The UI is a pure render function over state. Never the other way around.

\`\`\`typescript
// Bad — 8 possible states, 3 valid, 5 are bugs
const [user, setUser] = useState<User | null>(null)
const [loading, setLoading] = useState(false)
const [error, setError] = useState<string | null>(null)

// Good — 4 states, all valid, compiler-enforced
type UserState =
  | { status: "guest" }
  | { status: "loading" }
  | { status: "authenticated"; user: User }
  | { status: "error"; message: string }
\`\`\`

State lives outside components. Components read state and emit events. No fetching, no side effects, no business logic inside components or hooks.
`.trim();

const PROMPT_RUST = PROMPT_COMMON + `## Errors

Every function that can fail returns \`Result<T, E>\`. No panics in business logic.

\`\`\`rust
// Bad — panics hide the failure mode
fn get_user(id: &str) -> User { todo!() }

// Good — honest signature
#[derive(Debug)]
enum UserError { NotFound { user_id: String }, NetworkError }

fn get_user(id: &str) -> Result<User, UserError> { ... }
\`\`\`

Use the \`?\` operator to propagate errors without nesting. Pattern match on variants to make real decisions: retry \`NetworkError\`, return early on \`ValidationError\`.

\`unwrap()\` and \`expect()\` are only acceptable in tests or at startup for truly unrecoverable situations (missing config, no database at boot). Never in business logic.

## Dependencies

Pass dependencies explicitly through struct fields and function parameters. No global statics for business logic.

\`\`\`rust
// Bad — hidden global
impl UserService {
    fn get_user(&self, id: &str) -> User {
        DATABASE.get().unwrap().query(id) // where did this come from?
    }
}

// Good — explicit
struct UserService { db: Database }

impl UserService {
    fn get_user(&self, id: &str) -> Result<User, UserError> {
        self.db.query(id)
    }
}
\`\`\`

If a dependency is not in the struct or function signature, it should not exist. Wire everything in \`main\`. Module-level infrastructure via \`OnceLock\` (logger, config) is the one exception: visible at the import level, never mocked in tests.

## Testing

Use real in-memory implementations, not mocks. Mocks test your assumptions. Real implementations test your code.

\`\`\`rust
// Good — enforces the actual uniqueness constraint
struct MemDatabase { users: Mutex<HashMap<String, User>> }

impl Database for MemDatabase {
    async fn insert_user(&self, user: NewUser) -> Result<User, DbError> {
        let mut users = self.users.lock().unwrap();
        if users.values().any(|u| u.email == user.email) {
            return Err(DbError::UniqueViolation("email".into()));
        }
        let created = User { id: Uuid::new_v4().to_string(), ..user.into() };
        users.insert(created.id.clone(), created.clone());
        Ok(created)
    }
}
\`\`\`

Build the feature. Then test what you built. Don't write tests before you understand the shape of the code — requirements are fuzzy until they aren't. The one exception: write the failing test the moment you find a bug. At that point you have exact requirements. That's when test-first pays off. 90% unit tests (fast, in-process), 10% integration tests (one per external boundary), 0% E2E in regular CI.
`.trim();

const PROMPT_PYTHON = PROMPT_COMMON + `## Errors

Handle errors explicitly. Do not let exceptions silently propagate through business logic. Return typed failure values; catch at boundaries.

\`\`\`python
# Bad — caller has no idea this can fail, can't distinguish failure modes
def get_user(user_id: UserId) -> User:
    return db.query(user_id)  # raises if not found

# Good — typed error variants, each actionable
@dataclass
class Ok(Generic[T]): value: T
@dataclass
class Err(Generic[E]): error: E
Result = Ok[T] | Err[E]

@dataclass
class NotFoundError: user_id: UserId
@dataclass
class NetworkError: retryable: bool

def get_user(user_id: UserId) -> Result[User, NotFoundError | NetworkError]:
    user = db.query(user_id)
    if not user: return Err(NotFoundError(user_id))
    return Ok(user)
\`\`\`

Typed errors let you make real decisions: retry \`NetworkError\`, show form errors for \`ValidationError\`, refresh token on \`AuthError\`. \`User | None\` loses the failure reason. Use explicit error variants instead. One try/except per boundary, not one per function.

Exceptions are only acceptable at startup (missing config, failed connections) or truly unrecoverable situations. Never in business logic.

## Dependencies

Pass dependencies explicitly through \`__init__\` parameters. No module-level globals or service locators in business logic.

\`\`\`python
# Bad — hidden dependency
class UserService:
    def get_user(self, user_id: str) -> User:
        return Database.get_instance().query(user_id)

# Good — explicit
class UserService:
    def __init__(self, db: Database) -> None:
        self.db = db

    def get_user(self, user_id: str) -> Result[User, UserError]:
        return self.db.query(user_id)
\`\`\`

If a dependency is not in the \`__init__\` or function signature, it should not exist. Wire everything at the application entry point. Module-level constants (logger, config loaded at startup) are the one exception.

## Testing

Use real in-memory implementations, not mocks. Mocks test your assumptions. Real implementations test your code.

\`\`\`python
# Bad — tests the assumption, not the constraint
mock_db.find_by_email.return_value = None

# Good — enforces the actual uniqueness constraint
class MemDatabase(Database):
    def __init__(self) -> None:
        self._users: dict[str, User] = {}

    def insert_user(self, user: NewUser) -> Result[User, DbError]:
        if any(u.email == user.email for u in self._users.values()):
            return Err(DbError.unique_violation("email"))
        created = User(id=str(uuid4()), **asdict(user))
        self._users[created.id] = created
        return Ok(created)
\`\`\`

Build the feature. Then test what you built. Don't write tests before you understand the shape of the code — requirements are fuzzy until they aren't. The one exception: write the failing test the moment you find a bug. At that point you have exact requirements. That's when test-first pays off. Prefer fast, in-process unit tests. One integration test per external boundary. No E2E in regular CI.
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
            <Dialog.Close className="p-1.5 rounded-md text-white/60 hover:bg-white/10 hover:text-white transition-colors" aria-label="Close">
              <X className="w-4 h-4" />
            </Dialog.Close>
          </div>

          <div className="flex items-center justify-between px-5 pt-3">
            <div className="flex gap-1">
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
            <button
              onClick={copy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-white/20 text-xs font-medium text-white/80 hover:bg-white/10 transition-colors"
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
          </div>

          <div className="flex-1 min-h-0 p-4 flex flex-col">
            <pre className="flex-1 min-h-0 overflow-auto p-5 text-xs leading-relaxed font-mono whitespace-pre-wrap bg-[#1e1e2e] text-[#cdd6f4] rounded-lg">
              {PROMPTS[language]}
            </pre>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
