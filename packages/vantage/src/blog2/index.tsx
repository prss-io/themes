import React from "react";
import cx from "classnames";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Page from "@/components/Page";
import * as PRSS from "@prss/ui";

import { ContentRenderer } from "@prss/ui";

const Blog = data => {
  PRSS.init(data);
  (window as any).PRSS = PRSS;

  const { rootPath } = data;
  const { blogPosts, currentPage, totalPages, category } = PRSS.getProp("vars") as any;
  const { content, slug } = PRSS.getProp("item");
  const items = PRSS.getItems(["post", "post2"], true, blogPosts, category);
  const adjustedRootPath = currentPage === 1 ? rootPath : `../${rootPath}`;

  const posts = items.map((post) => {
    return {
      id: post.uuid,
      title: post.title,
      summary: post.content,
      label: "",
      author: "",
      published: PRSS.formattedDate(post.createdAt),
      url: post.url,
      image: post.vars?.featuredImageUrl || "",
      tags: ["Post"],
    };
  });

  return (
    <Page className="page-blog">
      <Header />
      <main className="pb-6">
        <section className="flex justify-center">
          <div className="relative mx-auto flex max-w-screen-xl flex-col gap-20 lg:flex-row mt-6">
            <header className="top-10 flex h-fit flex-col items-center gap-5 text-center lg:sticky lg:min-w-80 lg:items-start lg:gap-8 lg:text-left">
              <h1 className="text-4xl font-extrabold lg:text-5xl">Blog</h1>
              <div className="post-content text-muted-foreground lg:text-xl">
                <ContentRenderer 
                  content={content}
                  className="post-inner-content"
                />
              </div>
            </header>
            <div>
              <div className="grid gap-4 md:grid-cols-2">
                {posts.map((post) => (
                  <a
                    href={post.url}
                    className="group relative isolate h-80 rounded-lg bg-neutral-900 hover:shadow-md transition-shadow overflow-hidden"
                    key={post.id}
                  >
                    <div className="z-10 flex h-full flex-col-reverse justify-between p-6">
                      <p className="text-white opacity-75">
                        {post.published}
                      </p>
                      <h2 className="line-clamp-2 text-2xl font-medium transition-colors duration-500 text-white">
                        {post.title}
                      </h2>
                    </div>
                    {post.image ? (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="absolute inset-0 -z-10 size-full rounded-lg object-cover brightness-60 group-hover:brightness-30 transition-all duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 -z-10 size-full rounded-lg object-cover brightness-30 group-hover:brightness-50 transition-filter duration-500"></div>
                    )}
                  </a>
                ))}
              </div>
              <nav aria-label="Page navigation" className="mt-12 flex items-center justify-center">
                <ul className="pagination flex justify-content-center rounded-sm overflow-hidden">
                  {currentPage > 1 && (
                    <li className="page-item">
                      <a
                        className="page-link"
                        href={`${adjustedRootPath}${slug}/${currentPage - 1 === 1 ? "" : currentPage - 1}`}
                      >
                        Previous
                      </a>
                    </li>
                  )}
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNumber = i + 1;
                    const isActive = currentPage === pageNumber;
                    return (
                      <li key={i} className="page-item">
                        <a
                          href={`${pageNumber === 1 ? `${adjustedRootPath}${slug}/` : `${adjustedRootPath}${slug}/${pageNumber}/`}`}
                          className={cx("page-link", { active: isActive })}
                        >
                          {pageNumber}
                        </a>
                      </li>
                    );
                  })}
                  {currentPage < totalPages && (
                    <li className="page-item">
                      <a
                        className="page-link"
                        href={`${adjustedRootPath}${slug}/${currentPage + 1}`}
                      >
                        Next
                      </a>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </Page>
  );
};

export default Blog;