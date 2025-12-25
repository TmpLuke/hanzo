import { Link } from "react-router-dom";
import { IconOverlay, IconTool, IconGraphics, IconBundle, IconChevronRight } from "@/components/icons/HanzoIcons";
import { categories } from "@/data/products";

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  overlays: IconOverlay,
  tools: IconTool,
  graphics: IconGraphics,
  bundles: IconBundle,
};

const categoryDescriptions: Record<string, string> = {
  overlays: "Stream overlays, alerts, and animated scenes",
  tools: "Powerful tools to enhance your streaming workflow",
  graphics: "Emotes, badges, banners, and visual assets",
  bundles: "Complete packages with everything you need",
};

export function CategoriesSection() {
  return (
    <section className="py-24 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Browse by Category
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find exactly what you need for your streaming setup
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = categoryIcons[category.id];
            return (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="group"
              >
                <div className="h-full p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    {categoryDescriptions[category.id]}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {category.count} products
                    </span>
                    <IconChevronRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
