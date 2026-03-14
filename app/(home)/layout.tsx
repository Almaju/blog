import { baseOptions } from "@/lib/layout.shared";
import { HomeLayout } from "fumadocs-ui/layouts/home";

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <HomeLayout
      {...baseOptions()}
      links={[
        ...baseOptions().links!,
        {
          url: "/docs/fundamentals/1-sorting",
          text: "Fundamentals",
        },
        {
          url: "/docs/infrastructure/1-migrations",
          text: "Infrastructure",
        },
        {
          url: "/about",
          text: "About",
        },
      ]}
    >
      {children}
    </HomeLayout>
  );
}
