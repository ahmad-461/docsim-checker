import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://docsimchecker.com";

  const routes = [
    { url: "", priority: 1.0, changeFrequency: "daily" as const },
    { url: "/how-it-works", priority: 0.8, changeFrequency: "weekly" as const },
    { url: "/pricing", priority: 0.8, changeFrequency: "weekly" as const },
    { url: "/about", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/faq", priority: 0.7, changeFrequency: "weekly" as const },
    { url: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/tools/word-counter", priority: 0.8, changeFrequency: "weekly" as const },
    { url: "/tools/case-converter", priority: 0.8, changeFrequency: "weekly" as const },
    { url: "/tools/duplicate-line-remover", priority: 0.8, changeFrequency: "weekly" as const },
    { url: "/changelog", priority: 0.5, changeFrequency: "monthly" as const },
    { url: "/privacy", priority: 0.3, changeFrequency: "monthly" as const },
    { url: "/terms", priority: 0.3, changeFrequency: "monthly" as const },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.url}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
