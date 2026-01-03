import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import AppSidebar from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Check, Star, Zap, Crown, MessageCircle, Gift, ExternalLink, BadgeCheck, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for casual players",
    icon: Star,
    featured: false,
    features: [
      "Real-time event tracking",
      "All 13+ regions access",
      "Event details & banners",
      "Mobile-friendly design",
      "Community support",
    ],
  },
  {
    name: "Pro",
    price: "$1.99",
    period: "per month",
    description: "For dedicated players",
    icon: Zap,
    featured: true,
    features: [
      "Everything in Free",
      "Push notifications",
      "Event countdown timers",
      "Early event previews",
      "Ad-free experience",
      "Priority support",
    ],
  },
  {
    name: "Ultimate",
    price: "$4.99",
    period: "per month",
    description: "For content creators",
    icon: Crown,
    featured: false,
    features: [
      "Everything in Pro",
      "API access",
      "Custom event webhooks",
      "Analytics dashboard",
      "White-label embeds",
      "Dedicated support",
    ],
  },
];

const Pricing = () => {
  const { isPremium } = useAuth();
  const navigate = useNavigate();

  const handleContactPayment = () => {
    window.open("https://t.me/samirrahman96", "_blank");
  };

  const handleRedeemPromo = () => {
    navigate("/account");
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex">
        <AppSidebar />
        
        <main className="flex-1 lg:ml-64">
          <div className="container py-12 px-6 max-w-5xl">
            {/* Hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl font-bold text-foreground mb-4 tracking-tight">
                Simple <span className="text-primary">Pricing</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Choose the plan that fits your needs. Start free and upgrade anytime.
              </p>
            </motion.div>

            {/* Premium Status Badge */}
            {isPremium && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/50 flex items-center justify-center gap-3"
              >
                <BadgeCheck className="w-6 h-6 text-primary" />
                <span className="text-lg font-semibold text-foreground">Pro Subscription Active</span>
                <Crown className="w-5 h-5 text-primary" />
              </motion.div>
            )}

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {plans.map((plan, index) => {
                const isCurrentPlan = isPremium && plan.name === "Pro";
                return (
                  <motion.div
                    key={plan.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={cn(
                      "relative rounded-2xl border p-6 flex flex-col",
                      plan.featured
                        ? "bg-gradient-to-b from-primary/10 to-card border-primary/50 card-glow-hover"
                        : "bg-card border-border/50 card-glow",
                      isCurrentPlan && "ring-2 ring-primary"
                    )}
                  >
                    {plan.featured && !isCurrentPlan && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                        Most Popular
                      </div>
                    )}
                    {isCurrentPlan && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                        <BadgeCheck className="w-3 h-3" />
                        Active
                      </div>
                    )}

                    <div className="mb-6">
                      <div className={cn(
                        "p-2.5 rounded-xl w-fit mb-4",
                        plan.featured ? "bg-primary/20" : "bg-secondary"
                      )}>
                        <plan.icon className={cn(
                          "w-5 h-5",
                          plan.featured ? "text-primary" : "text-muted-foreground"
                        )} />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                    </div>

                    <div className="mb-6">
                      <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-muted-foreground ml-1">/{plan.period}</span>
                    </div>

                    <ul className="space-y-3 flex-1 mb-6">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                          <div className={cn(
                            "p-0.5 rounded-full mt-0.5",
                            plan.featured ? "bg-primary/20" : "bg-secondary"
                          )}>
                            <Check className={cn(
                              "w-3 h-3",
                              plan.featured ? "text-primary" : "text-muted-foreground"
                            )} />
                          </div>
                          <span className="text-sm text-foreground/80">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={cn(
                        "w-full rounded-xl",
                        isCurrentPlan
                          ? "bg-green-500/20 text-green-500 border border-green-500/50 hover:bg-green-500/30"
                          : plan.featured
                            ? "bg-primary hover:bg-primary/90"
                            : "bg-secondary hover:bg-secondary/80 text-foreground"
                      )}
                      onClick={plan.price === "$0" || isCurrentPlan ? undefined : handleContactPayment}
                      disabled={isCurrentPlan}
                    >
                      {isCurrentPlan ? "Current Plan" : plan.price === "$0" ? "Get Started" : "Upgrade Now"}
                    </Button>
                  </motion.div>
                );
              })}
            </div>

            {/* Promo Code & Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="grid md:grid-cols-2 gap-6 mb-8"
            >
              {/* Promo Code */}
              <div className="bg-card rounded-2xl border border-border/50 p-6 card-glow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <Gift className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">Have a Promo Code?</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Redeem your promo code to unlock Premium features instantly!
                </p>
                <Button 
                  onClick={handleRedeemPromo} 
                  className="w-full rounded-xl h-11 gap-2"
                >
                  <Gift className="w-4 h-4" />
                  Redeem Promo Code
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Contact for Payment */}
              <div className="bg-card rounded-2xl border border-border/50 p-6 card-glow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <MessageCircle className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">Payment Contact</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  For payment and subscription inquiries, contact us on Telegram.
                </p>
                <Button
                  onClick={handleContactPayment}
                  className="w-full rounded-xl h-11 gap-2"
                  variant="secondary"
                >
                  <ExternalLink className="w-4 h-4" />
                  Contact on Telegram
                </Button>
              </div>
            </motion.div>

            {/* FAQ */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-card rounded-2xl border border-border/50 p-8 card-glow"
            >
              <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
                Frequently Asked Questions
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-foreground mb-2">Can I cancel anytime?</h3>
                  <p className="text-sm text-muted-foreground">Yes, you can cancel your subscription at any time. No questions asked.</p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">Is there a refund policy?</h3>
                  <p className="text-sm text-muted-foreground">We offer a 7-day money-back guarantee on all paid plans.</p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">What payment methods do you accept?</h3>
                  <p className="text-sm text-muted-foreground">Contact us on Telegram for payment via Binance cryptocurrency.</p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">Do you offer dataminer discounts?</h3>
                  <p className="text-sm text-muted-foreground">Yes! Dataminers get 50% off on Pro and Ultimate plans.</p>
                </div>
              </div>
            </motion.div>

            {/* Footer */}
            <footer className="py-4 border-t border-border/50 mt-8">
              <p className="text-xs text-muted-foreground text-center">
                © {new Date().getFullYear()} <span className="text-primary font-medium">LEAKS OF FF</span>. All rights reserved.
              </p>
            </footer>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default Pricing;