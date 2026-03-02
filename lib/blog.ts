import { blogData } from "@/app/blog/blogData";
import { IBlogInfo } from "@/app/types";

export interface BlogPost extends IBlogInfo {
  slug: string;
  title?: string;
  excerpt?: string;
  contentHtml?: string;
}

/**
 * Parse date strings like "13th Jun, 2024", "Apr 18, 2025", "May 5, 2025"
 */
function parseDate(dateStr: string): number {
  // Handle "13th Jun, 2024" format - remove ordinals (st, nd, rd, th)
  const cleaned = dateStr.replace(/(\d+)(st|nd|rd|th)/, "$1");
  const parsed = new Date(cleaned);
  return isNaN(parsed.getTime()) ? 0 : parsed.getTime();
}

const WP_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

export async function getAllPosts(): Promise<BlogPost[]> {
  const localPosts = blogData.map((blog) => ({
    ...blog,
    slug: blog.link.replace(/^\//, ""),
    title: blog.heading,
    excerpt: blog.heading,
    contentHtml: "",
  }));

  let wpPosts: BlogPost[] = [];

  if (WP_API_URL) {
    try {
      const res = await fetch(`${WP_API_URL}/wp-json/wp/v2/posts?_embed&per_page=100`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        wpPosts = data.map((post: any) => {
          const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
          return {
            id: post.id.toString(),
            heading: post.title.rendered,
            image: featuredMedia || "",
            altTag: post.title.rendered,
            by: post._embedded?.author?.[0]?.name || "admin",
            date: new Date(post.date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
            tags: post._embedded?.["wp:term"]?.[0]?.map((t: any) => t.name).join(", ") || "",
            link: `/${post.slug}`,
            slug: post.slug,
            title: post.title.rendered,
            excerpt: post.excerpt?.rendered?.replace(/<[^>]+>/g, "") || post.title.rendered,
            contentHtml: post.content?.rendered || "",
          };
        });
      }
    } catch (error) {
      console.error("Failed to fetch WordPress posts", error);
    }
  }

  return [...localPosts, ...wpPosts].sort(
    (a, b) => parseDate(b.date) - parseDate(a.date)
  );
}
