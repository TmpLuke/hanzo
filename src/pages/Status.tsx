import { MainLayout } from "@/components/layout/MainLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, AlertCircle, Clock, XCircle, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const statusConfig = {
  undetected: {
    label: "Undetected",
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
  },
  testing: {
    label: "Testing",
    icon: Clock,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
  },
  updating: {
    label: "Updating",
    icon: AlertCircle,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
  },
  down: {
    label: "Down",
    icon: XCircle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
  },
};

export default function Status() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products-status"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, status, category, updated_at")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const getOverallStatus = () => {
    if (!products) return null;
    const downCount = products.filter((p) => p.status === "down").length;
    const updatingCount = products.filter((p) => p.status === "updating").length;
    
    if (downCount > 0) return { status: "Issues Detected", color: "text-red-500" };
    if (updatingCount > 0) return { status: "Maintenance", color: "text-orange-500" };
    return { status: "All Systems Operational", color: "text-green-500" };
  };

  const overall = getOverallStatus();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Activity className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              System Status
            </h1>
            {overall && (
              <p className={`text-lg font-medium ${overall.color}`}>
                {overall.status}
              </p>
            )}
          </div>

          {/* Status Legend */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {Object.entries(statusConfig).map(([key, config]) => (
              <div key={key} className="flex items-center gap-2 text-sm">
                <config.icon className={`w-4 h-4 ${config.color}`} />
                <span className="text-muted-foreground">{config.label}</span>
              </div>
            ))}
          </div>

          {/* Products Status */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-20 rounded-xl bg-card border border-border animate-pulse"
                  />
                ))}
              </div>
            ) : (
              products?.map((product) => {
                const config = statusConfig[product.status as keyof typeof statusConfig];
                const StatusIcon = config.icon;
                
                return (
                  <div
                    key={product.id}
                    className={`p-5 rounded-xl bg-card border ${config.borderColor} flex items-center justify-between`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg ${config.bgColor} flex items-center justify-center`}>
                        <StatusIcon className={`w-5 h-5 ${config.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {product.category}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${config.bgColor} ${config.color} border-0`}
                    >
                      {config.label}
                    </Badge>
                  </div>
                );
              })
            )}
          </div>

          {/* Last Updated */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            Status updates every 5 minutes
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
