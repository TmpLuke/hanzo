import { Star } from "lucide-react";
import { useState, useEffect } from "react";

const testimonials = [
  {
    name: "Alex M.",
    game: "Valorant",
    rating: 5,
    text: "Best cheats I've ever used. Undetected for months and the support team is amazing!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
  },
  {
    name: "Jordan K.",
    game: "Fortnite",
    rating: 5,
    text: "Instant delivery and works flawlessly. Worth every penny!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan"
  },
  {
    name: "Sam R.",
    game: "Apex Legends",
    rating: 5,
    text: "Clean interface, easy setup. Been using for 6 months with zero issues.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam"
  },
  {
    name: "Taylor P.",
    game: "Rust",
    rating: 5,
    text: "The menu is so smooth and customizable. 10/10 would recommend!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor"
  },
  {
    name: "Morgan L.",
    game: "Marvel Rivals",
    rating: 5,
    text: "Support responded in minutes. Product works exactly as advertised.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan"
  },
  {
    name: "Casey D.",
    game: "Rainbow Six",
    rating: 5,
    text: "Been using Hanzo for a year now. Never been banned, always updated.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Casey"
  }
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.max(1, testimonials.length - 2));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const visibleTestimonials = [
    testimonials[currentIndex],
    testimonials[(currentIndex + 1) % testimonials.length],
    testimonials[(currentIndex + 2) % testimonials.length]
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Trusted by <span className="text-primary">Thousands</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See what our customers have to say about their experience
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {visibleTestimonials.map((testimonial, idx) => (
            <div
              key={`${testimonial.name}-${idx}`}
              className="p-6 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:scale-105"
              style={{
                animation: 'fadeIn 0.5s ease-in-out',
                animationDelay: `${idx * 0.1}s`
              }}
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full bg-primary/10"
                />
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.game}</div>
                </div>
              </div>
              
              <div className="flex gap-1 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              
              <p className="text-muted-foreground text-sm leading-relaxed">
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
