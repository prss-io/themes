import "../styles/Header.css";

import React from "react";
import { ChevronDownIcon, Sun } from "lucide-react";
import * as PRSS from "@prss/ui";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cx } from "@/lib/utils";
import { Menu } from "@prss/ui";

const Header = () => {
  console.log(PRSS.getAllProps());

  const { logoImageUrl, disableThemeSwitcher } = PRSS.getProp("vars");
  const { title } = PRSS.getProp("site");
  const currentPostId = PRSS.getProp("item").uuid;
  const shouldDisableThemeSwitcher = disableThemeSwitcher === "true";

  const props = PRSS.getAllProps();

  const renderDropdownChildren = nodeChildren => {
    return (
      <div className="dropdown-menu">
        {nodeChildren.map(nodeItem => {
          const post = PRSS.getItem(nodeItem.key);
          return (
            <a key={nodeItem.key} className="dropdown-item inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground" href={post?.url}>
              {post?.title}
            </a>
          );
        })}
      </div>
    );
  };

  const renderMenuItem = (node: any) => {
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
      <NavigationMenuItem key={node.key} className={cx("nav-item", {
        dropdown: nodeChildren && nodeChildren.length,
        active: node.key === currentPostId || isChildItem
      })}>
        {!!nodeChildren?.length ? (
          <NavigationMenuLink
            href={post?.url}
            className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
          >
            {node.title || post?.title}
            <ChevronDownIcon
              className="relative top-[1px] text-inherit ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
              aria-hidden="true"
            />
          </NavigationMenuLink>
        ) : (
          <NavigationMenuLink
            href={post?.url}
            className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
          >
            {node.title || post?.title}
          </NavigationMenuLink>
        )}
        {!!nodeChildren?.length && renderDropdownChildren(nodeChildren)}
      </NavigationMenuItem>
    );
  };
  
  return (
    <header className="py-4 justify-center page-header relative mx-auto flex max-w-screen-xl">
      <div className="container">
        {/* Desktop Menu */}
        <nav className="justify-between flex">
          <div className="flex flex-col md:flex-row items-center gap-6 justify-between w-full header-items">
            {/* Logo */}
            <a href={props.rootPath} className="flex items-center gap-2">
              {logoImageUrl ? <img src={logoImageUrl} className="max-h-8" alt={title} /> : (
                <span className="text-lg font-semibold tracking-tighter">
                  {title}
                </span>
              )}
            </a>
            <div className="flex items-center header-nav">
              <NavigationMenu>
                <NavigationMenuList>
                  <Menu
                    name="header"
                    ulClassName="navbar-nav"
                    renderItem={renderMenuItem}
                  />
                </NavigationMenuList>
              </NavigationMenu>
              {!shouldDisableThemeSwitcher ? <Button variant="outline" size="sm" title="Toggle Dark Mode" className="cursor-pointer toggle-dark-mode">
                <Sun className="size-4" />
              </Button> : null}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
