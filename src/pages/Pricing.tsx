import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import AppSidebar from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Star, Zap, Crown, MessageCircle, Gift, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

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
  const [promoCode, setPromoCode] = useState("");

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a promo code");
      return;
    }
    toast.info("Promo code will be applied at checkout");
  };

  const handleContactPayment = () => {
    window.open("https://t.me/samirrahman96", "_blank");
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

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={cn(
                    "relative rounded-2xl border p-6 flex flex-col",
                    plan.featured
                      ? "bg-gradient-to-b from-primary/10 to-card border-primary/50 card-glow-hover"
                      : "bg-card border-border/50 card-glow"
                  )}
                >
                  {plan.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                      Most Popular
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
                      plan.featured
                        ? "bg-primary hover:bg-primary/90"
                        : "bg-secondary hover:bg-secondary/80 text-foreground"
                    )}
                    onClick={plan.price === "$0" ? undefined : handleContactPayment}
                  >
                    {plan.price === "$0" ? "Get Started" : "Upgrade Now"}
                  </Button>
                </motion.div>
              ))}
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
                <div className="flex gap-3">
                  <Input
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 h-11 rounded-xl bg-secondary/50 border-border/50"
                  />
                  <Button onClick={handleApplyPromo} className="rounded-xl h-11 px-5">
                    Apply
                  </Button>
                </div>
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
                  <p className="text-sm text-muted-foreground">Contact us on Telegram for payment options including UPI, PayPal, and more.</p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">Do you offer student discounts?</h3>
                  <p className="text-sm text-muted-foreground">Yes! Students get 50% off on Pro and Ultimate plans.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default Pricing;