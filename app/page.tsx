import { Navigation } from "@/components/Navigation";
import { ScrollExperience } from "@/components/ScrollExperience/ScrollExperience";
import { site } from "@/data/site";

export default function Home() {
  return (
    <main>
      <Navigation brand={site.brand} links={site.nav} />
      <ScrollExperience
        sections={site.sections}
        transition={site.transition}
        animation={site.animation}
        cells={site.cells}
      />
    </main>
  );
}
