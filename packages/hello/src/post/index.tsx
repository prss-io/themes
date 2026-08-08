import React from "react";
import * as PRSS from "@prss/ui";
import { ArrowRight } from "lucide-react";
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
      <main className="py-12 col">
        <section className="flex justify-center">
          <div className="relative mx-auto flex max-w-screen-xl flex-col gap-2 w-full">

            {/* Header - Full Width */}
            <header className="flex flex-col gap-5">
              <h1 className="text-3xl md:text-4xl font-bold lg:text-5xl post__title mb-0" style={{ marginBottom: 0 }}>{postTitle}</h1>
              {createdAt && (
                <div className="mb-2 flex items-center space-x-2 md:mb-2">
                  {PRSS.formattedDate(createdAt)}
                </div>
              )}

              {featuredImageUrl && (
              <div className="mb-8 relative max-h-[500px]">
                <img 
                  src={featuredImageUrl} 
                  alt={featuredImageAlt || postTitle} 
                  className="w-full h-full object-cover max-h-[500px]"
                />
                {featuredImageAuthor && featuredImageAuthorLink && (
                  <div className="text-xs justify-end flex mt-1">
                    <span>
                      Photo by{" "}
                      <a href={featuredImageAuthorLink} target="_blank" rel="noreferrer" className="hover:underline">
                        {featuredImageAuthor} via Pexels
                      </a>
                    </span>
                  </div>
                )}
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
                <div className="post-content prose dark:prose-invert max-w-none pb-12">
                  <ContentRenderer 
                    content={content}
                    className="post-inner-content page__content"
                  />
                </div>

              {/* Blog link with arrow */}
              <div className="mt-1 flex justify-end">
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
