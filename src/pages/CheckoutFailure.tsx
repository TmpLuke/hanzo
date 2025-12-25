import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function CheckoutFailure() {
  return (
    <MainLayout>
      <div className="min-h-screen pt-16 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Payment Failed
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              We couldn't process your payment. Please try again or contact support if the problem persists.
            </p>

            <div className="rounded-2xl bg-card border border-border p-6 mb-8 text-left">
              <h3 className="font-semibold mb-3">Common reasons for payment failure:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Insufficient funds</li>
                <li>• Incorrect card details</li>
                <li>• Card expired or blocked</li>
                <li>• Bank declined the transaction</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button size="lg">
                  Try Again
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" size="lg">
                  Back to Home
                </Button>
              </Link>
            </div>

            <div className="mt-8 text-sm text-muted-foreground">
              <p>Need help? Contact us at petyaiscute@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
