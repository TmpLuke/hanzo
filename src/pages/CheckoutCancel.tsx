import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function CheckoutCancel() {
  return (
    <MainLayout>
      <div className="min-h-screen pt-16 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-amber-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Payment Cancelled
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Your payment was cancelled. No charges were made to your account.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button variant="outline" size="lg">
                  Continue Shopping
                </Button>
              </Link>
              <Link to="/">
                <Button size="lg">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
