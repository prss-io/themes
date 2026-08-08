import React from "react";
import * as PRSS from "prss";

const Component = data => {
  PRSS.init(data);
  (window as any).PRSS = PRSS;

  const { content } = PRSS.getProp('item');

  const { beforeContent, afterContent, nextToContent, blogPosts, currentPage, totalPages } = PRSS.getProp(
    'vars'
  ) as any;

  const { rootPath } = data;
  const items = PRSS.getItems('post', true, blogPosts);
  const adjustedRootPath = currentPage === 1 ? rootPath : `../${rootPath}`;

  return (
    <>
      {beforeContent && (
        <div className="pre-content" dangerouslySetInnerHTML={{
          __html: beforeContent
        }}></div>
      )}
      {nextToContent ? (
        <div className="content-wrapper">
          <div className="page-content" dangerouslySetInnerHTML={{
            __html: content
          }}></div>
          <div className="page-sidebar" dangerouslySetInnerHTML={{
            __html: nextToContent
          }}></div>
        </div>
      ): (
        <div className="page-content" dangerouslySetInnerHTML={{
          __html: content
        }}></div>
      )}
      <div className="blog-posts">
        {items.map(post => {
          return (
            <div className="card d-flex flex-row">
              <a
                className={`card-img-left${!!post?.vars?.featuredImageUrl ? " card-has-img" : ""}`}
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
      <nav aria-label="Page navigation">
        <ul className="pagination flex justify-content-center">
          {currentPage > 1 && (
            <li className="page-item">
              <a
                className="page-link"
                href={`${adjustedRootPath}blog/${currentPage - 1 === 1 ? "" : currentPage - 1}`}
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
                  href={`${pageNumber === 1 ? `${adjustedRootPath}blog/` : `${adjustedRootPath}blog/${pageNumber}/`}`}
                  className={`page-link${isActive ? " active" : ""}`}
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
                href={`${adjustedRootPath}blog/${currentPage + 1}`}
              >
                Next
              </a>
            </li>
          )}
        </ul>
      </nav>
      {afterContent && (
        <div className="post-content" dangerouslySetInnerHTML={{
          __html: afterContent
        }}></div>
      )}
    </>
  );
};

export default Component;
