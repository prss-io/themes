import React from "react";
import * as PRSS from "@prss/ui";
import { ArrowRight, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Page from "@/components/Page";
import { isset } from "@/lib/utils";
import Aside from "@/components/Aside";

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
          <div className="relative mx-auto flex max-w-screen-xl flex-col gap-10 lg:flex-row mt-6">
            {/* Left Column - Sticky Post Info - 30% width */}
            <header className="top-10 flex h-fit flex-col gap-5 lg:sticky lg:w-[30%] lg:gap-6 py-6">
              <h1 className="text-3xl md:text-4xl font-bold lg:text-5xl">{postTitle}</h1>
              
              {createdAt && (
                <div className="flex items-center text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{PRSS.formattedDate(createdAt)}</span>
                </div>
              )}
              
              {PRSS.getProp("vars")?.asideHtml && (
                <div className="mt-6">
                  <Aside name="asideHtml" />
                </div>
              )}
            </header>
            
            {/* Right Column - Post Content - 70% width */}
            <div className="w-full lg:w-[70%]">
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

              {content && content.trim().length && (
                <div className="post-content prose dark:prose-invert max-w-none pb-12 border-b">
                  <div
                    className="post-inner-content"
                    dangerouslySetInnerHTML={{
                      __html: content
                    }}
                  />
                </div>
              )}

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

              {/* If you want to include sidebar content in mobile view */}
              {isset(sidebarHtml || sidebarAsideHtml) && (
                <div className="lg:hidden mt-8">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: sidebarHtml
                    }}
                  />
                  <Aside name="sidebarAsideHtml" />
                </div>
              )}
            </div>
            
            {/* Sidebar as a third column (optional) */}
            {isset(sidebarHtml || sidebarAsideHtml) && (
              <div className="hidden lg:block lg:w-64">
                <div className="sticky top-10">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: sidebarHtml
                    }}
                  />
                  <Aside name="sidebarAsideHtml" />
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </Page>
  );
};

export default Post;
