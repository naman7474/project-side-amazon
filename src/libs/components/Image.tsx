import NextImage from "next/image";
import { CSSProperties } from "react";

const getAltParam = (url: string): string => {
  try {
    const urlObject = new URL(url);
    const { searchParams } = urlObject;
    return searchParams.get("alt") || "";
  } catch (err: any) {
    return "";
  }
};

const Image = ({
  src,
  alt,
  width,
  height,
  className,
  style,
  priority,
  quality,
  id,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
  quality?: number;
  id?: string;
}) => {
  if (src && src.includes("http")) {
    return (
      <img
        src={
          !src || src?.toLowerCase() === "none"
            ? "/images/products/default-logo.jpg"
            : src
        }
        alt={getAltParam(src) || alt}
        width={width}
        height={height}
        className={className}
        style={style}
        loading={priority ? "eager" : "lazy"}
        draggable={false}
        id={id}
      />
    );
  }

  return (
    <NextImage
      src={
        !src || src?.toLowerCase() === "none"
          ? "/images/products/default-logo.jpg"
          : src
      }
      alt={getAltParam(src) || alt}
      width={width}
      height={height}
      className={className}
      style={style}
      loading={priority ? "eager" : "lazy"}
      draggable={false}
      priority={priority}
      quality={quality}
      id={id}
    />
  );
};

export default Image;
