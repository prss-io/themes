import "../styles/Footer.css";

import React from "react";
import * as PRSS from "@prss/ui";
//import prssImg from "@/images/prss-sm.png";

const Footer = () => {
  const { footerLeft, footerRight } = PRSS.getProp("vars");
  const { title } = PRSS.getProp("site");

  return (
    <section className="py-6 flex justify-center relative mx-auto flex max-w-screen-xl">
      <div className="container">
        <footer className="page-footer">
          <div className="mt-20 flex flex-col justify-between gap-4 pt-8 text-center text-sm font-medium text-muted-foreground lg:flex-row lg:items-center lg:text-left">
            {footerLeft ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: footerLeft
                }}
              ></div>
            ) : (
              <span>© {title}</span>
            )}
            <div className="flex justify-center gap-4 lg:justify-start">
              {footerRight ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: footerRight
                  }}
                ></div>
              ) : (
                <a
                  href="https://prss.io"
                  className="d-flex align-items-center footer-shoutout"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Powered by PRSS Site Creator"
                >
                  <img
                    className="prss-footer-image mr-1"
                    src="https://prss-static.volted.co/images/logo.png"
                    width={16}
                  />
                  <span className="font-weight-bold prss-tag">PRSS Site Creator</span>
                </a>
              )}
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default Footer;
