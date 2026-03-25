import { baseOptions } from "@/lib/layout.shared";
import { HomeLayout } from "fumadocs-ui/layouts/home";

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <HomeLayout
      {...baseOptions()}
      links={[
        ...baseOptions().links!,
        {
          url: "/docs/fundamentals/modeling/primitives",
          text: "Fundamentals",
        },
        {
          url: "/docs/frontend/state",
          text: "Frontend",
        },
        {
          url: "/docs/infrastructure/migrations",
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
