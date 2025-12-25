import { MainLayout } from "@/components/layout/MainLayout";

const paypalMethods = [
  { name: "PayPal", icon: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" },
];

const stripeMethods = [
  { name: "Stripe", icon: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" },
  { name: "Visa", icon: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" },
  { name: "Mastercard", icon: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" },
  { name: "Apple Pay", icon: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" },
  { name: "Google Pay", icon: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" },
  { name: "Klarna", icon: "https://upload.wikimedia.org/wikipedia/commons/4/40/Klarna_Payment_Badge.svg" },
  { name: "Link", icon: "https://images.ctfassets.net/fzn2n1nzq965/4HXrR43UnMEGiWnHVhgSKH/e49700bb1e5ea1e0d6c5b2ed12c62c74/link-primary-logo.svg" },
  { name: "Revolut", icon: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Revolut.svg" },
  { name: "Giropay", icon: "https://upload.wikimedia.org/wikipedia/commons/8/87/Giropay.svg" },
  { name: "iDEAL", icon: "https://upload.wikimedia.org/wikipedia/commons/e/e8/IDEAL_Logo.svg" },
  { name: "American Express", icon: "https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" },
  { name: "Discover", icon: "https://upload.wikimedia.org/wikipedia/commons/5/57/Discover_Card_logo.svg" },
  { name: "Diners Club", icon: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Diners_Club_Logo3.svg" },
  { name: "CB", icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 60'%3E%3Crect fill='%23003B7A' width='100' height='60' rx='5'/%3E%3Ctext x='50' y='35' font-family='Arial' font-size='20' font-weight='bold' fill='white' text-anchor='middle'%3ECB%3C/text%3E%3C/svg%3E" },
  { name: "BLIK", icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 60'%3E%3Crect fill='%23FFFFFF' stroke='%23E5E7EB' stroke-width='1' width='100' height='60' rx='5'/%3E%3Ctext x='50' y='38' font-family='Arial, sans-serif' font-size='18' font-weight='bold' fill='%23000000' text-anchor='middle'%3EBLIK%3C/text%3E%3C/svg%3E" },
];

const paysafecardMethods = [
  { name: "PaySafeCard", icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 150 60'%3E%3Crect fill='%2300A651' width='150' height='60' rx='5'/%3E%3Ctext x='75' y='35' font-family='Arial' font-size='14' font-weight='bold' fill='white' text-anchor='middle'%3EPaySafeCard%3C/text%3E%3C/svg%3E" },
];

interface PaymentSectionProps {
  title: string;
  description: string;
  methods: { name: string; icon: string }[];
}

function PaymentSection({ title, description, methods }: PaymentSectionProps) {
  return (
    <div className="mb-16">
      {/* Ghost title effect */}
      <div className="relative">
        <span className="absolute -top-8 left-0 text-6xl font-bold text-muted/20 select-none pointer-events-none">
          {title}
        </span>
        <h2 className="text-3xl font-bold text-primary relative z-10">{title}</h2>
      </div>
      <p className="text-muted-foreground mt-2 mb-6">{description}</p>
      
      <div className="flex flex-wrap gap-3">
        {methods.map((method) => (
          <div
            key={method.name}
            className="w-20 h-14 bg-white rounded-lg flex items-center justify-center p-2 hover:scale-105 transition-transform border border-gray-200"
          >
            <img
              src={method.icon}
              alt={method.name}
              className="max-w-full max-h-full object-contain"
              loading="eager"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `<span class="text-xs text-black font-semibold text-center px-1">${method.name}</span>`;
                }
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PaymentMethods() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <span>⌂</span>
            <span>/</span>
            <span className="text-primary">Payment-Methods</span>
          </div>

          {/* Header */}
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">
            Payment Methods
          </h1>
          <p className="text-muted-foreground mb-16">
            We charge NO FEES for all of our payment methods
          </p>

          {/* PayPal Section */}
          <PaymentSection
            title="PayPal"
            description="PayPal enables you to use the payment methods below:"
            methods={paypalMethods}
          />

          {/* Stripe Section */}
          <PaymentSection
            title="Stripe"
            description="Stripe enables you to use the payment methods below:"
            methods={stripeMethods}
          />

          {/* PaySafeCard Section */}
          <PaymentSection
            title="PaySafeCard"
            description="PaySafeCard enables you to use the payment methods below:"
            methods={paysafecardMethods}
          />
        </div>
      </div>
    </MainLayout>
  );
}
