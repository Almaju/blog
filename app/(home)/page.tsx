import Link from "next/link";
import { BookOpen, Code, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-muted/50 text-sm mb-4">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Documenting my journey</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              The Unwrap
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A place to document my journey, remember past mistakes, and learn
            from them.
            <br />
            <span className="text-base md:text-lg">
              If it helps you along the way, that's even better.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/docs/fundamentals"
              className="inline-flex items-center gap-2 px-6 py-3 border hover:bg-muted rounded-lg font-semibold transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 border-t">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why This Exists
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A personal documentation site built for learning and sharing
              knowledge
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg border bg-card hover:border-foreground/20 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Documentation</h3>
              <p className="text-muted-foreground">
                Capture learnings, patterns, and solutions for future reference
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card hover:border-foreground/20 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Knowledge Sharing</h3>
              <p className="text-muted-foreground">
                Share insights and experiences that might help others on their
                journey
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card hover:border-foreground/20 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Continuous Learning
              </h3>
              <p className="text-muted-foreground">
                A living record of growth, mistakes, and discoveries in software
                engineering
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 border-t bg-muted/30">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">About Me</h2>
          <div className="space-y-4 text-lg text-muted-foreground">
            <p>
              I'm a software engineer working at{" "}
              <span className="font-semibold text-foreground">Mozilla</span>.
            </p>
            <p>
              I love coding and I want to share my knowledge with the world.
            </p>
            <p>
              This website is primarily for me : a place to document my journey,
              remember past mistakes, and learn from them. But if it helps you
              along the way, that's even better.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
