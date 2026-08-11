import React from 'react';
import * as PRSS from "@prss/ui";

import Header from '../resources/components/Header';
import Footer from '../resources/components/Footer';
import Page from '../resources/components/Page';
import Hero from '../resources/components/Hero';
import { isset } from '../resources/services/utils';
import Aside from '../resources/components/Aside';

import { ContentRenderer } from "@prss/ui";

const Post = data => {
  PRSS.init(data);
  (window as any).PRSS = PRSS;

  const {
    heroTitle,
    heroMessage,
    heroImageUrl,
    featuredImageUrl,
    featuredImageAuthor,
    featuredImageAuthorLink,
    sidebarAsideHtml,
    heroClass
  } = PRSS.getProp('vars') as any;

  const { content, /*uuid: postId,*/ title: postTitle, createdAt } = PRSS.getProp(
    'item'
  );
  const sidebarHtml = PRSS.getProp('sidebarHtml');

  //const items = PRSS.getItems('post').filter(item => item.uuid !== postId);
  //const shuffledItem = PRSS.shuffle(items)[0];

  return (
    <Page className="page-post">
      <Header />
      {/* Editorial header: the title reads on the page and the featured image
          sits below it at full strength, rather than behind dimmed text. */}
      <header className="post-header">
        <div className="container">
          {(postTitle || heroTitle) && (
            <h1 className="post-header__title">{postTitle || heroTitle}</h1>
          )}
          {createdAt && (
            <div
              className="post-header__meta"
              title={PRSS.formattedDate(createdAt)}
            >
              {PRSS.formattedDate(createdAt)}
            </div>
          )}
          {/* The site-wide hero image is not this post's image; showing only a
              featured image keeps unrelated stock art off every article. */}
          {featuredImageUrl && (
            <figure className="post-header__figure">
              <img
                src={featuredImageUrl}
                alt={postTitle || heroTitle || ''}
              />
              {featuredImageUrl && featuredImageAuthor && (
                <figcaption className="post-header__credit">
                  Photo by{' '}
                  {featuredImageAuthorLink ? (
                    <a
                      href={featuredImageAuthorLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {featuredImageAuthor}
                    </a>
                  ) : (
                    featuredImageAuthor
                  )}{' '}
                  via Pexels
                </figcaption>
              )}
            </figure>
          )}
        </div>
      </header>
      <main>
        <div className="container main-container">
          <div className="row">
            <div className="col">
              <div className="content">
                <section className="post-content mt-4 mb-3 pb-5">
                  <ContentRenderer 
                    content={content}
                    className="post-inner-content"
                  />
                </section>

                {/*shuffledItem && (
                  <section className="mb-3">
                    <h4 className="section-title">
                      <span>Explore More</span>
                    </h4>

                    <div className="mt-4 mb-4">
                      <div className="card mb-3 d-flex flex-row">
                        {shuffledItem.vars?.featuredImageUrl && (
                          <div className="col-2 p-0">
                            <a
                              className={cx('card-img-left', {
                                'card-has-img': !!shuffledItem.vars
                                  ?.featuredImageUrl
                              })}
                              href={shuffledItem.url}
                            >
                              {shuffledItem.vars?.featuredImageUrl && (
                                <img
                                  src={shuffledItem.vars?.featuredImageUrl}
                                  alt={shuffledItem.vars?.featuredImageAlt}
                                  loading="lazy"
                                />
                              )}
                            </a>
                          </div>
                        )}

                        <div className="card-body col">
                          {shuffledItem.title && (
                            <a className="card-title" href={shuffledItem.url}>
                              {shuffledItem.title}
                            </a>
                          )}

                          {shuffledItem.content && (
                            <p className="card-text">{shuffledItem.content}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>
                )*/}
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
        </div>
      </main>
      <Footer />
    </Page>
  );
};

export default Post;
