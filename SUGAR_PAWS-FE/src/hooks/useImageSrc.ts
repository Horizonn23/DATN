import { useMemo } from "react";
import { PLACEHOLDER_IMAGE } from "@/const/images";

/**
 * Hook để chuyển đổi protocol-relative URL thành absolute URL
 * Xử lý các trường hợp:
 * - Protocol-relative URLs (//example.com/image.jpg) -> https://example.com/image.jpg
 * - Relative URLs (/image.jpg) -> giữ nguyên
 * - Absolute URLs (http://..., https://...) -> giữ nguyên
 * - Base64 URLs (data:image/...) -> giữ nguyên
 */
export function useImageSrc(src: string | undefined | null): string {
  return useMemo(() => {
    if (!src) {
      return PLACEHOLDER_IMAGE; // Use base64 placeholder
    }

    // Nếu là protocol-relative URL, thêm https:
    if (src.startsWith("//")) {
      return `https:${src}`;
    }

    // Nếu đã là absolute URL hoặc relative URL hoặc base64, giữ nguyên
    return src;
  }, [src]);
}

/**
 * Hook để xử lý nhiều image sources
 */
export function useImageSources(
  sources: (string | undefined | null)[],
): string[] {
  return useMemo(() => {
    return sources.map((src) => {
      if (!src) {
        return PLACEHOLDER_IMAGE;
      }

      if (src.startsWith("//")) {
        return `https:${src}`;
      }

      return src;
    });
  }, [sources]);
}

/**
 * Utility function để chuyển đổi image URL (không phải hook)
 */
export function convertImageSrc(src: string | undefined | null): string {
  if (!src) {
    return PLACEHOLDER_IMAGE;
  }

  if (src.startsWith("//")) {
    return `https:${src}`;
  }

  return src;
}
