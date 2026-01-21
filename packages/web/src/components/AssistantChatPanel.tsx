/**
 * Assistant Chat Panel Component
 *
 * A floating chat panel that provides an AI assistant interface.
 * Features:
 * - Floating action button to toggle panel visibility
 * - Chat message display with user/assistant distinction
 * - Message input with send functionality
 * - Scrollable message history
 * - Keyboard shortcut (A) to toggle panel
 */

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from "react";

/** Represents a single chat message */
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

/** Props for the AssistantChatPanel component */
interface AssistantChatPanelProps {
  /** Initial visibility state */
  defaultOpen?: boolean;
  /** Callback when a message is sent */
  onSendMessage?: (message: string) => Promise<string | undefined>;
  /** Placeholder text for the input field */
  placeholder?: string;
}

/** Generate a unique message ID */
function generateId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Format timestamp for display */
function formatTime(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AssistantChatPanel({
  defaultOpen = false,
  onSendMessage,
  placeholder = "Ask the assistant anything...",
}: AssistantChatPanelProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: generateId(),
      role: "assistant",
      content: "Hello! I'm your AI assistant. How can I help you with your project today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure panel is visible
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Keyboard shortcut to toggle panel
  useEffect(() => {
    function handleKeyDown(event: globalThis.KeyboardEvent): void {
      // Don't trigger if user is typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Toggle with 'A' key
      if (event.key.toLowerCase() === "a" && !event.metaKey && !event.ctrlKey) {
        setIsOpen((prev) => !prev);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const togglePanel = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleSendMessage = useCallback(async () => {
    const content = inputValue.trim();
    if (!content || isLoading) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: generateId(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Call external handler if provided
      let response: string | undefined;
      if (onSendMessage) {
        response = await onSendMessage(content);
      }

      // Add assistant response (or default mock response)
      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: response ?? getDefaultResponse(content),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      // Add error message
      const errorMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: "Sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading, onSendMessage]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={togglePanel}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
          isOpen
            ? "bg-gray-600 hover:bg-gray-700 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
        aria-label={isOpen ? "Close assistant" : "Open assistant"}
        title={isOpen ? "Close assistant (A)" : "Open assistant (A)"}
      >
        {isOpen ? (
          // Close icon (X)
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          // Chat/Assistant icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <line x1="9" y1="10" x2="15" y2="10" />
          </svg>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-40 w-96 h-[500px] max-h-[70vh] bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden"
          role="dialog"
          aria-label="Assistant chat panel"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                AI Assistant
              </h2>
            </div>
            <button
              onClick={togglePanel}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close assistant"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      message.role === "user"
                        ? "text-blue-200"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-900">
            <div className="flex gap-2">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={isLoading}
                rows={1}
                className="flex-1 resize-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Message input"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Default response generator for when no onSendMessage handler is provided.
 * Provides helpful contextual responses based on keywords in the user's message.
 */
function getDefaultResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes("feature") || lowerMessage.includes("task")) {
    return "I can help you manage features! Use the Kanban board to view all features, or navigate to a project to add new ones. You can filter features by status (To Do, In Progress, Done) or by category.";
  }

  if (lowerMessage.includes("project")) {
    return "Projects are the main organizational unit in Open Autocoder. Each project has its own feature database, settings, and agent configuration. Navigate to the Projects page to see all registered projects.";
  }

  if (lowerMessage.includes("agent") || lowerMessage.includes("run") || lowerMessage.includes("start")) {
    return "To run the coding agent, select a project and click the Start button in the agent control panel. The agent will work through features one by one, implementing and testing each. You can configure concurrency, YOLO mode, and testing agent ratio in Settings.";
  }

  if (lowerMessage.includes("setting") || lowerMessage.includes("config")) {
    return "You can configure your project settings in the Settings page. Key options include:\n\n- **Concurrency**: Number of parallel agents (1-5)\n- **YOLO Mode**: Skip browser testing for rapid prototyping\n- **Testing Agent Ratio**: How many testing agents per coding agent";
  }

  if (lowerMessage.includes("graph") || lowerMessage.includes("dependency") || lowerMessage.includes("dependencies")) {
    return "The dependency graph shows how features are connected. Features can depend on other features, meaning they can only be started after their dependencies are complete. Navigate to the Graph view to see the full dependency visualization.";
  }

  if (lowerMessage.includes("terminal") || lowerMessage.includes("log") || lowerMessage.includes("output")) {
    return "The Terminal page shows real-time output from the coding agents. You can view logs, filter by log level, and search for specific content. This is useful for debugging and monitoring agent progress.";
  }

  if (lowerMessage.includes("help") || lowerMessage.includes("how")) {
    return "Here's how to get started with Open Autocoder:\n\n1. **Create a project** with your app specification\n2. **Review features** in the Kanban board\n3. **Configure settings** as needed\n4. **Start the agent** to begin implementation\n5. **Monitor progress** in the Terminal or Kanban view\n\nPress 'A' to toggle this assistant panel anytime!";
  }

  if (lowerMessage.includes("keyboard") || lowerMessage.includes("shortcut")) {
    return "Keyboard shortcuts:\n\n- **A**: Toggle this assistant panel\n- **?**: Show help (if implemented)\n- **G**: Toggle Graph view (if implemented)\n- **K**: Toggle Kanban view (if implemented)\n\nMore shortcuts may be added in future updates!";
  }

  // Default response
  return "I'm here to help with Open Autocoder! You can ask me about:\n\n- Managing features and projects\n- Running the coding agent\n- Configuring settings\n- Understanding the dependency graph\n- Viewing agent output in the terminal\n\nWhat would you like to know more about?";
}
