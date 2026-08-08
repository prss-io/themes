import React from "react";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
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
        <section className="flex justify-center mx-auto flex max-w-screen-xl flex-col gap-20 lg:flex-row mt-6">
          <div className="container flex flex-col">
            <h1 className="text-3xl md:text-4xl font-bold lg:text-5xl mb-6">Blog</h1>
            <div className="post-content mb-12 text-lg text-muted-foreground md:text-xl lg:max-w-3xl">
              <ContentRenderer 
                content={content}
                className="post-inner-content"
              />
            </div>

            <div className="grid gap-y-10 sm:grid-cols-12 sm:gap-y-12 md:gap-y-16 lg:gap-y-20">
              {posts.map((post) => (
                <Card
                  key={post.id}
                  className="order-last border-0 bg-transparent shadow-none sm:order-first sm:col-span-12 lg:col-span-12 lg:col-start-0"
                >
                  <div className="grid gap-y-6 sm:grid-cols-10 sm:gap-x-5 sm:gap-y-0 md:items-center md:gap-x-8 lg:gap-x-12">
                    <div className="sm:col-span-5">
                      <h3 className="text-xl font-semibold md:text-2xl lg:text-3xl">
                        <a
                          href={post.url}
                          className="hover:underline"
                        >
                          {post.title}
                        </a>
                      </h3>
                      <p className="mt-4 text-muted-foreground md:mt-5">
                        {post.summary}
                      </p>
                      <div className="mt-6 flex items-center space-x-4 text-sm md:mt-8">
                        {post.author && (
                          <>
                            <span className="text-muted-foreground">{post.author}</span>
                            <span className="text-muted-foreground">•</span>
                          </>
                        )}
                        <span className="text-muted-foreground">
                          {post.published}
                        </span>
                      </div>
                      <div className="mt-6 flex items-center space-x-2 md:mt-8">
                        <a
                          href={post.url}
                          className="inline-flex items-center font-semibold hover:underline md:text-base"
                        >
                          <span>Read more</span>
                          <ArrowRight className="ml-2 size-4 transition-transform" />
                        </a>
                      </div>
                    </div>
                    <div className="order-first sm:order-last sm:col-span-5">
                      <a href={post.url} className="block">
                        <div className="aspect-[16/9] overflow-clip rounded-lg border border-border">
                          {post.image ? (
                            <img
                              src={post.image}
                              alt={post.title}
                              className="h-full w-full object-cover transition-opacity duration-200 fade-in transition-transform duration-300 hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground transition-opacity duration-200 fade-in hover:opacity-70"></div>
                          )}
                        </div>
                      </a>
                    </div>
                  </div>
                </Card>
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
        </section>
      </main>
      <Footer />
    </Page>
  );
};

export default Blog;