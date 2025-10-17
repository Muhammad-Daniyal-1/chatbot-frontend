"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "@splidejs/react-splide/css";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import ReactMarkdown from "react-markdown";
import {
  ERROR_MESSAGES,
  LOADING_MESSAGES,
  UI_TEXTS,
  ALT_TEXTS,
} from "../constants/texts";
import { CHAT_COLORS } from "../constants/colors";

// Message bubble component for displaying chat messages
const CopyIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="9"
      y="9"
      width="13"
      height="13"
      rx="2"
      fill="#A3A3A3"
      opacity="0.2"
      className="group-hover:fill-blue-500"
    />
    <rect
      x="3"
      y="3"
      width="13"
      height="13"
      rx="2"
      stroke="#A3A3A3"
      strokeWidth="2"
      className="group-hover:stroke-blue-500"
    />
  </svg>
);

const MessageBubble = ({ message, onImagesLoaded }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(
    !(message.isStreaming === true) && !!message.text
  );

  const [copied, setCopied] = useState(false);
  const [isMarkdownRendered, setIsMarkdownRendered] = useState(false);

  useEffect(() => {
    if (message.relatedImages?.length > 0) {
      const images = message.relatedImages;
      let loadedCount = 0;

      images.forEach((image) => {
        const img = new window.Image();
        img.src = image.imageUrl;
        img.onload = () => {
          loadedCount++;
          if (loadedCount === images.length) {
            setIsLoaded(true);
            if (onImagesLoaded) onImagesLoaded();
          }
        };
      });
    } else {
      setIsLoaded(true);
      if (onImagesLoaded) onImagesLoaded();
    }
  }, [message.relatedImages, onImagesLoaded]);

  // 메시지 버블 로딩바 사용시 필요한 코드
  /*   useEffect(() => {
    if (!message.isStreaming && message.text) {
      // Add a small delay before showing the content
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [message.isStreaming, message.text]); */

  // 메시지 버블바 로딩바 사용시에는 없애야 함.
  useEffect(() => {
    if (message.isStreaming === true) {
      // Add a small delay before showing the content
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10);
      return () => clearTimeout(timer);
    } else if (message.text) {
      // For non-streaming messages with text, show immediately
      setIsVisible(true);
    }
  }, [message.isStreaming, message.text]);

  const handleLightboxOpen = useCallback(
    (index) => {
      if (message.relatedImages?.length > 0) {
        setPhotoIndex(index);
        setLightboxOpen(true);
      }
    },
    [message.relatedImages]
  );

  const handleCopy = () => {
    if (message.text) {
      navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  const handleMarkdownRender = () => {
    setIsMarkdownRendered(true);
  };

  const splideOptions = {
    perPage: 3,
    perMove: 1,
    gap: "1rem",
    arrows: message.relatedImages?.length > 2,
    pagination: false,
    breakpoints: {
      640: {
        perPage: 2,
      },
    },
    classes: {
      arrows: "splide__arrows",
      arrow: "splide__arrow",
      prev: "splide__arrow--prev",
      next: "splide__arrow--next",
      disabled: "is-disabled",
    },
  };

  if (message.type === "user") {
    return (
      <div className="flex justify-end user-message">
        <div
          className={`bg-gradient-to-r from-[${CHAT_COLORS.userMessage.start}] to-[${CHAT_COLORS.userMessage.end}] text-white p-2.5 px-4 rounded-[20px] rounded-br-none text-sm sm:text-base inline-block max-w-[80%] break-words`}
        >
          {message.text}
        </div>
      </div>
    );
  }

  //메시지 버블 로딩바 에니메이션
  /*   if (message.isStreaming) {
    return (
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#eee] leading-relaxed text-sm sm:text-base text-[#333]">
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-2/5"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/4"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-2/5"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/4"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-2/5"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
        </div>
      </div>
    );
  } */

  return (
    <div className="mb-2">
      <div
        className={`bg-white p-4 sm:p-5 rounded-xl leading-relaxed text-sm sm:text-base text-[#333] ${
          isMarkdownRendered ? "border border-[#eee]" : "border-0"
        }`}
      >
        <div className="prose prose-sm max-w-none">
          <div
            className={`transition-opacity duration-300 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <ReactMarkdown
              components={{
                p: ({ node, ...props }) => <p className="mb-4" {...props} />,
                h1: ({ node, ...props }) => (
                  <h1 className="text-2xl font-bold mb-4" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-xl font-bold mb-3" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-lg font-bold mb-2" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc pl-4 mb-4" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal pl-4 mb-4" {...props} />
                ),
                li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className="border-l-4 border-gray-300 pl-4 italic mb-4"
                    {...props}
                  />
                ),
                code: ({ node, inline, ...props }) =>
                  inline ? (
                    <code
                      className="bg-gray-100 rounded px-1 py-0.5"
                      {...props}
                    />
                  ) : (
                    <pre
                      className="bg-gray-100 rounded p-4 mb-4 overflow-x-auto"
                      {...props}
                    />
                  ),
                a: ({ node, ...props }) => (
                  <a
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  />
                ),
                strong: ({ node, ...props }) => (
                  <strong className="font-bold" {...props} />
                ),
                em: ({ node, ...props }) => (
                  <em className="italic" {...props} />
                ),
              }}
              onLoad={handleMarkdownRender}
            >
              {message.text}
            </ReactMarkdown>
          </div>
        </div>
        {message.relatedImages && message.relatedImages.length > 0 && (
          <div
            className={`mt-2 transition-opacity duration-300 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="mb-2 text-md font-bold">
              {UI_TEXTS.RELATED_IMAGES}
            </div>
            <Splide options={splideOptions} className="image-slider">
              {message.relatedImages.map((image, index) => (
                <SplideSlide key={index}>
                  <div
                    className="relative aspect-video rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => handleLightboxOpen(index)}
                  >
                    <Image
                      src={image.imageUrl}
                      alt={`Related image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                </SplideSlide>
              ))}
            </Splide>
            <Lightbox
              open={lightboxOpen}
              close={() => setLightboxOpen(false)}
              index={photoIndex}
              slides={message.relatedImages.map((image) => ({
                src: image.imageUrl,
              }))}
              carousel={{
                finite: false,
                preload: 2,
                spacing: 0,
                padding: 0,
              }}
              animation={{ fade: 300 }}
              controller={{ closeOnBackdropClick: true }}
              styles={{
                container: { backgroundColor: "rgba(0, 0, 0, 0.9)" },
                button: { color: "white" },
              }}
            />
          </div>
        )}
      </div>
      {message.type === "assistant" && (
        <div className="flex items-center mt-2 mb-1 pl-2">
          <button
            onClick={handleCopy}
            className="flex items-center text-gray-400 hover:text-blue-500 group"
            aria-label="Copy answer"
          >
            <CopyIcon />
            <span className="ml-1 text-xs">{copied ? "Copied!" : "Copy"}</span>
          </button>
        </div>
      )}
    </div>
  );
};

// Error message component for displaying error notifications
const ErrorMessage = ({ error }) => {
  if (!error) return null;
  return (
    <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-slide-in-right">
      {error}
    </div>
  );
};

// Main chat component
export default function ChatComponent({ searchParams }) {
  const [isChatStarted, setIsChatStarted] = useState(false);
  const EXPIRATION_MINUTES = 60;
  const [messages, setMessages] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("chatMessages");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (
            parsed.savedAt &&
            Date.now() - parsed.savedAt > EXPIRATION_MINUTES * 60 * 1000
          ) {
            localStorage.removeItem("chatMessages");
            return [];
          }
          return parsed.messages || [];
        } catch {
          return [];
        }
      }
      return [];
    }
    return [];
  });
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(null);
  const [conversationId, setConversationId] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("conversationId");
    }
    return null;
  });
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [initialQuestions, setInitialQuestions] = useState([]);
  const [llmDoingAction, setLlmDoingAction] = useState(null);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const router = useRouter();
  const textareaRef = useRef(null);
  const chatContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [abortController, setAbortController] = useState(null);
  const [isInitialQuestionsLoading, setIsInitialQuestionsLoading] =
    useState(true);
  const [isSuggestedQuestionsLoading, setIsSuggestedQuestionsLoading] =
    useState(false);
  const [activeInitialQuestionIndex, setActiveInitialQuestionIndex] =
    useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showEmptySpace, setShowEmptySpace] = useState(false);
  const [emptySpaceHeight, setEmptySpaceHeight] = useState("60vh");
  const [userMessageCount, setUserMessageCount] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const smoothScroll = (element, block = "end") => {
    element.scrollIntoView({
      behavior: "smooth",
      block: block,
    });
  };

  // Receive token from parent window
  useEffect(() => {
    const handleMessage = (event) => {
      console.log(event);
      // Only accept from your main site’s domain
      if (!event.origin.includes("localhost:3000")) return;
      console.log(event.data);

      if (event.data?.type === "AUTH_TOKEN" && event.data?.token) {
        const token = event.data.token;
        // Save to localStorage or memory
        localStorage.setItem("token", token);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Fetch initial suggested questions
  useEffect(() => {
    const fetchInitialQuestions = async () => {
      try {
        setIsInitialQuestionsLoading(true);
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/suggested-questions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(ERROR_MESSAGES.FETCH_SUGGESTED_QUESTIONS_ERROR);
        }

        const data = await response.json();
        if (data.success && data.data) {
          setInitialQuestions(
            data.data.map((q) => ({
              id: q._id,
              text: q.question,
            }))
          );
        }
      } catch (error) {
        console.error(UI_TEXTS.ERROR_FETCHING_QUESTIONS, error);
        setInitialQuestions([]);
      } finally {
        setIsInitialQuestionsLoading(false);
      }
    };

    fetchInitialQuestions();
  }, []);

  // Focus textarea on mount and when suggested questions are loaded
  useEffect(() => {
    if (textareaRef.current) {
      // textareaRef.current.focus();
    }
  }, [isInitialQuestionsLoading, isSuggestedQuestionsLoading]);

  // Scroll when loading animation appears
  useEffect(() => {
    if (!messagesEndRef.current) return;

    const scrollToBottom = () => {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
      });
    };

    // 1. 메시지가 업데이트될 때 (새 메시지, 스트리밍, 이미지 등)
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.isStreaming) {
      // scrollToBottom();
    }

    // 2. 로딩 상태가 변경될 때
    if (llmDoingAction) {
      // scrollToBottom();
    }

    // 3. 제안된 질문이 로드될 때
    if (!isSuggestedQuestionsLoading && suggestedQuestions.length > 0) {
      // scrollToBottom();
    }

    // 4. 관련 이미지가 로드될 때
    if (lastMessage?.relatedImages?.length > 0) {
      const images = lastMessage.relatedImages;
      let loadedCount = 0;

      images.forEach((image) => {
        const img = new window.Image();
        img.src = image.imageUrl;
        img.onload = () => {
          loadedCount++;
          if (loadedCount === images.length) {
            // scrollToBottom();
          }
        };
      });
    }
  }, [
    messages,
    llmDoingAction,
    isSuggestedQuestionsLoading,
    suggestedQuestions,
  ]);

  // Clear error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Check authentication and load conversation if needed
  useEffect(() => {
    // const token = localStorage.getItem("token");
    // if (!token) {
    //   router.push("/login");
    //   return;
    // }

    const conversationId = searchParams?.get("ci");
    if (conversationId) {
      setConversationId(conversationId);
      loadConversation(conversationId).catch((err) => {
        console.error(UI_TEXTS.ERROR_LOADING_CONVERSATION, err);
        setError(ERROR_MESSAGES.CONVERSATION_LOAD_ERROR);
      });
      setIsChatStarted(true);
    }
  }, [router, searchParams]);

  // Handle authentication errors
  const handleAuthError = () => {
    // localStorage.removeItem("token");
    // setError(ERROR_MESSAGES.UNAUTHORIZED);
    // router.push("/login");
  };

  // Handle network errors
  const handleNetworkError = () => {
    setError(ERROR_MESSAGES.NETWORK_ERROR);
  };

  // Load conversation from server
  const loadConversation = async (conversationId) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    // if (!token) {
    //   handleAuthError();
    //   return;
    // }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/chat/conversation/${conversationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      ).catch(() => {
        throw new Error("Network error");
      });

      if (response.status === 401) {
        handleAuthError();
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Server error");
      }

      const data = await response.json();
      if (!data.success || !data.data) {
        throw new Error(ERROR_MESSAGES.INVALID_RESPONSE);
      }

      if (data.data.conversation) {
        setConversationId(data.data.conversation.id);
      }

      if (data.data.messages) {
        const formattedMessages = data.data.messages
          .filter((msg) => msg.message !== null)
          .map((msg) => ({
            type: msg.role,
            text: msg.message,
            timestamp: new Date(msg.timestamp),
            suggestedQuestions: msg.suggestedQuestions || [],
            relatedImages: msg.relatedImages || [],
          }));

        setMessages(formattedMessages);

        const lastAssistantMessage = [...data.data.messages]
          .reverse()
          .find(
            (msg) =>
              msg.role === "assistant" && msg.suggestedQuestions?.length > 0
          );

        if (lastAssistantMessage) {
          setIsSuggestedQuestionsLoading(true);
          setTimeout(() => {
            setSuggestedQuestions(lastAssistantMessage.suggestedQuestions);
            setIsSuggestedQuestionsLoading(false);
          }, 7500);
        }
      }
    } catch (error) {
      console.error(UI_TEXTS.ERROR_LOADING_CONVERSATION, error);
      if (error.message === "Network error") {
        handleNetworkError();
      } else if (error.message.includes("Invalid")) {
        setError(ERROR_MESSAGES.SERVER_ERROR);
      } else {
        setError(ERROR_MESSAGES.CONVERSATION_LOAD_ERROR);
      }
      throw error;
    }
  };

  // Update URL query parameters
  const updateQueryParams = (conversationId) => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (conversationId) {
        params.set("ci", conversationId);
      } else {
        params.delete("ci");
      }
      const newPath =
        window.location.pathname +
        (params.toString() ? `?${params.toString()}` : "");
      router.replace(newPath, { scroll: false });
    } catch (error) {
      console.error(UI_TEXTS.ERROR_UPDATING_PARAMS, error);
    }
  };

  // Send message to server
  const sendMessage = async (text) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // Create new abort controller for this request
    const controller = new AbortController();
    setAbortController(controller);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/chat/message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            campus: "suwon",
            message: text,
            ...(conversationId ? { conversationId } : {}),
          }),
          signal: controller.signal,
        }
      ).catch((error) => {
        if (error.name === "AbortError") {
          console.log(UI_TEXTS.REQUEST_ABORTED);
          return null;
        }
        throw new Error("Network error");
      });

      if (!response) return; // Request was aborted

      if (response.status === 401) {
        handleAuthError();
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Server error");
      }

      setLlmDoingAction(null);

      // Create a new message for streaming
      const newMessage = {
        type: "assistant",
        text: "",
        timestamp: new Date(),
        isStreaming: true,
      };

      setMessages((prev) => [...prev, newMessage]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));

            if (data.type === "content_delta") {
              const parsed = data.data.parsed;
              if (parsed.answer) {
                setMessages((prev) => {
                  const newMessages = [...prev];
                  const lastMessage = newMessages[newMessages.length - 1];
                  if (lastMessage.isStreaming) {
                    lastMessage.text = parsed.answer;
                    // Adjust empty space height based on message length
                    const messageLength = parsed.answer.length;
                    const isWidget = searchParams?.get("widget") === "true";
                    let factor = 2;
                    if (isWidget || isMobile) {
                      factor = 5;
                    }
                    const baseHeight = isWidget
                      ? userMessageCount === 0
                        ? 50
                        : 60
                      : userMessageCount === 0
                      ? 70
                      : 75;
                    const newHeight = Math.max(
                      0,
                      baseHeight - (messageLength / 100) * factor
                    );
                    setEmptySpaceHeight(`${newHeight}vh`);
                  }
                  return newMessages;
                });
                setLlmDoingAction(null);
              }
            } else if (data.type === "content_done") {
              const parsed = data.data.parsed;
              setMessages((prev) => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage.isStreaming) {
                  lastMessage.text = parsed.answer;
                  lastMessage.isStreaming = false;
                  // setShowEmptySpace(false); // 데이터 로드 후 빈 공간 제거 비활성화
                  if (parsed.suggestedQuestions?.length > 0) {
                    setIsSuggestedQuestionsLoading(true);
                    // Clear any existing suggested questions first
                    setSuggestedQuestions([]);
                    // Then set the new questions after delay
                    setTimeout(() => {
                      setSuggestedQuestions(parsed.suggestedQuestions);
                      setIsSuggestedQuestionsLoading(false);
                    }, 7500); // 15 seconds delay
                  }
                  if (parsed.relatedImages?.length > 0) {
                    lastMessage.relatedImages = parsed.relatedImages;
                  }
                }
                setLlmDoingAction(null);
                return newMessages;
              });
            } else if (data.type === "complete") {
              setLlmDoingAction(null);
              if (!conversationId) {
                const newConversationId = data.data.conversationId;
                if (newConversationId) {
                  setConversationId(newConversationId);
                  updateQueryParams(newConversationId);
                }
              }
            } else if (data.type === "tool_delta") {
              setLlmDoingAction("searching_documents");
            }
          }
        }
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.log(UI_TEXTS.REQUEST_ABORTED);
        return;
      }
      console.error(UI_TEXTS.ERROR_SENDING_MESSAGE, error);
      if (error.message === "Network error") {
        handleNetworkError();
      } else {
        setError(ERROR_MESSAGES.MESSAGE_SEND_ERROR);
      }
      throw error;
    } finally {
      setAbortController(null);
    }
  };

  // Handle message submission
  const handleMessageSubmit = useCallback(
    async (text) => {
      if (!text.trim()) return;

      if (!isChatStarted) setIsChatStarted(true);

      // Add user message
      setMessages((prev) => {
        const newMessages = [
          ...prev,
          {
            type: "user",
            text,
            timestamp: new Date(),
          },
        ];

        // Show empty space and scroll for all messages after the first one
        if (prev.length >= 0) {
          // Changed from prev.length > 0 to prev.length >= 0
          setShowEmptySpace(true);
          // Set empty space height based on message count and length
          const isWidget = searchParams?.get("widget") === "true";
          let factor = 2;
          if (isWidget || isMobile) {
            factor = 5;
          }
          const baseHeight = isWidget
            ? userMessageCount === 0
              ? 50
              : 60
            : userMessageCount === 0
            ? 70
            : 75;
          const messageLength = text.length;
          const newHeight = Math.max(
            0,
            baseHeight - (messageLength / 100) * factor
          );
          setEmptySpaceHeight(`${newHeight}vh`);
          setUserMessageCount((prev) => prev + 1);
          // Use requestAnimationFrame to ensure DOM is updated before scrolling
          requestAnimationFrame(() => {
            if (messagesEndRef.current) {
              messagesEndRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
          });
        }

        return newMessages;
      });

      setInputValue("");
      setSuggestedQuestions([]);

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      // Start LLM response after scrolling
      setLlmDoingAction("analyzing_data");
      sendMessage(text)
        .catch((error) => {
          // Error is already handled in sendMessage
        })
        .finally(() => {
          setLlmDoingAction(null);
        });
    },
    [isChatStarted, sendMessage, userMessageCount, searchParams]
  );

  // Update the reset button click handler
  const handleReset = useCallback(() => {
    // Abort any ongoing API request
    if (abortController) {
      abortController.abort();
    }

    // Reset all states
    setMessages([]);
    setSuggestedQuestions([]);
    setIsChatStarted(false);
    setConversationId(null);
    setInputValue("");
    setError(null);
    setLlmDoingAction(null);
    setActiveSuggestionIndex(0);
    setAbortController(null);
    setUserMessageCount(0);
    setEmptySpaceHeight("60vh");
    setShowEmptySpace(false);

    // Update URL
    updateQueryParams(null);

    // Reset textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Use Next.js router to refresh the page
    router.push(router.asPath);

    if (typeof window !== "undefined") {
      localStorage.removeItem("chatMessages");
      localStorage.removeItem("conversationId");
    }
  }, []);

  // 이미지 로딩 상태 관리
  useEffect(() => {
    // 마지막 assistant 메시지에서 관련 이미지가 있으면 로딩 시작
    const lastAssistant = [...messages]
      .reverse()
      .find((m) => m.type === "assistant");
    if (
      lastAssistant &&
      lastAssistant.relatedImages &&
      lastAssistant.relatedImages.length > 0
    ) {
      setIsImageLoading(true);
    } else {
      setIsImageLoading(false);
    }
  }, [messages]);

  const handleImagesLoaded = useCallback(() => {
    setIsImageLoading(false);
  }, []);

  // 마지막 assistant 메시지의 스트리밍/이미지 상태 기반으로 로딩 표시 결정
  const lastAssistant = [...messages]
    .reverse()
    .find((m) => m.type === "assistant");
  const isStreaming = lastAssistant?.isStreaming;
  const hasRelatedImages =
    lastAssistant?.relatedImages && lastAssistant.relatedImages.length > 0;
  const isLoading =
    llmDoingAction === "analyzing_data" ||
    llmDoingAction === "searching_documents" ||
    isStreaming ||
    (hasRelatedImages && isImageLoading);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined" && messages.length > 0) {
      const dataToStore = {
        messages,
        savedAt: Date.now(),
      };
      localStorage.setItem("chatMessages", JSON.stringify(dataToStore));
    }
  }, [messages]);

  // Save conversationId to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined" && conversationId) {
      localStorage.setItem("conversationId", conversationId);
    }
  }, [conversationId]);

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col justify-center items-center">
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        .chat-container {
          scroll-behavior: smooth;
          transition: scroll-behavior 0.8s ease-in-out;
        }
        .circle-loader {
          width: 100%;
          height: 100%;
          background: #4452f9;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .circle-loader .dot {
          color: #fff;
          font-size: 1.5rem;
          margin: 0 0.5px;
          opacity: 0.3;
          animation: blink 1.2s infinite;
        }
        .circle-loader .dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .circle-loader .dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes blink {
          0%,
          80%,
          100% {
            opacity: 0.3;
          }
          40% {
            opacity: 1;
          }
        }
        @media (max-width: 640px) {
          .circle-loader .dot {
            font-size: 1.2rem;
            margin: 0 0px;
          }
        }
        @media (min-width: 641px) {
          .circle-loader .dot {
            font-size: 1.5rem;
            margin: 0 -3px;
          }
        }
        /* Widget specific styles */
        html[data-widget="true"] .circle-loader .dot {
          font-size: 1.2rem;
          margin: 0 -2px;
        }
      `}</style>
      <ErrorMessage error={error} />
      {/* Reset button */}
      {isChatStarted && !isLoading && (
        <div className="fixed top-4 right-4 group z-[9999]">
          <button
            onClick={handleReset}
            className="bg-white hover:bg-gray-100 text-gray-700 w-10 h-10 rounded-full shadow-md flex items-center justify-center transition-all duration-200 z-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
          <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            {UI_TEXTS.RESET_TOOLTIP}
          </div>
        </div>
      )}
      <div className={`flex flex-col transition-all duration-500 w-full`}>
        {/* Chat messages container */}
        <div
          ref={chatContainerRef}
          className={`overflow-y-auto transition-all duration-500 
            ${
              isChatStarted ? "w-[95%] md:w-[700px]" : "w-[95%] md:w-[500px]"
            } mx-auto flex flex-col-reverse justify-between [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}
        >
          <div className="flex flex-col gap-3 sm:gap-5 pt-4">
            {messages.map(
              (message, index) =>
                message.text !== "" && (
                  <div key={index} className="animate-slide-in">
                    <MessageBubble
                      message={message}
                      onImagesLoaded={
                        index === messages.length - 1
                          ? handleImagesLoaded
                          : undefined
                      }
                    />
                  </div>
                )
            )}
            {llmDoingAction && (
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#666]">
                <div className="relative w-4 h-4 sm:w-5 sm:h-5 rounded-full overflow-hidden flex-shrink-0">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${CHAT_COLORS.loadingAnimation.gradient} animate-[rainbowFlow_4s_ease_infinite] bg-[length:400%_400%]`}
                  />
                  <div
                    className={`absolute inset-0 ${CHAT_COLORS.loadingAnimation.glow} rounded-full animate-[floatSmoke_4s_infinite_ease-in-out_alternate] mix-blend-screen ${CHAT_COLORS.loadingAnimation.blur} ${CHAT_COLORS.loadingAnimation.opacity}`}
                  />
                  <div
                    className={`absolute inset-0 ${CHAT_COLORS.loadingAnimation.glow} rounded-full animate-[floatSmoke_5s_infinite_ease-in-out_alternate] mix-blend-screen ${CHAT_COLORS.loadingAnimation.blur} ${CHAT_COLORS.loadingAnimation.opacity}`}
                    style={{ animationDelay: "1s" }}
                  />
                  <div
                    className={`absolute inset-0 ${CHAT_COLORS.loadingAnimation.glow} rounded-full animate-[floatSmoke_6s_infinite_ease-in-out_alternate] mix-blend-screen ${CHAT_COLORS.loadingAnimation.blur} ${CHAT_COLORS.loadingAnimation.opacity}`}
                    style={{ animationDelay: "2s" }}
                  />
                  <Image
                    src="/logo_ci.png"
                    alt={ALT_TEXTS.COMPANY_LOGO}
                    width={8}
                    height={8}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] object-contain pointer-events-none z-10"
                  />
                </div>
                {llmDoingAction === "analyzing_data" && (
                  <div>{LOADING_MESSAGES.ANALYZING}</div>
                )}
                {llmDoingAction === "searching_documents" && (
                  <div>{LOADING_MESSAGES.SEARCHING}</div>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
            {/* Add temporary empty space at the bottom */}
            {showEmptySpace && <div style={{ height: emptySpaceHeight }} />}
          </div>
          {/* Header with logo */}
          <div
            className={`transition-all duration-500 ${
              isChatStarted ? "pt-4" : "pt-2"
            }`}
          >
            <div
              className="logo-wrapper relative w-[40px] h-[40px] sm:w-[54px] sm:h-[54px] mx-auto mb-2 sm:mb-3 cursor-pointer"
              onClick={handleReset}
            >
              <Image
                src="/logo_circle.png"
                alt={ALT_TEXTS.CIRCLE_BACKGROUND}
                width={54}
                height={54}
                className="w-full h-full block"
              />
              <Image
                src="/logo_ci.png"
                alt={ALT_TEXTS.COMPANY_CI}
                width={24}
                height={24}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              />
            </div>
            <div className="title text-lg sm:text-xl text-[#4a4a4a] text-center font-bold">
              {UI_TEXTS.TITLE}
            </div>
            <div className="text-xs text-gray-400 text-center mt-1">
              {UI_TEXTS.SUBTITLE}
            </div>
          </div>
        </div>

        {/* Input container */}
        <div
          className={`transition-all duration-500 ${
            isChatStarted ? "sticky bottom-0 left-0 right-0" : "relative"
          } p-2 pt-0`}
        >
          {/* suggestedQuestions 토글 버튼: suggestedQuestions가 있을 때만 보임 */}
          {suggestedQuestions.length > 0 && (
            <div
              className={`flex justify-end mb-1 transition-all duration-500 ${
                isChatStarted ? "w-full md:w-[700px]" : "w-full md:w-[500px]"
              } mx-auto`}
            >
              <button
                onClick={() => setShowSuggestions((prev) => !prev)}
                className="p-1 rounded hover:bg-gray-200 transition"
                aria-label={
                  showSuggestions ? "추천 질문 숨기기" : "추천 질문 보이기"
                }
              >
                {showSuggestions ? (
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="#666"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M18 15l-6-6-6 6"
                      stroke="#666"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            </div>
          )}
          <div
            className={`transition-all duration-500 ${
              isChatStarted ? "w-full md:w-[700px]" : "w-full md:w-[500px]"
            } mx-auto`}
          >
            <div className="bg-white border border-[#ddd] rounded-2xl p-3 sm:p-5 flex flex-col gap-3 sm:gap-4 shadow-[0_4px_10px_rgba(0,0,0,0.05)]">
              {!isChatStarted && (
                <div className="flex flex-wrap gap-1.5 sm:gap-2 slide-up-animation">
                  {isInitialQuestionsLoading ? (
                    <div className="flex items-center gap-2 w-full justify-center py-2">
                      <div
                        className={`w-3 h-3 rounded-full ${CHAT_COLORS.loadingDots.className} animate-pulse`}
                      ></div>
                      <div
                        className={`w-3 h-3 rounded-full ${CHAT_COLORS.loadingDots.className} animate-pulse`}
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className={`w-3 h-3 rounded-full ${CHAT_COLORS.loadingDots.className} animate-pulse`}
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  ) : (
                    initialQuestions.map((suggestion, index) => (
                      <button
                        key={suggestion.id}
                        onClick={() => {
                          handleMessageSubmit(suggestion.text);
                        }}
                        onMouseEnter={() =>
                          setActiveInitialQuestionIndex(index)
                        }
                        onMouseLeave={() => setActiveInitialQuestionIndex(-1)}
                        className={`
                          px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-left rounded-[20px] text-sm sm:text-base text-[#333] border-none cursor-pointer transition-all duration-300
                          ${
                            activeInitialQuestionIndex === 0
                              ? index === 0
                                ? CHAT_COLORS.suggestedQuestions.hover
                                : CHAT_COLORS.suggestedQuestions.default
                              : activeInitialQuestionIndex === -1
                              ? CHAT_COLORS.suggestedQuestions.default
                              : index === activeInitialQuestionIndex
                              ? CHAT_COLORS.suggestedQuestions.hover
                              : CHAT_COLORS.suggestedQuestions.default
                          }
                        `}
                      >
                        {suggestion.text}
                      </button>
                    ))
                  )}
                </div>
              )}
              {/* suggestedQuestions 영역 show/hide */}
              {suggestedQuestions.length > 0 && showSuggestions && (
                <div className="flex flex-wrap gap-1.5 sm:gap-2 slide-up-animation">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        handleMessageSubmit(question);
                      }}
                      className={`
                        px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-left rounded-[20px] text-sm sm:text-base text-[#333] border-none cursor-pointer transition-all duration-300
                        ${
                          activeInitialQuestionIndex === 0
                            ? index === 0
                              ? CHAT_COLORS.suggestedQuestions.hover
                              : CHAT_COLORS.suggestedQuestions.default
                            : activeInitialQuestionIndex === -1
                            ? CHAT_COLORS.suggestedQuestions.default
                            : index === activeInitialQuestionIndex
                            ? CHAT_COLORS.suggestedQuestions.hover
                            : CHAT_COLORS.suggestedQuestions.default
                        }
                      `}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex items-center bg-[#f5f5f5] rounded-lg p-2 sm:p-2.5 px-2.5 sm:px-3.5">
                <textarea
                  ref={textareaRef}
                  className="flex-1 border-none bg-transparent outline-none text-sm sm:text-base text-[#4a4a4a] font-sans resize-none overflow-y-auto max-h-[200px]"
                  placeholder={
                    isLoading
                      ? UI_TEXTS.PLACEHOLDER_LOADING
                      : UI_TEXTS.PLACEHOLDER
                  }
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleMessageSubmit(inputValue);
                    }
                  }}
                  rows={1}
                />
                <button
                  onClick={() => handleMessageSubmit(inputValue)}
                  className="w-7 h-7 sm:w-8 sm:h-8 ml-2 border-none rounded-full cursor-pointer flex justify-center items-center transition-transform duration-200 hover:scale-110"
                >
                  {isLoading ? (
                    <div className="circle-loader">
                      <span className="dot">&middot;</span>
                      <span className="dot">&middot;</span>
                      <span className="dot">&middot;</span>
                    </div>
                  ) : (
                    <Image
                      src="/send_message.png"
                      alt={ALT_TEXTS.SEND_MESSAGE}
                      width={50}
                      height={50}
                    />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
