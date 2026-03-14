import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="py-20 px-4">
      <div className="max-w-2xl mx-auto prose prose-neutral dark:prose-invert">
        <h1>About</h1>

        <p>I&apos;ve been writing code since I was 8. I&apos;m still annoyed by the same things. Senior Software Engineer at Mozilla by day.</p>

        <p>
          Bad names. Layers that exist to signal architecture rather than solve
          problems. Tests that pass but don&apos;t test anything. The ritual
          adoption of patterns nobody actually understands. These aren&apos;t
          new problems. They&apos;re getting worse.
        </p>

        <p>
          I write mostly in Rust and TypeScript. Not for the aesthetic. Rust
          makes you own your decisions in a way most languages let you defer.
          TypeScript makes the implicit explicit. Both force precision. Precision
          is the point.
        </p>

        <h2>On AI</h2>

        <p>
          AI writes code fast. It also writes plausible-looking garbage fast.
          The output is only as good as the intent behind the prompt, and most
          prompts are vague because most mental models are vague.
        </p>

        <p>
          The engineers who will do well are the ones who know exactly what they
          want and can tell when what they got is wrong. That requires
          principles, not just syntax.
        </p>

        <h2>Why this exists</h2>

        <p>
          I kept explaining the same things in code reviews. Why alphabetical
          order in methods is not pedantry. Why naming a class after an
          architectural layer is not a name. Why &quot;it works&quot; is a floor,
          not a ceiling.
        </p>

        <p>Writing it down is faster.</p>

        <h2>Contact</h2>

        <ul>
          <li>
            <Link href="https://github.com/Almaju" target="_blank">
              GitHub
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
