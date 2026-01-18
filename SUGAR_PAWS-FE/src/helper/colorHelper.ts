import colors from "@/const/colors";

export function getColorCode(color: string): string | undefined | string[] {
  // Preprocess color string to remove content in parentheses if present
  const cleanedColor = color.replace(/\s*\([^)]*\)\s*/g, "").trim();

  // Check if the color contains separators like "x", ",", or "/"
  if (
    cleanedColor.includes(" x ") ||
    cleanedColor.includes(", ") ||
    cleanedColor.includes("/")
  ) {
    // Split the color string by the separator
    let colorParts: string[] = [];

    if (cleanedColor.includes(" x ")) {
      colorParts = cleanedColor.split(" x ");
    } else if (cleanedColor.includes(", ")) {
      colorParts = cleanedColor.split(", ");
    } else if (cleanedColor.includes("/")) {
      colorParts = cleanedColor.split("/");
    }

    const colorCodes: (string | undefined)[] = colorParts.map((part) => {
      const foundColor = colors.find(
        (c) => c.colorName.toLowerCase() === part.trim().toLowerCase(),
      );
      return foundColor ? foundColor.colorCode : undefined;
    });

    if (colorCodes.every((code) => code !== undefined)) {
      return colorCodes as string[];
    }

    return colorCodes.find((code) => code !== undefined);
  }

  const foundColor = colors.find(
    (c) => c.colorName.toLowerCase() === cleanedColor.toLowerCase(),
  );
  return foundColor ? foundColor.colorCode : undefined;
}
