import React from "react";
import * as PRSS from "@prss/ui";
import cx from "classnames";
import { ChevronDown, ChevronRight, ChevronLeft } from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Page from "@/components/Page";
import Aside from "@/components/Aside";
import { Menu } from "@prss/ui";
import { isset } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import { ContentRenderer } from "@prss/ui";

const Docs = data => {
  PRSS.init(data);
  (window as any).PRSS = PRSS;

  const {
    featuredImageUrl,
    sidebarMenu,
    footerCta,
    warningHtml,
    contentFooterHtml,
    heroTitle,
    docsImageUrl
  } = PRSS.getProp("vars") as IVars;

  const { content, uuid: postId, title: postTitle } = PRSS.getProp("item");
  const sidebarHtml = PRSS.getProp("sidebarHtml");
  const items = PRSS.getItems("post").filter(item => item.uuid !== postId);

  // Helper function to check if a node should be active (includes parent activation)
  const isNodeActive = (node: any) => {
    // Check if this node is the active item
    if (node.key === postId) {
      return true;
    }
    
    // Check if this node contains the active item in its children
    if (PRSS.hasItem(postId, node)) {
      return true;
    }
    
    return false;
  };

  // Custom menu item renderer for documentation sidebar
  const renderDocMenuItem = (node: any) => {
    const post = PRSS.getItem(node.key);
    const nodeChildren = node?.children || [];
    const hasChildren = nodeChildren.length > 0;
    const isActive = isNodeActive(node);
    
    return (
      <li key={node.key} className={cx("mb-1", { "active": isActive })}>
        <a 
          href={post?.url}
          className={cx(
            "block py-2 px-3 rounded-md transition-colors text-sm",
            isActive 
              ? "bg-primary/10 text-primary font-medium border-primary pl-4" 
              : "hover:bg-muted"
          )}
        >
          {node.title || post?.title}
        </a>
        
        {hasChildren && (
          <ul className="pl-2 mt-1 ml-3 space-y-1 border-l border-border">
            {nodeChildren.map(childNode => {
              const childPost = PRSS.getItem(childNode.key);
              const isChildActive = childNode.key === postId;
              
              return (
                <li key={childNode.key} className={isChildActive ? "active" : ""}>
                  <a 
                    href={childPost?.url}
                    className={cx(
                      "block py-1.5 px-3 rounded-md transition-colors text-sm",
                      isChildActive 
                        ? "bg-primary/10 text-primary font-medium border-primary pl-4" 
                        : "hover:bg-muted text-muted-foreground"
                    )}
                  >
                    {childNode.title || childPost?.title}
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </li>
    );
  };

  // Renderer for prev/next navigation
  const renderPrevNextItem = (node: any, index: number, isFirst: boolean, isLast: boolean) => {
    const isActive = node.key === postId;
    
    if (!isActive) return null;
    
    const prevNode = !isFirst ? items[index - 1] : null;
    const nextNode = !isLast ? items[index + 1] : null;
    
    return (
      <div className="flex justify-between w-full">
        {prevNode && (
          <a href={prevNode.url} className="flex items-center text-primary hover:underline">
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span>Previous</span>
          </a>
        )}
        
        {nextNode && (
          <a href={nextNode.url} className="flex items-center text-primary hover:underline ml-auto">
            <span>Next</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </a>
        )}
      </div>
    );
  };

  return (
    <Page className="page-docs">
      <Header />
      <main className="pb-6">
        <section className="flex justify-center mx-auto flex max-w-screen-xl flex-col gap-20 lg:flex-row mt-6">
          <div className="relative mx-auto flex max-w-screen-xl w-full flex-col">
            {/* Featured Image Banner */}
            {featuredImageUrl && (
              <div 
                className="w-full h-48 bg-cover bg-center rounded-b-lg overflow-hidden mb-5"
                style={{
                  backgroundImage: `url(${featuredImageUrl})`
                }}
              />
            )}

            {/* Title Section */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1">
                  {docsImageUrl ? (
                    <img 
                      src={docsImageUrl} 
                      alt={heroTitle || postTitle}
                      className="docs-image max-h-24 w-auto mb-6"
                    />
                  ) : (
                    <h1 className="text-3xl md:text-4xl font-bold lg:text-5xl mb-6">{heroTitle || postTitle}</h1>
                  )}
                </div>
                {PRSS.getProp("vars")?.asideHtml && (
                  <Aside name="asideHtml" />
                )}
              </div>
            </div>

            {/* Content Layout */}
            <div className="flex flex-col lg:flex-row">
              {/* Documentation Sidebar */}
              {isset(sidebarMenu) && (
                <aside className="sidebar-menu w-full min-w-[180px] lg:w-[180px] shrink-0">
                  {/* Mobile Menu Toggle */}
                  <div className="lg:hidden mb-4">
                    <Button 
                      variant="outline" 
                      className="flex w-full items-center justify-between"
                      data-mobile-menu-toggle="docs-sidebar"
                      data-mobile-menu-open="false"
                    >
                      <span>Documentation Menu</span>
                      <ChevronDown className="mobile-menu-chevron h-4 w-4 transition-transform" />
                    </Button>
                  </div>
                  
                  {/* Sidebar Navigation */}
                  <div 
                    className="lg:sticky top-6 lg:block hidden"
                    data-mobile-menu="docs-sidebar"
                  >
                    <nav className="rounded-lg overflow-hidden">
                      <div className="">
                        <Menu
                          name={sidebarMenu}
                          ulClassName="space-y-2"
                          renderItem={renderDocMenuItem}
                        />
                      </div>
                    </nav>
                  </div>
                </aside>
              )}

              {/* Main Content */}
              <div className="flex-1">
                <div className="content space-y-6">
                  {/* Warning Alert */}
                  {warningHtml && (
                    <Alert variant="warning" className="mb-6">
                      <AlertDescription>
                        <div dangerouslySetInnerHTML={{ __html: warningHtml }} />
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Main Content */}
                  <div className="post-content prose dark:prose-invert max-w-none">
                    <ContentRenderer 
                      content={content}
                      className="post-inner-content"
                    />
                  </div>

                  {/* Footer Call to Action */}
                  {isset(footerCta) && (
                    <div className="bg-muted p-6 rounded-lg mt-8">
                      <div dangerouslySetInnerHTML={{ __html: footerCta }} />
                    </div>
                  )}

                  {/* Previous/Next Navigation */}
                  {isset(sidebarMenu) && (
                    <div className="border-t pt-6 mt-8">
                      <Menu
                        name={sidebarMenu}
                        ulClassName="flex justify-between"
                        mode="prev-next"
                        renderItem={renderPrevNextItem}
                      />
                    </div>
                  )}

                  {/* Content Footer */}
                  {isset(contentFooterHtml) && (
                    <div className="mt-8 pt-6 border-t">
                      <Aside name="contentFooterHtml" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Right Sidebar (if present) */}
              {isset(sidebarHtml) && (
                <div className="hidden lg:block lg:w-1/4 shrink-0">
                  <div className="sticky top-6"
                    dangerouslySetInnerHTML={{ __html: sidebarHtml }}
                  />
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

export default Docs;
