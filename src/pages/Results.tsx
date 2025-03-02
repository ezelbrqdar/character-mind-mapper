
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import AppLayout from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import { AIAnalysisResponse } from "@/services/AIService";

const Results = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<AIAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const analysisData = localStorage.getItem("personalityAnalysis");
    
    if (analysisData) {
      try {
        const parsedData = JSON.parse(analysisData);
        setResults(parsedData);
      } catch (error) {
        console.error("خطأ في قراءة نتائج التحليل:", error);
      }
    }
    
    setLoading(false);
  }, []);

  const handleStartOver = () => {
    navigate("/tests");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-[70vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    );
  }

  if (!results) {
    return (
      <AppLayout>
        <Card className="max-w-2xl mx-auto shadow-lg text-center">
          <CardHeader>
            <CardTitle className="text-2xl">لم يتم العثور على نتائج</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6">لم تكمل الاختبار بعد أو حدث خطأ في تحليل النتائج.</p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button onClick={() => navigate("/tests")}>بدء الاختبار</Button>
          </CardFooter>
        </Card>
      </AppLayout>
    );
  }

  const traitLabels = {
    openness: "الانفتاح",
    conscientiousness: "الضمير",
    extraversion: "الانبساط",
    agreeableness: "القبول",
    neuroticism: "العصابية"
  };

  return (
    <AppLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto space-y-6"
      >
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg overflow-hidden">
            <CardHeader className="bg-primary/10">
              <CardTitle className="text-2xl text-center">نتائج تحليل الشخصية</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 text-right">
              <div className="prose prose-lg max-w-none">
                <h3 className="text-xl font-medium mb-3">التحليل العام</h3>
                <p className="whitespace-pre-line mb-6">{results.analysis}</p>
                
                <h3 className="text-xl font-medium mb-3">السمات الشخصية</h3>
                <div className="space-y-4">
                  {Object.entries(results.traits).map(([trait, value]) => (
                    <div key={trait} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">
                          {value}%
                        </span>
                        <span className="font-medium">
                          {traitLabels[trait as keyof typeof traitLabels] || trait}
                        </span>
                      </div>
                      <Progress value={value} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-center pt-4 pb-6">
              <Button onClick={handleStartOver}>إعادة الاختبار</Button>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
};

export default Results;
