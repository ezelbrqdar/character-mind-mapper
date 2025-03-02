
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { personalityQuestions } from "@/data/questions";
import AppLayout from "@/components/layout/AppLayout";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { analyzePersonality } from "@/services/AIService";

const Tests = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = personalityQuestions[currentQuestionIndex];

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleNext = () => {
    if (!selectedOption) {
      toast({
        title: "تنبيه",
        description: "الرجاء اختيار إجابة قبل المتابعة",
        variant: "destructive",
      });
      return;
    }

    // حفظ الإجابة الحالية
    const option = currentQuestion.options.find(opt => opt.id === selectedOption);
    if (option) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.text]: option.text
      }));
    }

    // الانتقال إلى السؤال التالي أو إرسال الإجابات
    if (currentQuestionIndex < personalityQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedOption(null);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      toast({
        title: "جاري التحليل",
        description: "يرجى الانتظار بينما يقوم الذكاء الاصطناعي بتحليل إجاباتك",
      });

      // حفظ آخر إجابة
      const option = currentQuestion.options.find(opt => opt.id === selectedOption);
      if (option) {
        const finalAnswers = {
          ...answers,
          [currentQuestion.text]: option.text
        };

        // تحليل الإجابات باستخدام الذكاء الاصطناعي
        const result = await analyzePersonality(finalAnswers);
        
        // تخزين النتائج في localStorage للوصول إليها في صفحة النتائج
        localStorage.setItem("personalityAnalysis", JSON.stringify(result));
        
        // الانتقال إلى صفحة النتائج
        navigate("/results");
      }
    } catch (error) {
      console.error("خطأ في تقديم الاختبار:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحليل الإجابات. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercentage = ((currentQuestionIndex + 1) / personalityQuestions.length) * 100;

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-2">اختبار تحليل الشخصية</CardTitle>
            <CardDescription>
              السؤال {currentQuestionIndex + 1} من {personalityQuestions.length}
            </CardDescription>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-primary h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            <h3 className="text-xl font-medium mb-4 text-right">{currentQuestion.text}</h3>
            
            <RadioGroup dir="rtl" className="space-y-3">
              {currentQuestion.options.map((option) => (
                <div
                  key={option.id}
                  className={`flex items-center space-x-2 space-x-reverse border p-3 rounded-lg transition-all cursor-pointer ${
                    selectedOption === option.id ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleOptionSelect(option.id)}
                >
                  <RadioGroupItem
                    value={option.id}
                    id={option.id}
                    checked={selectedOption === option.id}
                    className="ml-3"
                  />
                  <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0 || isSubmitting}
            >
              السابق
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!selectedOption || isSubmitting}
            >
              {currentQuestionIndex < personalityQuestions.length - 1 ? "التالي" : "إرسال وتحليل"}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </AppLayout>
  );
};

export default Tests;
