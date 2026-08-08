import React from "react";
import { ArrowRight } from "lucide-react";
import cx from "classnames";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Page from "@/components/Page";
import * as PRSS from "@prss/ui";

import { ContentRenderer } from "@prss/ui";

const Home = data => {
  PRSS.init(data);
  (window as any).PRSS = PRSS;

  const { blogPosts, featuredImageUrl, featuredImageAlt, heroTitle, heroMessage, heroClass, heroImageUrl } = PRSS.getProp("vars") as any;
  const { content } = PRSS.getProp("item");
  const items = PRSS.getItems("post", true, blogPosts);
  const { rootPath } = PRSS.getAllProps();
  
  const posts = items.slice(0, 6).map((post) => {
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
    <Page className="page-home">
      <Header />
      <main className="pb-6">
        <div className="page-hero" style={{ backgroundColor: "var(--background-alt-color)" }}>
          {(heroImageUrl || featuredImageUrl) && (
            <div className="hero__bg" style={{ backgroundImage: `url(${heroImageUrl || featuredImageUrl})` }} />
          )}
          <div className="row z-1">
            <div class={cx("container", "col-12", heroClass)}>
              <div className="col hero__inner">
                <div className="hero__right">
                  {heroTitle && (
                    <h1 className="hero__title">{heroTitle}</h1>
                  )}

                  {heroMessage && (
                    <ContentRenderer 
                      content={heroMessage}
                      className="hero__description"
                    />
                  )}

                  {content ? (
                    <ContentRenderer 
                      content={content}
                      className="post-inner-content page__content"
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
        <section className="flex justify-center">
          <div className="relative mx-auto overflow-hidden flex max-w-screen-xl flex-col gap-12 w-full">
            {/* Articles Section */}
            <div className="w-full pt-4">
              <div className="row animate">
                {posts.map((post) => (
                  <a key={post.id} href={post.url} className="article col mx-auto md:max-w-screen-md w-full">
                    <div className="article__content">
                      <div className="p-5 flex flex-col flex-grow">
                        <div className="mt-auto flex items-center justify-between article__meta">
                          <span className="text-sm text-muted-foreground text-bold">{post.published}</span>
                        </div>
                        <h3 className="article__title d-inline">
                          {post.title} <ArrowRight className="right-arr d-inline h-8 w-8 transition-transform group-hover:translate-x-1" />
                        </h3>
                        <p className="article__excerpt line-clamp-3">{post.summary}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="flex justify-center mx-auto flex col md:max-w-screen-md mt-6">
          <div className="container flex flex-col justify-end">
            {/* Blog link with arrow */}
            <div className="">
              <a 
                href={`${rootPath}blog`} 
                className="group inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                View all
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </Page>
  );
};

export default Home;