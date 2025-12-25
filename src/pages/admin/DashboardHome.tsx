import { useState, useEffect } from "react";
import { 
  DollarSign, CheckCircle, Clock, XCircle, TrendingUp, TrendingDown,
  ArrowUpRight, Shield, AlertTriangle, Wrench, XOctagon
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type ProductStatus = "undetected" | "testing" | "updating" | "down";

interface Product {
  id: string;
  name: string;
  status: ProductStatus;
  price: number;
}

const stats = [
  { 
    label: "Total Revenue", 
    value: "$0.00", 
    change: "0%", 
    trend: "up",
    icon: DollarSign,
    gradient: "from-emerald-500 to-emerald-600",
    glow: "shadow-emerald-500/30",
    key: "revenue"
  },
  { 
    label: "Total Products", 
    value: "0", 
    change: "0%", 
    trend: "up",
    icon: CheckCircle,
    gradient: "from-blue-500 to-blue-600",
    glow: "shadow-blue-500/30",
    key: "products"
  },
  { 
    label: "Active Products", 
    value: "0", 
    change: "0%", 
    trend: "up",
    icon: Clock,
    gradient: "from-amber-500 to-amber-600",
    glow: "shadow-amber-500/30",
    key: "active"
  },
  { 
    label: "Product Variants", 
    value: "0", 
    change: "0%", 
    trend: "up",
    icon: XCircle,
    gradient: "from-red-500 to-red-600",
    glow: "shadow-red-500/30",
    key: "variants"
  },
];

const recentOrders: any[] = [];

const statusConfig = {
  undetected: { label: "Undetected", icon: Shield, color: "text-emerald-400", bg: "bg-emerald-500" },
  testing: { label: "Testing", icon: AlertTriangle, color: "text-blue-400", bg: "bg-blue-500" },
  updating: { label: "Updating", icon: Wrench, color: "text-amber-400", bg: "bg-amber-500" },
  down: { label: "Down", icon: XOctagon, color: "text-red-400", bg: "bg-red-500" },
};

export default function DashboardHome() {
  const [productStatus, setProductStatus] = useState<{ label: string; count: number; color: string }[]>([]);
  const [topProducts, setTopProducts] = useState<{ name: string; status: string; price: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState(0);
  const [rangeDays, setRangeDays] = useState<7 | 30 | 90 | 0>(7); // 0 = all
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [series, setSeries] = useState<{ date: string; total: number }[]>([]);
  const [conversionCompleted, setConversionCompleted] = useState(0);
  const [conversionTotal, setConversionTotal] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [seriesOrders, setSeriesOrders] = useState<{ date: string; count: number }[]>([]);
  const [seriesAOV, setSeriesAOV] = useState<{ date: string; aov: number }[]>([]);
  const [seriesForecast, setSeriesForecast] = useState<{ date: string; total: number }[]>([]);
  const [showRev, setShowRev] = useState(true);
  const [showOrders, setShowOrders] = useState(true);
  const [showAOV, setShowAOV] = useState(false);
  const [showForecast, setShowForecast] = useState(true);
  const [breakdown, setBreakdown] = useState<{ name: string; amount: number; percent: number }[]>([]);
  const exportChart = () => {
    const svg = document.querySelector("#revenue-chart") as SVGSVGElement | null;
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = "#0b0b0b";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const a = document.createElement("a");
      a.download = `revenue-${Date.now()}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString);
  };
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalVariants, setTotalVariants] = useState(0);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchProductStats();
    fetchRevenue();
    fetchRecentOrders();
  }, [rangeDays, startDate, endDate]);

  const fetchRevenue = async () => {
    const fromTo = (() => {
      if (startDate && endDate) return { from: new Date(startDate), to: new Date(endDate) };
      if (rangeDays && rangeDays > 0) {
        const to = new Date();
        const from = new Date();
        from.setDate(from.getDate() - rangeDays);
        return { from, to };
      }
      return undefined;
    })();
    let baseQuery = supabase.from("orders" as any).select("amount, status, created_at, product_name");
    if (fromTo) baseQuery = baseQuery.gte("created_at", fromTo.from.toISOString()).lte("created_at", fromTo.to.toISOString());
    const { data, error } = await baseQuery;
    
    if (!error && data) {
      const total = data.filter((o: any) => o.status === "completed").reduce((sum: number, order: any) => sum + Number(order.amount), 0);
      setRevenue(total);
      setConversionCompleted(data.filter((o: any) => o.status === "completed").length);
      setConversionTotal(data.length);
      const buckets: Record<string, number> = {};
      const orderBuckets: Record<string, number> = {};
      const start = fromTo ? new Date(new Date(fromTo.from).setHours(0,0,0,0)) : new Date(new Date().setDate(new Date().getDate() - (rangeDays || 7)));
      const end = fromTo ? new Date(new Date(fromTo.to).setHours(0,0,0,0)) : new Date();
      const dayMs = 24 * 60 * 60 * 1000;
      for (let ts = start.getTime(); ts <= end.getTime(); ts += dayMs) {
        const k = new Date(ts).toISOString().slice(0,10);
        buckets[k] = 0;
        orderBuckets[k] = 0;
      }
      data.forEach((o: any) => {
        const d = new Date(o.created_at);
        const key = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().slice(0, 10);
        if (o.status === "completed") {
          const v = Number(o.amount);
          if (key in buckets) buckets[key] += v;
          if (key in orderBuckets) orderBuckets[key] += 1;
        }
      });
      const keys = Object.keys(buckets).sort();
      let s = keys.map(k => ({ date: k, total: buckets[k] }));
      if (s.length < 2) {
        const k0 = keys[0] || new Date().toISOString().slice(0,10);
        s = [{ date: k0, total: total }, { date: k0, total: total }];
      }
      setSeries(s);
      const so = keys.map(k => ({ date: k, count: orderBuckets[k] }));
      setSeriesOrders(so);
      const sa = keys.map(k => ({ date: k, aov: orderBuckets[k] > 0 ? buckets[k] / orderBuckets[k] : 0 }));
      setSeriesAOV(sa);
      const xs = s.map((p, i) => i);
      const ys = s.map(p => p.total);
      let b = 0, a = 0;
      if (xs.length > 1) {
        const n = xs.length;
        const sumX = xs.reduce((acc, v) => acc + v, 0);
        const sumY = ys.reduce((acc, v) => acc + v, 0);
        const sumXY = xs.reduce((acc, v, i) => acc + v * ys[i], 0);
        const sumXX = xs.reduce((acc, v) => acc + v * v, 0);
        b = ((n * sumXY) - (sumX * sumY)) / Math.max(1, ((n * sumXX) - (sumX * sumX)));
        a = (sumY - b * sumX) / n;
      }
      const forecastDays = 7;
      const lastIndex = xs.length - 1;
      const forecast = [];
      for (let i = 1; i <= forecastDays; i++) {
        const idx = lastIndex + i;
        const pred = Math.max(0, a + b * idx);
        const d = new Date(keys[keys.length - 1] || new Date().toISOString().slice(0,10));
        d.setDate(d.getDate() + i);
        forecast.push({ date: d.toISOString().slice(0,10), total: pred });
      }
      setSeriesForecast(forecast);

      const byProduct: Record<string, number> = {};
      data.forEach((o: any) => {
        if (o.status === "completed") {
          const n = o.product_name || "Unknown";
          byProduct[n] = (byProduct[n] || 0) + Number(o.amount || 0);
        }
      });
      const totalAmt = Object.values(byProduct).reduce((a, b) => a + b, 0);
      const br = Object.entries(byProduct)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, amount]) => ({
          name,
          amount,
          percent: totalAmt > 0 ? (amount / totalAmt) * 100 : 0
        }));
      setBreakdown(br);
    }
  };

  const fetchRecentOrders = async () => {
    const { data, error } = await supabase
      .from("orders" as any)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);
    
    if (!error && data) {
      setRecentOrders(data.map((order: any) => ({
        id: order.order_number,
        customer: order.customer_name || order.customer_email,
        product: `${order.product_name} - ${order.variant_label}`,
        amount: `$${Number(order.amount).toFixed(2)}`,
        status: order.status,
        date: new Date(order.created_at).toLocaleDateString(),
      })));
    }
  };

  const fetchProductStats = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*");
    
    if (!error && data) {
      setTotalProducts(data.length);

      // Calculate status counts
      const statusCounts = {
        undetected: 0,
        testing: 0,
        updating: 0,
        down: 0,
      };
      
      data.forEach((product: Product) => {
        if (product.status in statusCounts) {
          statusCounts[product.status]++;
        }
      });

      setProductStatus([
        { label: "Undetected", count: statusCounts.undetected, color: "bg-emerald-500" },
        { label: "Updating", count: statusCounts.updating, color: "bg-amber-500" },
        { label: "Testing", count: statusCounts.testing, color: "bg-blue-500" },
        { label: "Down", count: statusCounts.down, color: "bg-red-500" },
      ]);

      // Get top products
      const top = data.slice(0, 4).map((p: Product) => ({
        name: p.name,
        status: p.status,
        price: `$${Number(p.price).toFixed(2)}`,
      }));
      setTopProducts(top);
    }

    // Fetch variants count
    const { data: variantsData } = await supabase
      .from("product_variants" as any)
      .select("id");
    
    if (variantsData) {
      setTotalVariants(variantsData.length);
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="sm:col-span-2 lg:col-span-4 flex items-center gap-2 flex-wrap">
          <button className={`px-3 py-1 rounded ${rangeDays===7?'bg-primary text-black':'bg-muted'}`} onClick={() => setRangeDays(7)}>7 days</button>
          <button className={`px-3 py-1 rounded ${rangeDays===30?'bg-primary text-black':'bg-muted'}`} onClick={() => setRangeDays(30)}>30 days</button>
          <button className={`px-3 py-1 rounded ${rangeDays===90?'bg-primary text-black':'bg-muted'}`} onClick={() => setRangeDays(90)}>90 days</button>
          <button className={`px-3 py-1 rounded ${rangeDays===0?'bg-primary text.black':'bg-muted'}`} onClick={() => setRangeDays(0)}>All</button>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="px-2 py-1 rounded bg-muted" />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="px-2 py-1 rounded bg-muted" />
          <button className="px-3 py-1 rounded bg-primary text-black" onClick={() => setRangeDays(0)}>Apply</button>
        </div>
        {stats.map((stat, index) => {
          let displayValue = stat.value;
          if (stat.key === "revenue") displayValue = `$${revenue.toFixed(2)}`;
          if (stat.key === "products") displayValue = totalProducts.toString();
          if (stat.key === "active") displayValue = productStatus.find(s => s.label === "Undetected")?.count.toString() || "0";
          if (stat.key === "variants") displayValue = totalVariants.toString();

          return (
            <div 
              key={stat.label} 
              className="group relative overflow-hidden rounded-2xl bg-[#111111] border border-white/5 p-5 hover:border-primary/30 transition-all duration-500 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{displayValue}</p>
                </div>
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg ${stat.glow} transition-transform duration-300 group-hover:scale-110`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <div className={`relative z-10 flex items-center gap-1 mt-3 text-sm ${stat.trend === "up" ? "text-emerald-400" : "text-red-400"}`}>
                {stat.trend === "up" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="font-medium">{stat.change}</span>
                <span className="text-muted-foreground">vs last month</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-[#111111] border border-white/5 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-white/5">
            <div>
              <h2 className="font-semibold">Revenue Overview</h2>
              <p className="text-sm text-muted-foreground">Performance</p>
            </div>
            <button onClick={exportChart} className="px-3 py-1 rounded bg-primary/10 text-primary border border-primary/20 text-sm">
              Export PNG
            </button>
          </div>
          <div className="p-5 relative">
            {series.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">No data</div>
            ) : (
              <svg id="revenue-chart" viewBox="0 0 640 240" className="w-full h-56"
                   onMouseMove={(e) => {
                     const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
                     const x = e.clientX - rect.left;
                     const totalPoints = series.length + (showForecast ? seriesForecast.length : 0);
                     const idx = Math.max(0, Math.min(series.length - 1, Math.round((x / rect.width) * Math.max(1,totalPoints - 1))));
                     const max = Math.max(...series.map(s => s.total), 1);
                     const minY = 210;
                     const height = 180;
                     const stepX = 640 / Math.max(1, totalPoints - 1);
                     const px = idx * stepX;
                     const py = minY - (series[idx].total / max) * height;
                     setHoverIndex(idx);
                     setTooltipPos({ x: px, y: py });
                   }}
                   onMouseLeave={() => setHoverIndex(null)}
              >
                {(() => {
                  const max = Math.max(...series.map(s => s.total), 1);
                  const maxOrders = Math.max(...seriesOrders.map(s => s.count), 1);
                  const maxAOV = Math.max(...seriesAOV.map(s => s.aov), 1);
                  const minY = 210;
                  const height = 180;
                  const totalPoints = series.length + (showForecast ? seriesForecast.length : 0);
                  const stepX = 640 / Math.max(1, totalPoints - 1);
                  const ptsRev = series.map((s, i) => {
                    const x = i * stepX;
                    const y = minY - (s.total / max) * height;
                    return { x, y };
                  });
                  const pathRev = ptsRev.reduce((acc, p, i) => acc + (i === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`), "");
                  const ptsOrders = seriesOrders.map((s, i) => {
                    const x = i * stepX;
                    const y = minY - (s.count / maxOrders) * height;
                    return { x, y };
                  });
                  const pathOrders = ptsOrders.reduce((acc, p, i) => acc + (i === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`), "");
                  const ptsAOV = seriesAOV.map((s, i) => {
                    const x = i * stepX;
                    const y = minY - (s.aov / maxAOV) * height;
                    return { x, y };
                  });
                  const pathAOV = ptsAOV.reduce((acc, p, i) => acc + (i === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`), "");
                  const ptsForecast = (showForecast ? seriesForecast : []).map((s, i) => {
                    const x = (series.length - 1 + i + 1) * stepX;
                    const y = minY - (s.total / max) * height;
                    return { x, y };
                  });
                  const pathForecast = ptsForecast.reduce((acc, p, i) => acc + (i === 0 ? `M ${ptsRev[ptsRev.length-1]?.x ?? 0} ${ptsRev[ptsRev.length-1]?.y ?? minY} L ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`), "");
                  // grid lines
                  const grid = [0, 0.25, 0.5, 0.75, 1].map((g, idx) => (
                    <line key={idx} x1="40" x2="620" y1={minY - g * height} y2={minY - g * height} stroke="rgba(255,255,255,0.06)" />
                  ));
                  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((g, idx) => {
                    const v = Math.round((max * g) * 100) / 100;
                    const y = minY - g * height;
                    return <text key={idx} x="6" y={y + 4} fill="rgba(255,255,255,0.5)" fontSize="10">${v}</text>;
                  });
                  const xLabels = series.map((s, i) => {
                    if (i % Math.ceil(series.length / 6) !== 0) return null;
                    const x = i * stepX;
                    return <text key={s.date} x={x + 40} y={minY + 16} fill="rgba(255,255,255,0.5)" fontSize="10">{s.date.slice(5)}</text>;
                  });
                  return (
                    <>
                      <rect x="40" y="30" width="580" height="180" fill="transparent" />
                      {grid}
                      {yTicks}
                      {xLabels}
                      {showRev && (
                        <>
                          <path d={pathRev} fill="none" stroke="rgb(16,185,129)" strokeWidth="2" transform="translate(40,0)" />
                          {ptsRev.map((p, i) => (
                            <circle key={`rev-${i}`} cx={p.x + 40} cy={p.y} r="3" fill="rgb(16,185,129)" />
                          ))}
                        </>
                      )}
                      {showOrders && (
                        <>
                          <path d={pathOrders} fill="none" stroke="rgb(59,130,246)" strokeWidth="2" transform="translate(40,0)" />
                          {ptsOrders.map((p, i) => (
                            <circle key={`ord-${i}`} cx={p.x + 40} cy={p.y} r="2.5" fill="rgb(59,130,246)" />
                          ))}
                        </>
                      )}
                      {showAOV && (
                        <>
                          <path d={pathAOV} fill="none" stroke="rgb(245,158,11)" strokeWidth="2" transform="translate(40,0)" />
                          {ptsAOV.map((p, i) => (
                            <circle key={`aov-${i}`} cx={p.x + 40} cy={p.y} r="2.5" fill="rgb(245,158,11)" />
                          ))}
                        </>
                      )}
                      {showForecast && ptsForecast.length > 0 && (
                        <>
                          <path d={pathForecast} fill="none" stroke="rgb(16,185,129)" strokeWidth="2" strokeDasharray="5 5" transform="translate(40,0)" />
                          {ptsForecast.map((p, i) => (
                            <circle key={`fc-${i}`} cx={p.x + 40} cy={p.y} r="2.5" fill="rgb(16,185,129)" />
                          ))}
                        </>
                      )}
                      {hoverIndex !== null && (
                        <>
                          <line x1={tooltipPos.x + 40} x2={tooltipPos.x + 40} y1="30" y2="210" stroke="rgba(255,255,255,0.08)" />
                          <circle cx={tooltipPos.x + 40} cy={tooltipPos.y} r="4" fill="rgb(16,185,129)" />
                        </>
                      )}
                    </>
                  );
                })()}
              </svg>
            )}
            {hoverIndex !== null && series[hoverIndex] && (
              <div
                className="absolute pointer-events-none"
                style={{
                  left: `${((tooltipPos.x + 40) / 640) * 100}%`,
                  top: `${(tooltipPos.y / 240) * 100}%`,
                  transform: "translate(-50%, -120%)",
                }}
              >
                <div className="rounded-lg bg-[#0f0f0f] border border-white/10 px-2 py-1 text-xs">
                  <div className="font-semibold">${series[hoverIndex].total.toFixed(2)}</div>
                  {seriesOrders[hoverIndex] && <div className="text-blue-400">Orders {seriesOrders[hoverIndex].count}</div>}
                  {seriesAOV[hoverIndex] && <div className="text-amber-400">AOV ${seriesAOV[hoverIndex].aov.toFixed(2)}</div>}
                  <div className="text-muted-foreground">{series[hoverIndex].date}</div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="rounded-2xl bg-[#111111] border border-white/5 overflow-hidden">
          <div className="p-5 border-b border-white/5">
            <h2 className="font-semibold">Conversion Rate</h2>
            <p className="text-sm text-muted-foreground">Order completion rate</p>
          </div>
          <div className="p-5 flex flex-col items-center gap-4">
            {(() => {
              const rate = conversionTotal ? Math.round((conversionCompleted / conversionTotal) * 1000) / 10 : 0;
              return (
                <>
                  <svg viewBox="0 0 120 120" className="w-32 h-32">
                    <circle cx="60" cy="60" r="50" stroke="rgba(255,255,255,0.1)" strokeWidth="16" fill="none" />
                    {(() => {
                      const circumference = 2 * Math.PI * 50;
                      const dash = (rate / 100) * circumference;
                      const offset = circumference - dash;
                      return (
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          stroke="rgb(16,185,129)"
                          strokeWidth="16"
                          fill="none"
                          strokeDasharray={`${dash} ${offset}`}
                          strokeLinecap="round"
                          transform="rotate(-90 60 60)"
                        />
                      );
                    })()}
                  </svg>
                  <div className="text-2xl font-bold">{rate}%</div>
                  <div className="text-sm text-muted-foreground">Completed {conversionCompleted} of {conversionTotal}</div>
                </>
              );
            })()}
          </div>
        </div>
        {/* Recent Orders */}
        <div className="lg:col-span-2 rounded-2xl bg-[#111111] border border-white/5 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-white/5">
            <div>
              <h2 className="font-semibold">Recent Orders</h2>
              <p className="text-sm text-muted-foreground">Latest transactions from your store</p>
            </div>
            <Link to="/admin/orders">
              <Button variant="ghost" size="sm" className="gap-1 hover:bg-primary/10 hover:text-primary transition-colors">
                View All <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b border-white/5 bg-white/[0.02]">
                  <th className="px-5 py-3 font-medium">Order ID</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Product</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <CheckCircle className="w-12 h-12 text-muted-foreground/30" />
                        <p>No orders yet</p>
                        <p className="text-sm">Orders will appear here when customers make purchases</p>
                      </div>
                    </td>
                  </tr>
                ) : recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 font-mono text-sm font-medium text-primary">{order.id}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{order.customer}</td>
                    <td className="px-5 py-4 text-sm">{order.product}</td>
                    <td className="px-5 py-4 text-sm font-semibold">{order.amount}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        order.status === "completed" 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                          : order.status === "pending" 
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          order.status === "completed" ? "bg-emerald-400" : order.status === "pending" ? "bg-amber-400" : "bg-red-400"
                        } animate-pulse`} />
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Revenue Breakdown */}
          <div className="rounded-2xl bg-[#111111] border border-white/5 p-5">
            <h2 className="font-semibold mb-4">Revenue Breakdown</h2>
            {breakdown.length === 0 ? (
              <div className="text-sm text-muted-foreground">No completed orders in range</div>
            ) : (
              <div className="space-y-3">
                {breakdown.map((item, idx) => {
                  const colors = ["rgb(16,185,129)", "rgb(59,130,246)", "rgb(245,158,11)", "rgb(99,102,241)", "rgb(236,72,153)"];
                  const col = colors[idx % colors.length];
                  return (
                    <div key={item.name}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="truncate max-w-[60%]">{item.name}</span>
                        <span className="text-muted-foreground">${item.amount.toFixed(2)} • {Math.round(item.percent)}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${Math.min(100, item.percent)}%`, backgroundColor: col }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {/* Product Status */}
          <div className="rounded-2xl bg-[#111111] border border-white/5 p-5">
            <h2 className="font-semibold mb-4">Product Status</h2>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-muted/50" />
                      <div className="h-4 w-20 bg-muted/50 rounded" />
                    </div>
                    <div className="h-4 w-8 bg-muted/50 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {productStatus.map((item) => (
                  <div key={item.label} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item.color} shadow-lg transition-transform duration-300 group-hover:scale-125`} 
                        style={{ boxShadow: `0 0 10px ${item.color === 'bg-emerald-500' ? '#10b981' : item.color === 'bg-amber-500' ? '#f59e0b' : item.color === 'bg-blue-500' ? '#3b82f6' : '#ef4444'}40` }}
                      />
                      <span className="text-sm">{item.label}</span>
                    </div>
                    <span className="text-sm font-semibold">{item.count}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-5 pt-4 border-t border-white/5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Products</span>
                <span className="font-bold text-primary">{productStatus.reduce((a, b) => a + b.count, 0)}</span>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="rounded-2xl bg-[#111111] border border-white/5 p-5">
            <h2 className="font-semibold mb-4">Top Products</h2>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-8 h-8 rounded-lg bg-muted/50" />
                    <div className="flex-1">
                      <div className="h-4 w-32 bg-muted/50 rounded mb-1" />
                      <div className="h-3 w-16 bg-muted/30 rounded" />
                    </div>
                    <div className="h-4 w-12 bg-muted/50 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {topProducts.map((product, i) => {
                  const status = product.status as ProductStatus;
                  const config = statusConfig[status] || statusConfig.undetected;
                  const Icon = config.icon;
                  return (
                    <div key={product.name} className="group flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-sm font-bold text-primary transition-transform duration-300 group-hover:scale-110">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{product.name}</p>
                        <div className="flex items-center gap-1.5">
                          <Icon className={`w-3 h-3 ${config.color}`} />
                          <p className={`text-xs ${config.color}`}>{config.label}</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-primary">{product.price}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
