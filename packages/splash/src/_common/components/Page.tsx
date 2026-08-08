import "../styles/Page.css";

import React, { FunctionComponent, ReactNode } from "react";
import cx from "classnames";

interface IProps {
  children: ReactNode;
  className?: string;
}

const Page: FunctionComponent<IProps> = ({ children, className }) => {
  return (
    <div className={cx("page", className)}>
      {children}
    </div>
  );
};

export default Page;
