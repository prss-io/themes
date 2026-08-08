import React from "react";
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";
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
      createdAt: post.createdAt,
    };
  });

  // Group posts by year
  const postsByYear = posts.reduce((acc, post) => {
    const year = new Date(post.createdAt).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(post);
    return acc;
  }, {} as Record<number, typeof posts>);

  // Sort years in descending order
  const sortedYears = Object.keys(postsByYear)
    .map(year => parseInt(year))
    .sort((a, b) => b - a);

  return (
    <Page className="page-blog">
      <Header />
      <main className="py-12">
        <section className="flex justify-center mx-auto flex max-w-screen-xl flex-col gap-20 lg:flex-row">
          <div className="container flex flex-col">
            <h1 className="page__title">Blog</h1>
            <div className="post-content mb-16 text-lg text-muted-foreground md:text-xl">
              <ContentRenderer 
                content={content}
                className="post-inner-content page__content"
              />
            </div>

            <div className="animate">
              {sortedYears.map((year) => (
                <div key={year} className="mb-12">
                  <h2 className="text-2xl font-bold text-foreground pb-4">
                    {year}
                  </h2>
                  <div className="articles-grid grid sm:grid-cols-12">
                    {postsByYear[year].map((post) => (
                      <Card
                        key={post.id}
                        className="article-card order-last border-0 bg-transparent shadow-none sm:order-first sm:col-span-12 lg:col-span-12 lg:col-start-0"
                      >
                        <div className="border-l-[2px] py-4 pt-10 grid sm:grid-cols-10 md:items-center">
                          <div className="sm:col-span-12">
                            <h3 className="text-xl font-semibold md:text-2xl lg:text-3x">
                              <a
                                href={post.url}
                                className="article__title hover:underline"
                              >
                                {post.title}
                              </a>
                            </h3>
                            <div className="mb-2 flex items-center space-x-2 md:mb-4">
                              <Calendar className="size-5 mr-2" /> {post.published}
                            </div>
                            <p className="mt-4 text-muted-foreground md:mt-5">
                              {post.summary}
                            </p>
                            <div className="mt-4 flex items-center space-x-4 text-sm">
                              <span className="text-muted-foreground">
                                <a
                                  href={post.url}
                                  className="inline-flex items-center font-semibold hover:underline md:text-base"
                                >
                                  <span>Read more</span>
                                  <ArrowRight className="ml-2 size-4 transition-transform" />
                              </a>
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <nav aria-label="Page navigation" className="mt-12 flex items-center justify-center">
              <ul className="pagination flex justify-content-center overflow-hidden">
                {currentPage > 1 && (
                  <li className="page-item">
                    <a
                      className="page-link"
                      href={`${adjustedRootPath}blog/${currentPage - 1 === 1 ? "" : currentPage - 1}`}
                    >
                        <ArrowLeft className="right-arr d-inline h-6 w-6 transition-transform group-hover:translate-x-1" />
                    </a>
                  </li>
                )}
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNumber = i + 1;
                  const isActive = currentPage === pageNumber;
                  return (
                    <li key={i} className="page-item">
                      <a
                        href={`${pageNumber === 1 ? `${adjustedRootPath}blog/` : `${adjustedRootPath}blog/${pageNumber}/`}`}
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
                      href={`${adjustedRootPath}blog/${currentPage + 1}`}
                    >
                        <ArrowRight className="right-arr d-inline h-6 w-6 transition-transform group-hover:translate-x-1" />
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