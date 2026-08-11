import React from 'react';
import * as PRSS from "@prss/ui";
import Header from '../resources/components/Header';
import Footer from '../resources/components/Footer';
import Page from '../resources/components/Page';
import Hero from '../resources/components/Hero';

import { ContentRenderer } from "@prss/ui";

const Card = data => {
  PRSS.init(data);
  (window as any).PRSS = PRSS;

  const { heroMessage, featuredImageUrl, heroTitle } = PRSS.getProp(
    'vars'
  ) as IVars;
  const { content, title: postTitle } = PRSS.getProp('item');
  const sidebarHtml = PRSS.getProp('sidebarHtml');

  return (
    <Page className="page-single">
      <Header />
      {postTitle && (
        <header className="post-header">
          <div className="container">
            <h1 className="post-header__title">{postTitle || heroTitle}</h1>
            {heroMessage && (
              <p className="post-header__summary">{heroMessage}</p>
            )}
            {featuredImageUrl && (
              <figure className="post-header__figure">
                <img src={featuredImageUrl} alt={postTitle || ''} />
              </figure>
            )}
          </div>
        </header>
      )}
      <main>
        <div className="container main-container">
          <div className="row">
            <div className="col">
              <div className="content">
                <section className="post-content mb-3 pb-5">
                  <ContentRenderer 
                    content={content}
                    className="post-inner-content"
                  />
                </section>
              </div>
            </div>
            {sidebarHtml && (
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

export default Card;
