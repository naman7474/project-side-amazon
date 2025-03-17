"use client";

import NextLink from "next/link";
import React, {
  CSSProperties,
  HTMLAttributeAnchorTarget,
  ReactNode,
  useCallback,
} from "react";

const RouterLink = ({
  href,
  className,
  children,
  title,
  style,
  target,
  rel,
}: {
  href: string;
  className?: string;
  children?: ReactNode;
  title?: string;
  style?: CSSProperties;
  target?: HTMLAttributeAnchorTarget;
  rel?: string;
}) => {
  const onLinkClick = useCallback(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!href) {
    return null;
  }

  const props: Record<string, any> = {};
  if (href.startsWith("http")) {
    props.target = "_blank";
    props.rel = "noreferrer";
  }

  return (
    <NextLink
      href={href}
      className={className}
      title={title}
      style={{ textDecoration: "none", ...style }}
      scroll
      onClick={onLinkClick}
      target={target}
      rel={rel}
      {...props}
    >
      {children}
    </NextLink>
  );
};

export default RouterLink;
