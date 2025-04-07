export function extractCode(htmlCodeContent: NodeListOf<Element>) {
    const code = Array.from(htmlCodeContent)
        .map((c) => c.textContent || "")
        .join("\n");

    return code;
}
