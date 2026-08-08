declare module "*.png";
declare module "*.svg";
declare module "*.jpeg";
declare module "*.jpg";

interface IVars {
    faviconImageUrl?: string;
    logoImageUrl?: string;
    featuredImageUrl?: string;
    featuredImageAlt?: string;
    truncateTitleLength?: string;
    truncateContentLength?: string;
    defaultTheme?: string;
    disableThemeSwitcher?: string;
    heroTitle?: string;
    docsImageUrl?: string;

    /**
     * Links
     */
    links: ILink[];

    /**
     * Menu
     */
    sidebarMenu?: string;

    /**
     * Aside
     */
    asideHtml?: string;
    sidebarAsideHtml?: string;
    inlineAside?: string;
    footerCta?: string;
    warningHtml?: string;
    contentFooterHtml?: string;

    /**
     * SEO
     */
    metaDescription?: string;
    metaLocale?: string;
    metaUrl?: string;
    metaSiteName?: string;
    metaRobots?: string;
    metaTitle?: string;
    metaImage?: string;
}

interface ILink {
    text: string;
    url: string;
    icon?: string;
}