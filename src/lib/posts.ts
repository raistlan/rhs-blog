import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface PostData {
  title: string;
  date: string;
  url: string;
  content: string;
  excerpt?: string;
}

export class PostsService {
  private postsDirectory: string;

  constructor() {
    this.postsDirectory = path.join(process.cwd(), "src/posts");
  }

  async getAllPosts(): Promise<PostData[]> {
    if (!fs.existsSync(this.postsDirectory)) {
      return [];
    }

    const filenames = await fs.promises.readdir(this.postsDirectory);

    const posts = await Promise.all(
      filenames
        .filter((name) => name.endsWith(".md"))
        .map(async (filename) => await this.getPostData(filename))
    );

    return posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async getPostData(filename: string): Promise<PostData> {
    const filePath = path.join(this.postsDirectory, filename);
    const fileContents = await fs.promises.readFile(filePath, "utf8");
    const { data, content } = matter(fileContents);

    const slug = filename.replace(/\.md$/, "");

    return {
      title: data.title || slug,
      date: data.date || new Date().toISOString(),
      url: `/blog/${slug}`,
      content,
      excerpt: data.excerpt,
    };
  }
}
