import { getAllPosts } from "@/lib/blog";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import "@/app/blog_content.css";
import BlogItem from "../blog/BlogItem";

interface IProps {
  params: { slug: string };
}

export const revalidate = 60;

// Generate metadata (normal SEO)
export async function generateMetadata({
  params,
}: IProps): Promise<Metadata> {
  const posts = await getAllPosts();
  const post = posts.find((p) => p.slug === params.slug);

  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : [],
    },
  };
}

export default async function BlogPost({ params }: IProps) {
  const posts = await getAllPosts();
  const post = posts.find((p) => p.slug === params.slug);

  if (!post) return notFound();

  // Find related blogs by tag
  const relatedBlogs = posts
    .filter((b) => b.tags && b.tags === post.tags && b.slug !== post.slug)
    .slice(0, 5);

  return (
    <section className="w-full container-layout py-10 ts:pt-20">
      <div className="grid grid-cols-4 ts:grid-cols-1 gap-6">
        <div className="space-y-6 col-span-3">
          {post.image ? (
            <div className="w-full overflow-hidden relative aspect-video ts:h-[15rem] group/blogitem">
              <Image
                className="size-full object-cover"
                src={post.image}
                alt={post.title ?? post.heading ?? "Blog post"}
                height={1200}
                width={1200}
              />
              <div className="size-full absolute bg-[#00000093] group-hover/blogitem:opacity-0 top-0 bottom-0 text-white flex items-end justify-between px-6 py-3 transition-all duration-700">
                <p className="tracking-widest">{post.by ?? "admin"}</p>
                <p className="px-3 py-1 bg-blue-700 flex-grow-0">{post.date}</p>
              </div>
            </div>
          ) : null}

          <h1 className="uppercase font-bold tracking-widest text-3xl text-gray-700 leading-10">
            {post.heading ?? post.title}
          </h1>

          <div
            className="not-tailwind blog_content !font-normal size-full space-y-3"
            dangerouslySetInnerHTML={{ __html: post.contentHtml ?? "" }}
          />
        </div>

        <div className="w-full px-5 space-y-5">
          <h2 className="font-semibold text-2xl tracking-widest text-gray-700">
            Related Blogs
          </h2>

          {relatedBlogs.length === 0 ? (
            <p className="text-sm text-gray-500 text-center tracking-widest">
              No Related blog available
            </p>
          ) : (
            <ul className="space-y-5">
              {relatedBlogs.map((b, currentIndex) => (
                <BlogItem
                  key={b.id || b.slug}
                  isRelatedblog={true}
                  blogInfo={b}
                  currentIndex={currentIndex}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}