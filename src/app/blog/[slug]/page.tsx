import { PostsService } from "../../../lib/posts";
import Header from "../../header";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

interface PostProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const postsService = new PostsService();
  const posts = await postsService.getAllPosts();

  return posts
    .filter(({ title }) => title.endsWith(".md"))
    .map(({ title }) => ({
      slug: title.replace(/\.md$/, ""),
    }))
}

export default async function Post({ params }: PostProps) {
  const { slug } = await params;
  const postsService = new PostsService();
  const post = await postsService.getPostData(`${slug}.md`);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Header />
      <ReactMarkdown>{post.content}</ReactMarkdown>
      <div className="text-[#9e9e9e] text-[0.75em] leading-[1.375em] mt-0.5">
        from {post.date}
      </div>
    </>
  );
}