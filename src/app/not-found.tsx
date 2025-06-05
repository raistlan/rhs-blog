import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h1>Blog post not found</h1>
      <Link href="/">
        <span className="text-xl hover:underline hover:underline-offset-4 cursor-pointer">
          Back to home
        </span>
      </Link>
    </div>
  );
}
