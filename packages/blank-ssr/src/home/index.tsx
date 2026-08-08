import React from "react";
import * as PRSS from "prss";

const Component = data => {
  PRSS.init(data);
  (window as any).PRSS = PRSS;

  const { content } = PRSS.getProp('item');

  const { beforeContent, afterContent, nextToContent } = PRSS.getProp(
    'vars'
  ) as IVars;

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
      {afterContent && (
        <div className="post-content" dangerouslySetInnerHTML={{
          __html: afterContent
        }}></div>
      )}
    </>
  );
};

export default Component;
