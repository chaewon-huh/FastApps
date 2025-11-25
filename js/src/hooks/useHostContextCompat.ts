import { useMemo } from "react";
import { useOpenAiGlobal } from "./useOpenAiGlobal";
import { useMcpAppsHostContext } from "./useMcpAppsHostContext";

/**
 * Merge OpenAI globals and MCP Apps hostContext into a single object.
 * OpenAI values take precedence if present.
 */
export function useHostContextCompat() {
  const openaiTheme = useOpenAiGlobal("theme");
  const openaiDisplayMode = useOpenAiGlobal("displayMode");
  const openaiMaxHeight = useOpenAiGlobal("maxHeight");
  const openaiSafeArea = useOpenAiGlobal("safeArea");
  const openaiLocale = useOpenAiGlobal("locale");
  const openaiUserAgent = useOpenAiGlobal("userAgent");

  const { hostContext } = useMcpAppsHostContext();

  return useMemo(
    () => ({
      theme: openaiTheme ?? hostContext?.theme ?? null,
      displayMode: openaiDisplayMode ?? hostContext?.displayMode ?? null,
      maxHeight: openaiMaxHeight ?? hostContext?.viewport?.maxHeight ?? null,
      safeArea: openaiSafeArea ?? hostContext?.safeAreaInsets ?? null,
      locale: openaiLocale ?? hostContext?.locale ?? null,
      userAgent: openaiUserAgent ?? hostContext?.userAgent ?? null,
      // raw accessors
      _openai: {
        theme: openaiTheme,
        displayMode: openaiDisplayMode,
        maxHeight: openaiMaxHeight,
        safeArea: openaiSafeArea,
        locale: openaiLocale,
        userAgent: openaiUserAgent,
      },
      _mcp: hostContext,
    }),
    [
      openaiTheme,
      openaiDisplayMode,
      openaiMaxHeight,
      openaiSafeArea,
      openaiLocale,
      openaiUserAgent,
      hostContext,
    ]
  );
}
