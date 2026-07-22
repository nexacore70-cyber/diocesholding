import {
  useEffect,
  useRef,
} from "react";

import {
  useLanguage,
} from "./LanguageProvider";

const TRANSLATABLE_ATTRIBUTES = [
  "placeholder",
  "title",
  "aria-label",
  "alt",
];

const SKIPPED_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "CODE",
  "PRE",
  "SVG",
  "PATH",
  "TEXTAREA",
  "OPTION",
]);

function shouldSkipElement(element) {
  if (!element) {
    return true;
  }

  if (SKIPPED_TAGS.has(element.tagName)) {
    return true;
  }

  return Boolean(
    element.closest(
      "[data-no-translate], [translate='no']",
    ),
  );
}

function isTranslatableText(value) {
  const text = String(value || "").trim();

  if (text.length < 2) {
    return false;
  }

  if (/^[\d\s.,:%+\-–—/()#₦$€£¥]+$/u.test(text)) {
    return false;
  }

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(text)) {
    return false;
  }

  if (/^(https?:\/\/|www\.)/i.test(text)) {
    return false;
  }

  return /[A-Za-zÀ-ž]/u.test(text);
}

function preserveOuterWhitespace(original, translated) {
  const leading = original.match(/^\s*/u)?.[0] || "";
  const trailing = original.match(/\s*$/u)?.[0] || "";

  return `${leading}${translated.trim()}${trailing}`;
}

function collectTextNodes(root) {
  const nodes = [];
  const documentRoot =
    root?.nodeType === Node.DOCUMENT_NODE
      ? root.body
      : root;

  if (!documentRoot) {
    return nodes;
  }

  const walker = document.createTreeWalker(
    documentRoot,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const parent = node.parentElement;

        if (
          !parent ||
          shouldSkipElement(parent) ||
          !isTranslatableText(node.nodeValue)
        ) {
          return NodeFilter.FILTER_REJECT;
        }

        return NodeFilter.FILTER_ACCEPT;
      },
    },
  );

  let current = walker.nextNode();

  while (current) {
    nodes.push(current);
    current = walker.nextNode();
  }

  return nodes;
}

function collectAttributeTargets(root) {
  const targets = [];
  const documentRoot =
    root?.nodeType === Node.DOCUMENT_NODE
      ? root.body
      : root;

  if (!documentRoot) {
    return targets;
  }

  const elements = [
    ...(documentRoot.matches?.("*")
      ? [documentRoot]
      : []),
    ...documentRoot.querySelectorAll("*"),
  ];

  elements.forEach((element) => {
    if (shouldSkipElement(element)) {
      return;
    }

    TRANSLATABLE_ATTRIBUTES.forEach(
      (attribute) => {
        const value = element.getAttribute(attribute);

        if (isTranslatableText(value)) {
          targets.push({
            element,
            attribute,
            value,
          });
        }
      },
    );
  });

  return targets;
}

async function createChromeTranslator(
  targetLanguage,
  onProgress,
) {
  const TranslatorApi = window.Translator;

  if (!TranslatorApi) {
    return null;
  }

  const options = {
    sourceLanguage: "en",
    targetLanguage,
  };

  const availability =
    await TranslatorApi.availability(options);

  if (availability === "unavailable") {
    return null;
  }

  return TranslatorApi.create({
    ...options,
    monitor(monitor) {
      monitor.addEventListener(
        "downloadprogress",
        (event) => {
          onProgress?.(
            Math.round(
              Number(event.loaded || 0) * 100,
            ),
          );
        },
      );
    },
  });
}

async function translateWithBackend(
  texts,
  targetLanguage,
) {
  const endpoint =
    import.meta.env.VITE_TRANSLATION_API_URL;

  if (!endpoint) {
    return null;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sourceLanguage: "en",
      targetLanguage,
      texts,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Translation service returned ${response.status}.`,
    );
  }

  const payload = await response.json();

  if (!Array.isArray(payload.translations)) {
    throw new Error(
      "Translation service did not return a translations array.",
    );
  }

  return payload.translations;
}

export default function AutoPageTranslator() {
  const {
    language,
    currentLanguage,
    setTranslationStatus,
    setTranslationProgress,
    setTranslationError,
  } = useLanguage();

  const originalTextRef = useRef(new WeakMap());
  const originalAttributesRef = useRef(
    new WeakMap(),
  );
  const knownTextNodesRef = useRef(new Set());
  const knownElementsRef = useRef(new Set());
  const cacheRef = useRef(new Map());
  const observerRef = useRef(null);
  const runIdRef = useRef(0);

  useEffect(() => {
    const originalText = originalTextRef.current;
    const originalAttributes =
      originalAttributesRef.current;
    const knownTextNodes =
      knownTextNodesRef.current;
    const knownElements =
      knownElementsRef.current;

    const rememberOriginals = (root) => {
      collectTextNodes(root).forEach((node) => {
        knownTextNodes.add(node);

        if (!originalText.has(node)) {
          originalText.set(
            node,
            node.nodeValue,
          );
        }
      });

      collectAttributeTargets(root).forEach(
        ({ element, attribute, value }) => {
          let values =
            originalAttributes.get(element);

          knownElements.add(element);

          if (!values) {
            values = new Map();
            originalAttributes.set(
              element,
              values,
            );
          }

          if (!values.has(attribute)) {
            values.set(attribute, value);
          }
        },
      );
    };

    const restoreEnglish = (root = document.body) => {
      if (!root) {
        return;
      }

      knownTextNodes.forEach((node) => {
        if (!node.isConnected) {
          knownTextNodes.delete(node);
          return;
        }

        const value = originalText.get(node);

        if (typeof value === "string") {
          node.nodeValue = value;
        }
      });

      knownElements.forEach((element) => {
        if (!element.isConnected) {
          knownElements.delete(element);
          return;
        }

        const values =
          originalAttributes.get(element);

        values?.forEach((value, attribute) => {
          element.setAttribute(attribute, value);
        });
      });
    };

    const translateStrings = async (
      strings,
      targetLanguage,
      runId,
    ) => {
      const uniqueStrings = [
        ...new Set(
          strings
            .map((value) => String(value).trim())
            .filter(isTranslatableText),
        ),
      ];

      if (uniqueStrings.length === 0) {
        return new Map();
      }

      const results = new Map();
      const missing = [];

      uniqueStrings.forEach((text) => {
        const cacheKey =
          `${targetLanguage}::${text}`;

        if (cacheRef.current.has(cacheKey)) {
          results.set(
            text,
            cacheRef.current.get(cacheKey),
          );
        } else {
          missing.push(text);
        }
      });

      if (missing.length === 0) {
        return results;
      }

      let translatedByBackend = null;
      let translator = null;

      if (!currentLanguage.backendOnly) {
        try {
          translator = await createChromeTranslator(
            currentLanguage.translatorCode,
            setTranslationProgress,
          );
        } catch {
          translator = null;
        }
      }

      if (!translator) {
        translatedByBackend =
          await translateWithBackend(
            missing,
            targetLanguage,
          );

        if (!translatedByBackend) {
          throw new Error(
            "This language is not available in the browser. Configure VITE_TRANSLATION_API_URL for additional languages.",
          );
        }
      }

      for (
        let index = 0;
        index < missing.length;
        index += 1
      ) {
        if (runId !== runIdRef.current) {
          return results;
        }

        const source = missing[index];
        const translated = translator
          ? await translator.translate(source)
          : translatedByBackend[index];

        const finalValue =
          String(translated || source).trim() ||
          source;

        cacheRef.current.set(
          `${targetLanguage}::${source}`,
          finalValue,
        );
        results.set(source, finalValue);

        setTranslationProgress(
          Math.round(
            ((index + 1) / missing.length) *
              100,
          ),
        );
      }

      translator?.destroy?.();

      return results;
    };

    const translateRoot = async (
      root,
      runId,
    ) => {
      if (!root || language === "en") {
        return;
      }

      rememberOriginals(root);

      const textNodes = collectTextNodes(root);
      const attributeTargets =
        collectAttributeTargets(root);

      const sourceStrings = [
        ...textNodes.map((node) =>
          originalText.get(node),
        ),
        ...attributeTargets.map(
          ({ element, attribute }) =>
            originalAttributes
              .get(element)
              ?.get(attribute),
        ),
      ].filter(Boolean);

      const translated = await translateStrings(
        sourceStrings,
        currentLanguage.translatorCode,
        runId,
      );

      if (runId !== runIdRef.current) {
        return;
      }

      observerRef.current?.disconnect();

      textNodes.forEach((node) => {
        const source = originalText.get(node);
        const result = translated.get(
          String(source || "").trim(),
        );

        if (result) {
          node.nodeValue =
            preserveOuterWhitespace(
              source,
              result,
            );
        }
      });

      attributeTargets.forEach(
        ({ element, attribute }) => {
          const source = originalAttributes
            .get(element)
            ?.get(attribute);
          const result = translated.get(
            String(source || "").trim(),
          );

          if (result) {
            element.setAttribute(
              attribute,
              result,
            );
          }
        },
      );
    };

    const observe = () => {
      observerRef.current?.disconnect();

      const observer = new MutationObserver(
        (mutations) => {
          if (language === "en") {
            return;
          }

          const roots = new Set();

          mutations.forEach((mutation) => {
            if (
              mutation.type === "characterData" &&
              mutation.target.parentElement
            ) {
              originalText.set(
                mutation.target,
                mutation.target.nodeValue,
              );
              roots.add(
                mutation.target.parentElement,
              );
            }

            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.TEXT_NODE) {
                if (node.parentElement) {
                  roots.add(node.parentElement);
                }
              } else if (
                node.nodeType === Node.ELEMENT_NODE
              ) {
                roots.add(node);
              }
            });
          });

          const runId = runIdRef.current;

          roots.forEach((root) => {
            translateRoot(root, runId)
              .catch(() => {
                // The main translation status already reports errors.
              })
              .finally(observe);
          });
        },
      );

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
      });

      observerRef.current = observer;
    };

    const run = async () => {
      const runId = runIdRef.current + 1;
      runIdRef.current = runId;

      observerRef.current?.disconnect();
      setTranslationError("");
      setTranslationProgress(0);

      rememberOriginals(document.body);
      restoreEnglish(document.body);

      if (language === "en") {
        setTranslationStatus("ready");
        setTranslationProgress(100);
        observe();
        return;
      }

      setTranslationStatus("translating");

      try {
        await translateRoot(
          document.body,
          runId,
        );

        if (runId !== runIdRef.current) {
          return;
        }

        setTranslationStatus("ready");
        setTranslationProgress(100);
      } catch (error) {
        restoreEnglish(document.body);
        setTranslationStatus("error");
        setTranslationError(
          error instanceof Error
            ? error.message
            : "The page could not be translated.",
        );
      } finally {
        observe();
      }
    };

    const startTimer = window.setTimeout(
      run,
      50,
    );

    return () => {
      window.clearTimeout(startTimer);
      runIdRef.current += 1;
      observerRef.current?.disconnect();
    };
  }, [
    language,
    currentLanguage.backendOnly,
    currentLanguage.translatorCode,
    setTranslationError,
    setTranslationProgress,
    setTranslationStatus,
  ]);

  return null;
}
