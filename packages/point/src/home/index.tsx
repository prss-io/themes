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
    <Page className="page-blog">
      <Header />
      <main className="pb-6">
        <section className="flex justify-center">
          <div className="relative mx-auto flex max-w-screen-xl flex-col gap-12 mt-6 w-full">
            <div className="container">
              <div className="row">
                <div class={cx("col", "col-12", heroClass)}>
                  <div className="hero__inner">
                    {(heroImageUrl || featuredImageUrl) && (
                      <div className="hero__left">
                        <div className="hero__image">
                          <img src={(heroImageUrl || featuredImageUrl)} alt={featuredImageAlt} />
                        </div>
                      </div>
                    )}

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

            {/* Articles Section */}
            <div className="w-full">
              <div className="row animate">
                {posts.map((post) => (
                  <a key={post.id} href={post.url} className="article col col-8 push-2 col-d-12 push-d-0">
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
        <section className="flex justify-center mx-auto flex max-w-screen-xl flex-col gap-20 lg:flex-row mt-6">
          <div className="container flex flex-col">
            {/* Blog link with arrow */}
            <div className="article col col-8 push-2 col-d-12 push-d-0">
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