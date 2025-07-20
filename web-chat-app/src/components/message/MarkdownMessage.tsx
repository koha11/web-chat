import ReactMarkdown from "react-markdown";
import LinkifyIt from "linkify-it";

const linkify = new LinkifyIt();

function preprocessText(text: string) {
  const matches = linkify.match(text);
  if (!matches) return text;

  let result = "";
  let lastIndex = 0;

  for (const match of matches) {
    // Add plain text before the link
    result += text.slice(lastIndex, match.index);
    // Replace the raw URL with a Markdown link
    result += `[${match.text}](${match.url})`;
    lastIndex = match.lastIndex;
  }

  // Add the rest of the text
  result += text.slice(lastIndex);

  return result;
}

const MarkdownMessage = ({ text }: { text: string }) => {
  const linkedText = preprocessText(text);
  return <ReactMarkdown>{linkedText}</ReactMarkdown>;
};

export default MarkdownMessage;
