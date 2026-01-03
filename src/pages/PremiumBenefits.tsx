import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import AppSidebar from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Crown, Shield, Sparkles, Zap, MessageCircle, Link2, 
  Edit2, BadgeCheck, Star, Rocket, Gift, Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import VerifiedBadge from "@/components/VerifiedBadge";

const benefits = [
  {
    icon: BadgeCheck,
    title: "Verified Badge",
    description: "Stand out with a verified badge next to your username everywhere",
    gradient: "from-primary to-blue-400",
  },
  {
    icon: Edit2,
    title: "Unlimited Username Changes",
    description: "Change your username anytime without waiting 7 days",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Link2,
    title: "Copy Event Links",
    description: "Instantly copy and share event banner links with friends",
    gradient: "from-green-500 to-emerald-400",
  },
  {
    icon: MessageCircle,
    title: "Priority Chat",
    description: "Get priority message delivery and enhanced chat features",
    gradient: "from-orange-500 to-amber-400",
  },
  {
    icon: Shield,
    title: "Priority Support",
    description: "Get faster responses from our dedicated support team",
    gradient: "from-cyan-500 to-teal-400",
  },
  {
    icon: Rocket,
    title: "Early Access",
    description: "Be the first to try new features before everyone else",
    gradient: "from-rose-500 to-red-400",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const PremiumBenefits = () => {
  const navigate = useNavigate();
  const { isPremium } = useAuth();

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex">
        <AppSidebar />
        
        <main className="flex-1 lg:ml-64">
          <div className="container py-8 px-6 max-w-6xl">
            {/* Hero Section */}
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Premium Benefits</span>
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Unlock <span className="text-primary text-glow">Premium</span> Features
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Elevate your experience with exclusive features and priority access
              </p>
            </motion.div>

            {/* Benefits Grid */}
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {benefits.map((benefit, index) => (
                <motion.div key={benefit.title} variants={item}>
                  <Card className="group relative overflow-hidden border-border/50 bg-card hover:border-primary/50 transition-all duration-300 h-full">
                    <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                    <CardContent className="p-6 relative">
                      <motion.div 
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mb-4`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <benefit.icon className="w-7 h-7 text-white" />
                      </motion.div>
                      <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Section */}
            <motion.div
              className="relative rounded-3xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20" />
              <div className="absolute inset-0 backdrop-blur-3xl" />
              <div className="relative p-8 md:p-12 text-center">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                  className="inline-block mb-6"
                >
                  <Crown className="w-16 h-16 text-primary" />
                </motion.div>
                
                {isPremium ? (
                  <>
                    <h2 className="text-2xl md:text-3xl font-bold mb-3 flex items-center justify-center gap-2">
                      You're Premium! <VerifiedBadge size="lg" />
                    </h2>
                    <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                      Enjoy all the exclusive benefits. Thank you for being a premium member!
                    </p>
                    <Button onClick={() => navigate("/account")} variant="outline" className="gap-2">
                      <Gift className="w-4 h-4" />
                      Manage Subscription
                    </Button>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">
                      Ready to Go Premium?
                    </h2>
                    <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                      Join thousands of users who have upgraded their experience. 
                      Have a promo code? Redeem it in your account!
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <Button onClick={() => navigate("/pricing")} size="lg" className="gap-2">
                        <Star className="w-5 h-5" />
                        View Pricing
                      </Button>
                      <Button onClick={() => navigate("/account")} variant="outline" size="lg" className="gap-2">
                        <Gift className="w-5 h-5" />
                        Redeem Promo Code
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default PremiumBenefits;
