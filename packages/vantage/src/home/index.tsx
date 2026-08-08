import React from "react";
import { ArrowRight, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Page from "@/components/Page";
import * as PRSS from "@prss/ui";

import { ContentRenderer } from "@prss/ui";

const Home = data => {
  PRSS.init(data);
  (window as any).PRSS = PRSS;

  const { blogPosts } = PRSS.getProp("vars") as any;
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
            {/* Hero Section */}
            <div className="w-full text-lg md:text-xl opacity-90 max-w-2xl">
                <section className="post-content">
                  <ContentRenderer 
                    content={content}
                    className="post-inner-content"
                  />
                </section>
            </div>

            {/* Articles Section */}
            <div className="w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Latest Articles</h2>
                <a href={`${rootPath}blog`} className="text-primary flex items-center gap-1 hover:underline">
                  View all <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <a key={post.id} href={post.url} className="block group">
                    <Card className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow border border-border group-hover:border-primary/20">
                      {post.image ? (
                        <div className="relative h-48 overflow-hidden">
                          <img src={post.image} alt={post.title} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-48 bg-muted text-muted-foreground">
                          <FileText className="h-12 w-12" />
                        </div>
                      )}
                      <div className="p-5 flex flex-col flex-grow">
                        <h3 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground mb-8 mt-2 line-clamp-3">{post.summary}</p>
                        <div className="mt-auto flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{post.published}</span>
                          <span className="text-primary flex items-center gap-1 text-sm">
                            Read more <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                          </span>
                        </div>
                      </div>
                    </Card>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </Page>
  );
};

export default Home;