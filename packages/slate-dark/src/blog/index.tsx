import React from 'react';
import * as PRSS from "@prss/ui";

import cx from 'classnames';

import Header from '../resources/components/Header';
import Footer from '../resources/components/Footer';
import Page from '../resources/components/Page';
import Aside from '../resources/components/Aside';
import { isset } from '../resources/services/utils';

import { ContentRenderer } from "@prss/ui";

const Blog = data => {
  PRSS.init(data);
  (window as any).PRSS = PRSS;
  const { rootPath } = data;

  const { sidebarAsideHtml, blogPosts, currentPage, totalPages, category } = PRSS.getProp('vars') as any;
  const links = PRSS.getJsonProp('vars.links') as ILink[];
  const { content, title, slug } = PRSS.getProp('item');
  const sidebarHtml = PRSS.getProp('sidebarHtml');
  const items = PRSS.getItems('post', true, blogPosts, category);
  const adjustedRootPath = currentPage === 1 ? rootPath : `../${rootPath}`;

  return (
    <Page className="page-blog">
      <Header />
      <main>
        <div className="container main-container">
          <h2>{title}</h2>
          <div className="row">
            <div className="col">
              <div className="content">
                {content && content.trim().length && (
                  <ContentRenderer 
                    content={content}
                    className="content-section"
                  />
                )}

                <section className="mb-3 blog-items">
                  <div>
                    <Aside name="inlineAsideHtml" />
                    {items.map(post => {
                      return (
                        <div className="card d-flex flex-row" style={{ background: "transparent" }}>
                          <a
                            className={cx('card-img-left', {
                              'card-has-img': !!post?.vars?.featuredImageUrl
                            })}
                            href={post?.url}
                          >
                            {post?.vars?.featuredImageUrl && (
                              <img
                                src={post?.vars?.featuredImageUrl}
                                alt={post?.vars?.featuredImageAlt}
                                loading="lazy"
                              />
                            )}
                          </a>

                          <div className="card-body col">
                            {post?.title && (
                              <a className="card-title" href={post?.url}>
                                {post?.title}
                              </a>
                            )}

                            {post?.content && (
                              <p className="card-text">{post?.content}</p>
                            )}

                            {post?.createdAt && (
                              <p className="card-text">
                                <small
                                  className="text-muted"
                                  title={PRSS.formattedDate(post?.createdAt)}
                                >
                                  Posted {PRSS.formattedDate(post?.createdAt)}
                                </small>
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>
            </div>
            {isset(sidebarHtml || sidebarAsideHtml) && (
              <div className="col-3 page-sidebar">
                <div
                  className="page-sidebar-content"
                  dangerouslySetInnerHTML={{
                    __html: sidebarHtml
                  }}
                />
                <Aside name="sidebarAsideHtml" />
              </div>
            )}
          </div>
          <div className="row">
            <div className="col">
              <nav aria-label="Page navigation">
                <ul className="pagination flex justify-content-center">
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
                          className={cx('page-link', { active: isActive })}
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
          </div>
        </div>
      </main>
      <Footer />
    </Page>
  );
};

export default Blog;
