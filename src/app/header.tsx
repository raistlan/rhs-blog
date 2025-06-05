import Link from "next/link";

export default function Header() {
  return (
    <>
      <Link href="/" passHref>
        <span className="text-xl hover:underline hover:underline-offset-4 cursor-pointer">
          Raist•lan
        </span>
      </Link>
      <div className="text-[#9e9e9e] text-[0.6em] h-4 leading-4">
        /ˈreɪs.lən/
      </div>
      <span className="text-[#9e9e9e] text-[0.75em] leading-[1.375em] pt-2">
        proper noun
      </span>
      <div className="ml-4">
        a product-minded engineer whose browser tabs are a mix of LeetCode, film
        reviews, and running shoes; known for spearheading maintainability and
        cross-team collaboration.
        <div className="text-[#9e9e9e] text-[0.75em] leading-[1.375em] mt-0.5">
          &quot;What distinguishes Raistlan is his collaborative approach to
          software development.&quot;
        </div>
      </div>
      <hr className="my-12 border-[#9e9e9e]" />
    </>
  );
}
