
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Brain, BarChart, Share2 } from "lucide-react";

const features = [
  {
    icon: <Brain className="w-8 h-8 text-primary" />,
    title: "تحليل علمي دقيق",
    description: "مدعوم بنماذج الذكاء الاصطناعي المتقدمة لتحليل شامل للشخصية"
  },
  {
    icon: <BarChart className="w-8 h-8 text-primary" />,
    title: "مقاييس مفصلة",
    description: "اكتشف سماتك الشخصية بناءً على نموذج العوامل الخمسة الكبرى للشخصية"
  },
  {
    icon: <Share2 className="w-8 h-8 text-primary" />,
    title: "مشاركة النتائج",
    description: "إمكانية حفظ ومشاركة تقرير شخصيتك مع من تريد"
  }
];

const Index = () => {
  const navigate = useNavigate();

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

  return (
    <AppLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-12 py-6"
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-4">تحليل الشخصية بالذكاء الاصطناعي</h1>
          <p className="text-xl text-muted-foreground mb-8">
            اكتشف أعماق شخصيتك من خلال اختبار مدعوم بأحدث نماذج الذكاء الاصطناعي
          </p>
          <Button size="lg" onClick={() => navigate("/tests")} className="text-lg px-8 h-12">
            ابدأ الاختبار الآن
          </Button>
        </motion.div>

        {/* Features */}
        <motion.div variants={itemVariants}>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 border-primary/5 hover:border-primary/20 transition-all">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div variants={itemVariants}>
          <Card className="bg-primary/5 border-2 border-primary/10">
            <CardHeader>
              <CardTitle className="text-center text-2xl">جاهز لاكتشاف شخصيتك الحقيقية؟</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                اختبارنا يستغرق أقل من 5 دقائق ويقدم لك تحليلاً عميقاً لشخصيتك
              </p>
            </CardContent>
            <CardFooter className="justify-center pb-6">
              <Button size="lg" onClick={() => navigate("/tests")}>
                بدء الاختبار
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
};

export default Index;
