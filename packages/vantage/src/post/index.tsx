import React from "react";
import * as PRSS from "@prss/ui";
import { ArrowRight, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Page from "@/components/Page";
import { isset } from "@/lib/utils";
import Aside from "@/components/Aside";

import { ContentRenderer } from "@prss/ui";

const Post = data => {
  PRSS.init(data);
  (window as any).PRSS = PRSS;

  const { featuredImageUrl, featuredImageAuthor, featuredImageAuthorLink, featuredImageAlt, sidebarAsideHtml } = PRSS.getProp(
    "vars"
  ) as any;

  const { content, title: postTitle, createdAt } = PRSS.getProp(
    "item"
  );
  const sidebarHtml = PRSS.getProp("sidebarHtml");
  const { rootPath } = PRSS.getAllProps();

  return (
    <Page className="page-post">
      <Header />
      <main className="pb-6">
        <section className="flex justify-center">
          <div className="relative mx-auto flex max-w-screen-xl flex-col gap-2 mt-6 w-full">
            {/* Header - Full Width */}
            <header className="flex flex-col gap-5 py-6">
              <h1 className="text-3xl md:text-4xl font-bold lg:text-5xl">{postTitle}</h1>
              
              {createdAt && (
                <div className="flex items-center text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{PRSS.formattedDate(createdAt)}</span>
                </div>
              )}
              
              {PRSS.getProp("vars")?.asideHtml && (
                <div className="mt-4">
                  <Aside name="asideHtml" />
                </div>
              )}
            </header>
            
            {/* Post Content - Full Width */}
            <div className="w-full">
              {featuredImageUrl && (
                <div className="mb-8 rounded-lg overflow-hidden relative h-[500px]">
                  <img 
                    src={featuredImageUrl} 
                    alt={featuredImageAlt || postTitle} 
                    className="w-full h-full object-cover object-top"
                  />
                  {featuredImageAuthor && featuredImageAuthorLink && (
                    <div className="absolute bottom-0 right-0 bg-black/60 text-white text-xs py-1 px-2 rounded-tl">
                      <span>
                        Photo by{" "}
                        <a href={featuredImageAuthorLink} target="_blank" rel="noreferrer" className="text-white hover:underline">
                          {featuredImageAuthor} via Pexels
                        </a>
                      </span>
                    </div>
                  )}
                </div>
              )}

                <div className="post-content prose dark:prose-invert max-w-none pb-12 border-b">
                  <ContentRenderer 
                    content={content}
                    className="post-inner-content"
                  />
                </div>

              {/* Blog link with arrow */}
              <div className="mt-8 flex justify-end">
                <a 
                  href={`${rootPath}blog`} 
                  className="group inline-flex items-center gap-2 text-primary font-medium hover:underline"
                >
                  Back to Blog
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>

              {/* If you want to include sidebar content */}
              {isset(sidebarHtml || sidebarAsideHtml) && (
                <div className="mt-8">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: sidebarHtml
                    }}
                  />
                  <Aside name="sidebarAsideHtml" />
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </Page>
  );
};

export default Post;
