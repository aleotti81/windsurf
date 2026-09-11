import type { NavigationLink } from "@/components/Navigation";
import type { ScrollExperienceConfig } from "@/components/ScrollExperience/types";

export interface SiteConfig extends ScrollExperienceConfig {
  brand: string;
  nav: NavigationLink[];
  seo: {
    title: string;
    description: string;
    url: string;
    ogImage: string;
    locale: string;
  };
}

/**
 * The only file you need to edit to publish a new site: swap the copy, point
 * the sections at your own files in `public/images/`, pick a transition.
 */
export const site: SiteConfig = {
  brand: "Happy Tuscany",
  nav: [
    { label: "The Land", href: "#land" },
    { label: "The Experience", href: "#experience" },
    { label: "Contact", href: "mailto:hello@happytuscany.com" },
  ],
  transition: "horizontal-blinds",
  animation: {
    duration: 1,
    scrub: 2,
    stagger: 0.02,
    ease: "none",
  },
  sections: [
    {
      id: "hero",
      image: "/images/01.jpg",
      imageAlt: "Cypress lined road across the Tuscan hills at sunrise",
      eyebrow: "Welcome to",
      title: "Happy Tuscany",
      subtitle: "A different way to experience Tuscany",
      description: "A private house in the hills of the Valdichiana.",
      cta: { label: "Book your stay", href: "mailto:hello@happytuscany.com" },
    },
    {
      id: "land",
      image: "/images/02.jpg",
      imageAlt: "Olive groves and vineyards in the Valdichiana valley",
      eyebrow: "The Land",
      title: "Valdichiana",
      subtitle: "Slow Tuscany",
      description: "Olive trees, vineyards and ancient villages.",
    },
    {
      id: "experience",
      image: "/images/03.jpg",
      imageAlt: "Table set for dinner in a Tuscan courtyard at dusk",
      eyebrow: "The Experience",
      title: "Live Tuscany",
      subtitle: "Not just a holiday",
      description: "Discover Tuscany from a local perspective.",
      cta: { label: "See the house", href: "#hero" },
    },
  ],
  seo: {
    title: "Happy Tuscany — A different way to experience Tuscany",
    description:
      "A private house in the hills of the Valdichiana: olive trees, vineyards and ancient villages.",
    url: "https://example.com",
    ogImage: "/images/01.jpg",
    locale: "en_US",
  },
};
