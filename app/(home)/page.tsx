import Link from "next/link";
import { Mermaid } from "@/components/mdx/mermaid";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="flex flex-col items-center justify-center py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              The Unwrap
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Programming craftsmanship. Opinionated, specific, actionable.
          </p>

          <div className="flex items-center justify-center pt-2">
            <Link
              href="/docs/fundamentals/1-sorting"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-colors"
            >
              Start Reading
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 border-t">
        <div className="max-w-2xl mx-auto prose prose-neutral dark:prose-invert">
          <h2>The Problem</h2>

          <p>Programming is drowning in its own confusion.</p>

          <p>
            You open a codebase. You see a <code>UserService</code> that
            doesn&apos;t serve anything. A <code>CustomerController</code> that
            doesn&apos;t control. A <code>PaymentUseCase</code> that... what
            does a use case even <em>do</em>? The developer who wrote this will
            tell you they&apos;re following Domain-Driven Design. They&apos;re
            not. They&apos;ve cargo-culted the vocabulary without understanding
            the grammar.
          </p>

          <p>Meanwhile, AI is making this worse. Much worse.</p>

          <p>
            LLMs generate code that <em>works</em> but reads like a stream of
            consciousness from a very competent, very drunk programmer. It
            solves the problem. It passes the tests. It&apos;s also
            architectural vomit: inconsistent naming, mixed abstraction levels,
            no guiding principles. Just tokens predicting tokens.
          </p>

          <p>
            <strong>Here&apos;s the uncomfortable truth</strong>: Most
            human-written code isn&apos;t much better.
          </p>

          <h2>The Real Disease</h2>

          <Mermaid chart={`graph TD
    A[Same Problem] --> B[Framework A Solution]
    A --> C[Framework B Solution]
    A --> D[Framework C Solution]
    A --> E[Framework D Solution]
    B --> F[Different Names]
    C --> F
    D --> F
    E --> F
    F --> G[Confusion]
    G --> H[Cargo Culting]
    H --> I[Bad Code]`} />

          <p>
            Programming suffers from a naming crisis. Not the &ldquo;naming
            things is hard&rdquo; platitude: everyone knows that. The real
            problem: <strong>there are too many ways to do the same thing, and
            we can&apos;t agree on what to call any of them</strong>.
          </p>

          <p>Want to organize business logic? Choose your poison:</p>
          <ul>
            <li>Service Layer</li>
            <li>Use Case Layer</li>
            <li>Application Services</li>
            <li>Domain Services</li>
            <li>Handlers</li>
            <li>Managers</li>
            <li>Coordinators</li>
          </ul>

          <p>
            All of these might do the exact same thing in your codebase. Or
            they might not. There&apos;s no standard. So developers reach for
            architectural vocabulary like life preservers, hoping the names will
            save them from drowning in their own complexity.
          </p>

          <p>They won&apos;t.</p>

          <p>
            <strong>The names are a symptom, not a cure</strong>. When you need
            a word like &ldquo;Manager&rdquo; or &ldquo;Service&rdquo; to
            explain what your code does, you&apos;re admitting you don&apos;t
            know what your code does.
          </p>

          <h2>The DDD Delusion</h2>

          <p>&ldquo;But we use Domain-Driven Design!&rdquo;</p>

          <p>
            Do you? Or did you read the blue book, nod sagely at the word
            &ldquo;Aggregate,&rdquo; and then create a{" "}
            <code>CustomerAggregate</code> class that&apos;s actually just an
            anemic data container with 47 setter methods?
          </p>

          <p>
            Domain-Driven Design has good ideas. The problem is everyone claims
            to do it, and almost everyone does it wrong. They adopt the
            terminology: Entities, Value Objects, Repositories: without
            understanding the underlying principles. They think DDD means
            &ldquo;put your database tables in a folder called
            &lsquo;domain&rsquo;.&rdquo;
          </p>

          <p>It doesn&apos;t.</p>

          <p>
            The result: codebases full of domain-ish words pointing at
            architectural mush.
          </p>

          <h2>Why This Matters More Now</h2>

          <p>
            AI is a code-generation tsunami. In three years, most boilerplate
            will be LLM-generated. This is good: boilerplate is waste. But
            here&apos;s what won&apos;t be automated:
          </p>

          <p>
            <strong>Knowing what to ask for.</strong>
          </p>

          <Mermaid chart={`graph LR
    A[Developer Intent] --> B[AI Generation]
    B --> C[Code]
    A2[Unclear Intent] --> B2[AI Generation]
    B2 --> C2[Vomit Code]
    class A green
    class C green
    class A2 red
    class C2 red`} />

          <p>
            If you can&apos;t articulate what you want clearly, AI will give
            you working garbage. The better AI gets at generating code, the
            more critical your architectural clarity becomes. You need
            principles, not just syntax.
          </p>

          <p>You need craftsmanship.</p>

          <h2>What This Is</h2>

          <p>
            A knowledge garden for programming craftsmanship. Each article
            documents a principle: a theorem about how to write better code.
          </p>

          <p>The format:</p>
          <ol>
            <li><strong>The Principle</strong>: What you should do</li>
            <li><strong>The Demonstration</strong>: Why it works, with evidence</li>
            <li><strong>The Counterarguments</strong>: When it doesn&apos;t apply</li>
          </ol>

          <p>
            Not a tutorial site. If you need to know what a closure is,
            you&apos;re in the wrong place. Every article is opinionated. Claims
            will be made. Evidence will be shown. No hedging with
            &ldquo;arguably&rdquo; or &ldquo;it depends.&rdquo; Everything
            depends. We&apos;ll say things anyway.
          </p>

          <p>
            These articles exist because someone needs to call bullshit on
            &ldquo;best practices&rdquo; that aren&apos;t. Because AI makes
            beautiful code more valuable, not less. Because you&apos;ve opened a
            codebase and thought &ldquo;what the fuck is a{" "}
            <code>RequestProcessor</code>?&rdquo;
          </p>

          <p>
            <strong>Programming is a craft</strong>. The tools get better, but
            the fundamentals don&apos;t change. Beautiful code is still
            beautiful. Vomit code is still vomit.
          </p>

          <p>Let&apos;s make more of the former and less of the latter.</p>

          <div className="pt-4">
            <Link
              href="/docs/fundamentals/1-sorting"
              className="no-underline inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-colors text-base"
            >
              Read the first article →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
