import Link from "next/link";
import Header from "./header";
import { PostsService } from "../lib/posts";

export default async function Home() {
  const postsService = new PostsService();
  const posts = await postsService.getAllPosts();
  return (
    <div>
      <Header />
      <h2>This is a blog?</h2>
      These are my posts so far:
      <ul>
        {posts.length === 0 && <li>No posts yet. Check back later!</li>}
        {posts.map((post) => {
          return (
            <li
              key={post.url}
            >
              <Link
                href={post.url}
                className="hover:underline hover:underline-offset-4"
              >
                {post.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
