import React from 'react';
import * as PRSS from "@prss/ui";
import cx from 'classnames';

import Header from '../resources/components/Header';
import Footer from '../resources/components/Footer';
import Page from '../resources/components/Page';
import Aside from '../resources/components/Aside';
import { Menu } from '@prss/ui';
import { isset } from '../resources/services/utils';

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
  } = PRSS.getProp('vars');

  const { content, uuid: postId, title: postTitle } = PRSS.getProp('item');

  const sidebarHtml = PRSS.getProp('sidebarHtml');

  const items = PRSS.getItems('post').filter(item => item.uuid !== postId);

  // Helper function to check if a menu node is active
  const isNodeActive = (node: any): boolean => {
    if (!node) return false;
    return node.isActive || (node.children && node.children.some(isNodeActive));
  };

  // Custom render function for menu items with parent activation
  const renderDocMenuItem = (node: any, level: number = 0) => {
    const isActive = isNodeActive(node);
    const hasActiveChild = node.children && node.children.some(isNodeActive);
    
    return (
      <li key={node.id} className={isActive ? 'active' : ''}>
        <a 
          href={node.url} 
          className={hasActiveChild ? 'has-active-child' : ''}
        >
          {node.title}
        </a>
        {node.children && (
          <ul>
            {node.children.map((child: any) => renderDocMenuItem(child, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  // Custom render function for prev/next menu items
  const renderPrevNextItem = (node: any) => {
    return (
      <li key={node.id} className={node.rel}>
        <a href={node.url}>{node.title}</a>
      </li>
    );
  };

  return (
    <Page className="page-docs">
      <Header />
      <main>
        <div className="container main-container">
          {featuredImageUrl && (
            <div
              className="featured-image"
              style={{
                backgroundImage: `url(${featuredImageUrl})`
              }}
            />
          )}

          <div className="post-title-container">
            <div className="row">
              <div className="col-12 col-lg d-lg-flex flex-column justify-content-center">
                {docsImageUrl ? (
                  <img 
                    src={docsImageUrl} 
                    alt={heroTitle || postTitle}
                    className="docs-image docs-header-image mb-0"
                    style={{maxHeight: '96px', width: 'auto'}}
                  />
                ) : (
                  <h1 className="mb-0">{heroTitle || postTitle}</h1>
                )}
              </div>
              {PRSS.getProp('vars')?.asideHtml && (
                <div className="col-12 col-lg-4 mt-3 mt-lg-0">
                  <Aside name="asideHtml" />
                </div>
              )}
            </div>
          </div>

          <div className="row mt-2">
            {isset(sidebarMenu) && (
              <div className="col-3 docs-sidebar">
                <div className="menu-title" data-mobile-menu-toggle="docs-sidebar">
                  <i className="fa fa-caret-down mr-2"></i>
                  <span>Navigate</span>
                </div>
                <div className="docs-sidebar-inner-container" data-mobile-menu="docs-sidebar">
                  <Menu
                    name={sidebarMenu}
                    ulClassName="sidebar-menu"
                    renderItem={renderDocMenuItem}
                  />
                </div>
              </div>
            )}

            <div className={`col ${isset(sidebarMenu) ? 'col-lg-9' : ''}`}>
              <div className="content">
                <div className="content-top">
                  <section className="post-content mb-3">
                    {warningHtml && (
                      <div
                        className="alert alert-warning alert-dismissible fade show"
                        role="alert"
                        dangerouslySetInnerHTML={{
                          __html: warningHtml
                        }}
                      />
                    )}

                    <ContentRenderer 
                      content={content}
                      className="post-inner-content mb-5"
                    />
                    
                    {isset(footerCta) && (
                      <div
                        className="footer-cta"
                        dangerouslySetInnerHTML={{
                          __html: footerCta
                        }}
                      />
                    )}
                  </section>

                  {isset(sidebarMenu) && (
                    <section>
                      <Menu
                        name={sidebarMenu}
                        ulClassName="docs-footer-menu"
                        mode="prev-next"
                        renderItem={renderPrevNextItem}
                      />
                    </section>
                  )}
                </div>

                {isset(contentFooterHtml) && (
                  <section className="content-footer">
                    <Aside name="contentFooterHtml" />
                  </section>
                )}
              </div>
            </div>
            {isset(sidebarHtml) && (
              <div
                className="col-3"
                dangerouslySetInnerHTML={{
                  __html: sidebarHtml
                }}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </Page>
  );
};

export default Docs;
