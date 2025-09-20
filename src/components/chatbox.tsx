import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "framer-motion";
import { GEMINI_API_KEY } from "@/lib/gemini";

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

interface ChatboxProps {
  isOpen: boolean;
  onClose: () => void;
  studentProfile: {
    skills: string;
    qualifications: string;
    locations: string;
    sectors: string;
  };
}

export const Chatbox: React.FC<ChatboxProps> = ({
  isOpen,
  onClose,
  studentProfile,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current!.scrollTop = scrollRef.current!.scrollHeight;
      }, 0);
    }
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: "model",
          text: "Hello! How can I help you refine your internship search today?",
        },
      ]);
    }
    scrollToBottom();
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === "" || isLoading) return;
    if (!GEMINI_API_KEY) {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "The API key is missing. Please add it in src/lib/gemini.ts to use the chat.",
        },
      ]);
      setIsLoading(false);
      return;
    }

    const userMessage: ChatMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const systemPrompt = `You are an expert career counselor AI for a smart internship allocation engine. Your goal is to help a student find the perfect internship based on their profile.

      Student's Profile:
      - Skills: ${studentProfile.skills}
      - Qualifications: ${studentProfile.qualifications}
      - Preferred Locations: ${studentProfile.locations}
      - Sector Interests: ${studentProfile.sectors}

      Your task is to provide concise, helpful, and actionable advice. You can suggest specific roles, companies, or ways to improve their search. Keep your responses brief and to the point. Previous conversation is also provided for context.`;

      const chatHistoryForAPI = messages.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.text }],
      }));
      chatHistoryForAPI.push({ role: "user", parts: [{ text: input }] });

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;

      const payload = {
        contents: chatHistoryForAPI,
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("API response was not ok.");
      }

      const result = await response.json();
      const modelResponse =
        result.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't process that. Could you try rephrasing?";

      setMessages((prev) => [...prev, { role: "model", text: modelResponse }]);
    } catch (error) {
      console.error("Error fetching from Gemini API:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "Sorry, I'm having trouble connecting. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const smartSuggestions = [
    `Suggest top 3 internships for my profile in ${
      studentProfile.locations.split(",")[0] || "Delhi"
    }.`,
    "What skills should I learn to improve my chances?",
    `Find remote ${
      studentProfile.sectors.split(",")[0] || "tech"
    } internships.`,
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <Card className="w-96 h-[60vh] flex flex-col shadow-2xl rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="w-6 h-6 text-primary" />
                Internship Advisor
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-full" ref={scrollRef}>
                <div className="p-4 space-y-4">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 ${
                        msg.role === "user" ? "justify-end" : ""
                      }`}
                    >
                      {msg.role === "model" && (
                        <Bot className="w-6 h-6 text-primary flex-shrink-0" />
                      )}
                      <div
                        className={`max-w-xs px-4 py-2 rounded-2xl ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground rounded-br-none"
                            : "bg-muted rounded-bl-none"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {msg.text}
                        </p>
                      </div>
                      {msg.role === "user" && (
                        <User className="w-6 h-6 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-start gap-3">
                      <Bot className="w-6 h-6 text-primary flex-shrink-0" />
                      <div className="max-w-xs px-4 py-2 rounded-2xl bg-muted rounded-bl-none">
                        <div className="flex items-center space-x-1">
                          <span className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <span className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <span className="h-2 w-2 bg-primary rounded-full animate-bounce" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="p-4 border-t flex-col items-start gap-2">
              <div className="flex gap-2 flex-wrap">
                {messages.length <= 1 &&
                  smartSuggestions.map((suggestion, i) => (
                    <Button
                      key={i}
                      size="sm"
                      variant="outline"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs"
                    >
                      <Sparkles className="w-3 h-3 mr-1.5" />
                      {suggestion}
                    </Button>
                  ))}
              </div>
              <div className="flex w-full gap-2">
                <Input
                  placeholder="Ask for advice..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  disabled={isLoading}
                />
                <Button onClick={handleSend} disabled={isLoading}>
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
