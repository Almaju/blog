import HomeContent from "@/content/home.mdx";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="flex flex-col items-center justify-center py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Principles, not platitudes.
            </span>
          </h1>
        </div>
      </section>

      <section className="py-20 px-4 border-t">
        <div className="max-w-2xl mx-auto prose prose-neutral dark:prose-invert">
          <HomeContent />
        </div>
      </section>
    </div>
  );
}
