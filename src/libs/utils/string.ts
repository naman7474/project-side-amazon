import showdown from "showdown";

export const slugify = (inputString: string): string =>
  inputString
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9\s-]/g, "") // Remove any non-alphanumeric characters, except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Remove consecutive hyphens
    .trim(); // Trim leading and trailing spaces

export const toTitleCase = (inputString: string): string => {
  if (!inputString) {
    return "";
  }

  return inputString
    .toLowerCase()
    .replace(/(?:^|\s)\w/g, (match) => match.toUpperCase());
};

export const generateRandomString = (n: number): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";

  for (let i = 0; i < n; i += 1) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
};

export const slugToTitleCase = (inputString: string): string =>
  toTitleCase(inputString.replaceAll("-", " "));

export const stringToJSON = (str: string) => {
  try {
    return JSON.parse(str);
  } catch (err) {
    return null;
  }
};

export const htmlToMarkdown = (html: string) => {
  if (!html) {
    return "";
  }
  return (
    html
      // Convert headers
      .replace(
        /<h([1-6])>(.*?)<\/h\1>/gi,
        (_, level, content) => `${"#".repeat(level)} ${content}`
      )
      // Convert paragraphs
      .replace(/<p>(.*?)<\/p>/gi, (_, content) => `${content}\n\n`)
      // Convert links
      .replace(
        /<a href="(.*?)">(.*?)<\/a>/gi,
        (_, href, content) => `[${content}](${href})`
      )
      // Convert unordered lists
      .replace(
        /<ul>\s*(.*?)\s*<\/ul>/gis,
        (_, content) => `${content.replace(/<li>(.*?)<\/li>/gis, "- $1")}\n`
      )
      // Convert ordered lists
      .replace(
        /<ol>\s*(.*?)\s*<\/ol>/gis,
        (_, content) => `${content.replace(/<li>(.*?)<\/li>/gis, "1. $1")}\n`
      )
      // Convert bold text
      .replace(/<(b|strong)>(.*?)<\/\1>/gi, "**$2**")
      // Convert italic text
      .replace(/<(i|em)>(.*?)<\/\1>/gi, "*$2*")
      // Optional: remove any remaining HTML tags
      .replace(/<[^>]+>/g, "")
  );
};

export const markdownToHtml = (markdown: string) => {
  if (!markdown) {
    return "";
  }
  const converter = new showdown.Converter();
  return converter.makeHtml(markdown);
};

export const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return !!urlObj; // No error means a valid URL
  } catch (e) {
    return false; // An error indicates an invalid URL
  }
};
