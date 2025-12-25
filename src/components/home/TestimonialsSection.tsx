import { IconStar } from "@/components/icons/HanzoIcons";

const testimonials = [
  {
    id: 1,
    name: "Alex Rivers",
    role: "Twitch Partner",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    content: "Hanzo's overlays completely transformed my stream. The quality is insane and the setup was incredibly easy. My viewers immediately noticed the upgrade!",
    rating: 5,
  },
  {
    id: 2,
    name: "Maya Chen",
    role: "YouTube Creator",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    content: "The bundle deal saved me hundreds of dollars. Everything works perfectly together and the support team is super responsive. Highly recommend!",
    rating: 5,
  },
  {
    id: 3,
    name: "Jake Martinez",
    role: "Esports Streamer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    content: "I've tried many overlay providers, but Hanzo stands out. The animations are smooth, the designs are unique, and updates are constant. Best investment for my channel.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Loved by Creators
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied content creators who trust Hanzo
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <IconStar key={i} className="w-5 h-5 text-warning" />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground mb-6">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-primary">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
