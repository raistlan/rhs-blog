---
title: Making-of part one
date: june 5, 2025
---

## Making of: part one

Here are some of the extra things I had to make sure to do:

1. Sort the blog posts by something, I decided to use date
2. There's some duplicate code for things like headers that is just raw HTML. If I ever end up changing anything, I'll move those to a separate template at that time
3. I ended up breaking out all of the post logic that I wrote into it's own file (this is maybe against the spirit of a "minimum viable" blog since it's not really being served by two files)
   - This ended up causing me some heartburn to get Typescript compiling correctly, but this is a good thing to learn through
   - It works when I use everything on one `server.ts` page, but not when I try to break it out to `posts.ts`
   - It helps when you write `class`es instead of `const`s for services 🤦
   - Also had a very minor hiccup trying to decide between using `ts-node` or `tsc --watch` and ended up just going with `ts-node` for ease of use. It's just a little slow
4. Now I'm going to work on getting it deployed using DigitalOcean
   - Okay D/O doesn't seem to work if I don't want to pay any money
5. Checking Vercel now, since lots of people are recommending this
   - Seems pretty easy, but I didn't have my package.json configured to build
   - Testing that it now builds a /dist folder and then I'll re-deploy with Vercel
6. Shout-out to [Victor Cora Colombo](https://vccolombo.github.io/blog/tsc-how-to-copy-non-typescript-files-when-building/) for his blog post that details copying extra files when building typescript
   - The key here is creating some additional `package.json` `scripts` that you can run to `clean` and `copy-files`
   - You can do it manually, but he recommends importing a couple of packages to do it for you
   - This is because you can't just trust a bash command to work on any environment you run it on
   - So downloading packages (or writing my own) is the best method forward
7. Going to attempt to re-deploy now
   - Had to do another rename to follow [this](https://vercel.com/guides/using-express-with-vercel#standalone-express)
   - Ultimately most of the problem just seems to be that Vercel needs to know what to build and where to look for the artifacts
   - I had to also make sure to add a `vercel.json` config file as well
   - The big blocker was that Vercel wants my directory structure to include a `/api` folder, and I needed my main typescript file to be `index.ts` -- this way when it gets built/compiled into my `/dist` folder, there is a valid `index` for Vercel to pick up and serve. I had to also rename my `index.html` template to `home.html`
   - I currently have `vercel dev` and `npm run dev` working locally, which is encouraging
   - Resorted to using [v0.dev](https://v0.dev/chat/9a7yg5uqO57) -- trying one last thing and then going to bed since it's 4:28AM
8. Woke up late but still went for a run today, made a bacon, spinach, and egg hash for breakfast, and then got back to work on this.
9. First step was creating a new directory for the Next.JS app and getting some of the files that I would need copied over
10. Then made sure to get my global style sheet configured correctly before I tackled any of the routing issues
11. Was able to pretty easily convert the code that I had before into React components -- which allowed me to re-use a lot of the things like the headers and template.html that I had before. I just had to convert it to React code.
12. Porting the service code for the posts was really easy, but I did stumble a bit once the markdown was being spit out -- I used a very easy .md -> .html converter but was missing a lot of global styling due to Tailwind's css reset. Updating globals.css easily fixed that
13. Ended up moving some files around a bit more based on how I like things laid out, I'm pretty content with how things are laid out now.
14. Time to run `vercel` and see if I can just deploy this magically
15. Ran into a problem with the param of `slug` being sent to the Post component for rendering. Simple to fix this by following the steps here: [generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params).

    - Basically what is happening here is that Next.js can statically generate all of the routes for each of the posts that I have by defining this function
    - Pretty cool because then I assume that this all happens at compile time because everything is static, letting us serve the page faster
    - See [the docs on static-rendering](https://nextjs.org/docs/app/getting-started/partial-prerendering#static-rendering)
    - The code for this is really simple:
    - ```typescript
      export async function generateStaticParams() {
        const postsService = new PostsService();
        const posts = await postsService.getAllPosts();

        return posts
          .filter(({ title }) => title.endsWith(".md"))
          .map(({ title }) => ({
            slug: title.replace(/\.md$/, ""),
          }));
      }
      ```

    - It just fetches all the posts and for each of them returns what the slug would be, which is effectively the url: `/blog/making-of` in this case

Thanks for following along! Check out the github repo!
