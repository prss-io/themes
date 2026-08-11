import '../styles/Header.css';
import React, { FunctionComponent, useEffect, useState, useRef } from 'react';
import cx from 'classnames';
import * as PRSS from "@prss/ui";
import { Menu } from "@prss/ui";

interface IProps {
  onScrollCallback?: any;
  onResizeCallback?: any;
  isHome?: boolean;
}

const HEADER_HEIGHT = 80;

const Header: FunctionComponent<IProps> = ({
  onScrollCallback,
  onResizeCallback,
  isHome
}) => {
  const { logoImageUrl, logoImageUrlLight, headerSearch } = PRSS.getProp('vars');
  const { title, url } = PRSS.getProp('site');
  const currentPost = PRSS.getProp('item');
  const currentPostId = currentPost.uuid;

  // On a landing page's home the call to action is the point, so search stays
  // out of the way there unless a site asks for it.
  const searchMode = headerSearch || 'not-home';
  const showSearch =
    searchMode === 'all' || (searchMode === 'not-home' && !isHome);

  // One header across the site. It sits on the page rather than over a dark
  // hero, so the light-mode logo is the right one everywhere.
  const isLightHeader = true;
  const logoSrc = logoImageUrlLight || logoImageUrl;

  const [scrollTop, setScrollTop] = useState(0);
  const [stickyEnabled, setStickyEnabled] = useState(false);
  const [stickyDisabled, setStickyDisabled] = useState(false);
  const stickyTimeout = useRef(null);

  useEffect(() => {
    const onScroll = e => {
      const targetScrollTop = e.target.documentElement.scrollTop;
      onScrollCallback && onScrollCallback(targetScrollTop);
      setScrollTop(targetScrollTop);

      if (!stickyEnabled && scrollTop > HEADER_HEIGHT) {
        setStickyEnabled(true);
        setStickyDisabled(false);
      }

      if (!stickyDisabled && stickyEnabled && targetScrollTop <= 20) {
        setStickyEnabled(false);
        setStickyDisabled(true);

        if (!stickyTimeout.current) {
          stickyTimeout.current = setTimeout(() => {
            setStickyDisabled(false);
            clearTimeout(stickyTimeout.current);
            stickyTimeout.current = null;
          }, 2000);
        }
      }
    };

    const onResize = e => {
      onResizeCallback && onResizeCallback(e);
    };

    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [scrollTop]);

  const renderDropdownChildren = nodeChildren => {
    return (
      <div className="dropdown-menu">
        {nodeChildren.map(nodeItem => {
          const post = PRSS.getItem(nodeItem.key);
          return (
            <a className="dropdown-item" href={post?.url}>
              {post?.title}
            </a>
          );
        })}
      </div>
    );
  };

  return (
    <header className="page-header">
      <div
        className={cx('header-nav', {
          scrolled: stickyEnabled,
          'header-nav--light': isLightHeader,
          'sticky-unset': stickyDisabled,
          'sticky-top': stickyEnabled || stickyDisabled
        })}
      >
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-dark mx-2">
            <a className="navbar-brand logo" href={PRSS.getSiteUrl()}>
              {logoSrc ? <img src={logoSrc} /> : title}
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div
              className="collapse navbar-collapse justify-content-end"
              id="navbarSupportedContent"
            >
              <Menu
                name="header"
                ulClassName="navbar-nav"
                renderItem={node => {
                  const post = PRSS.getItem(node.key);
                  const structureItem = post?.path
                    ? PRSS.findInStructure(node.key)
                    : null;

                  const structureItemChildren = structureItem?.children || [];

                  const nodeChildren = node?.children || [];

                  const itemHaystack = [
                    ...structureItemChildren,
                    ...nodeChildren
                  ];

                  const isChildItem = PRSS.hasItem(currentPostId, itemHaystack);

                  return (
                    <li
                      className={cx('nav-item', {
                        dropdown: nodeChildren && nodeChildren.length,
                        active: node.key === currentPostId || isChildItem
                      })}
                    >
                      <a
                        className={cx('nav-link', {
                          'dropdown-toggle': nodeChildren && nodeChildren.length
                        })}
                        href={post?.url}
                      >
                        {node.title || post?.title}
                      </a>
                      {nodeChildren && renderDropdownChildren(nodeChildren)}
                    </li>
                  );
                }}
              />
              {showSearch && (
                <button
                  type="button"
                  className="site-search-trigger"
                  data-search-open
                  aria-label="Search"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                  <span className="site-search-trigger-label">Search</span>
                  <kbd className="site-search-kbd">/</kbd>
                </button>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* Results are painted by the client script; nothing is shipped in the
          SSR payload. */}
      {showSearch && (
        <div className="site-search" data-search-dialog hidden>
          <div className="site-search-backdrop" data-search-close />
          <div className="site-search-panel" role="dialog" aria-modal="true" aria-label="Search">
            <div className="site-search-field">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="search"
                className="site-search-input"
                data-search-input
                placeholder={`Search ${title || 'this site'}`}
                autoComplete="off"
                spellCheck={false}
                aria-label="Search"
              />
              <button type="button" className="site-search-esc" data-search-close aria-label="Close">
                Esc
              </button>
            </div>
            <div className="site-search-results" data-search-results />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
