import { Star } from "lucide-react";

async function getStarCount(): Promise<number | null> {
  try {
    const res = await fetch("https://api.github.com/repos/Almaju/blog", {
      next: { revalidate: 3600 },
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.stargazers_count ?? null;
  } catch {
    return null;
  }
}

export async function GitHubStarButton() {
  const stars = await getStarCount();

  return (
    <a
      href="https://github.com/Almaju/blog"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-md border border-fd-border bg-fd-secondary px-2.5 py-1 text-xs font-medium text-fd-secondary-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
    >
      <Star className="size-3.5" />
      <span>Star</span>
      {stars !== null && (
        <span className="rounded bg-fd-muted px-1 py-0.5 text-xs tabular-nums text-fd-muted-foreground">
          {stars >= 1000 ? `${(stars / 1000).toFixed(1)}k` : stars}
        </span>
      )}
    </a>
  );
}
