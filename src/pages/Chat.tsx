
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, User, Brain, ChevronRight } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { ChatMessage, sendChatMessage } from "@/services/AIService";
import { suggestedChatQuestions } from "@/data/questions";

const Chat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: "assistant", 
      content: "مرحباً! أنا مساعدك الذكي لتحليل الشخصية. يمكنني مساعدتك في فهم شخصيتك بشكل أفضل من خلال محادثة طبيعية. كيف يمكنني مساعدتك اليوم؟"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // التمرير التلقائي إلى أحدث رسالة
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // إضافة رسالة المستخدم
    const userMessage: ChatMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // إرسال الرسالة إلى API
      const response = await sendChatMessage([...messages, userMessage]);
      
      // إضافة رد المساعد
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      console.error("خطأ في إرسال الرسالة:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في التواصل مع المساعد الذكي. حاول مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-4xl"
      >
        <Card className="border-2 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Avatar className="h-12 w-12 bg-primary/10">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>
                  <Brain className="h-6 w-6 text-primary" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">مساعد تحليل الشخصية</CardTitle>
                <CardDescription>
                  تحدث معي لفهم شخصيتك بشكل أفضل
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="border-t border-b h-[50vh]">
              <ScrollArea className="h-full p-4">
                <div className="space-y-4 pb-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === "assistant" ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div
                        className={`flex gap-3 max-w-[80%] ${
                          message.role === "assistant" ? "flex-row" : "flex-row-reverse"
                        }`}
                      >
                        <Avatar className={`h-8 w-8 mt-1 ${message.role === "assistant" ? "bg-primary/10" : "bg-secondary"}`}>
                          <AvatarFallback>
                            {message.role === "assistant" ? (
                              <Brain className="h-4 w-4 text-primary" />
                            ) : (
                              <User className="h-4 w-4" />
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`rounded-2xl px-4 py-2 ${
                            message.role === "assistant"
                              ? "bg-muted text-foreground"
                              : "bg-primary text-primary-foreground"
                          }`}
                        >
                          <p style={{ whiteSpace: "pre-wrap" }}>{message.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4 pt-4">
            {messages.length <= 2 && (
              <div className="w-full">
                <p className="text-sm text-muted-foreground mb-2">أسئلة مقترحة:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedChatQuestions.slice(0, 4).map((question, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary/10 transition-colors px-3 py-1.5"
                      onClick={() => handleSuggestedQuestion(question)}
                    >
                      {question}
                      <ChevronRight className="ml-1 h-3 w-3" />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex w-full items-center space-x-2 rtl:space-x-reverse">
              <Input
                placeholder="اكتب رسالتك هنا..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!input.trim() || isLoading}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </AppLayout>
  );
};

export default Chat;
