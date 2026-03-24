import { Carousel, TestimonialCard, iTestimonial } from "@/components/ui/retro-testimonial";
import { FadeIn } from "@/components/ScrollReveal";

type TestimonialDetails = {
  [key: string]: iTestimonial & { id: string };
};

const testimonialData = {
  ids: [
    "t1",
    "t2",
    "t3",
    "t4",
    "t5",
    "t6",
  ],
  details: {
    "t1": {
      id: "t1",
      description: "Hands down the best artisan custom cakes I've ever ordered! My daughter's wedding cake was not just visually stunning but incredibly moist and bursting with fresh raspberry flavor. Everyone was asking for seconds.",
      profileImage: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?q=80&w=1200&auto=format&fit=crop",
      name: "Olivia Bennett",
      designation: "Wedding Customer",
      rating: 5,
    },
    "t2": {
      id: "t2",
      description: "I've been coming here every Sunday morning for their 72-hour fermented sourdough and croissants. You can actually taste the passion and premium ingredients in every single bite. Simply exceptional.",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop",
      name: "Marcus Thorne",
      designation: "Local Resident",
      rating: 5,
    },
    "t3": {
      id: "t3",
      description: "Ordered a decadent caramel truffle cake for our corporate anniversary. The order process was seamless, shipping was perfectly timed, and the taste left our entire office speechless. Truly a premium bakery experience.",
      profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop",
      name: "Sarah Jenkins",
      designation: "Event Coordinator",
      rating: 5,
    },
    "t4": {
      id: "t4",
      description: "Their gluten-free options are pure magic. As someone who usually compromises on taste for dietary needs, finding this bakery felt like striking gold. The lemon drizzle cake is an absolute must-try!",
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop",
      name: "Elena Rodriguez",
      designation: "Dietary Connoisseur",
      rating: 5,
    },
    "t5": {
      id: "t5",
      description: "Absolutely unbelievable precision and artistry. We picked up an assortment of seasonal tarts for a family picnic. The crusts were flawlessly buttery and flaky, pulling off a balance that only true pastry chefs can achieve.",
      profileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200&auto=format&fit=crop",
      name: "David Cho",
      designation: "Food Critic",
      rating: 5,
    },
    "t6": {
      id: "t6",
      description: "From the unboxing experience to the last crumb, this was bakery perfection. The seasonal Macarons were delicate, airy, and stuffed with the perfect ratio of ganache. I subscribe to their monthly box without hesitation.",
      profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1200&auto=format&fit=crop",
      name: "Chloe Dupont",
      designation: "Monthly Subscriber",
      rating: 5,
    },
  },
};

const cards = testimonialData.ids.map((cardId: string, index: number) => {
  const details = testimonialData.details as TestimonialDetails;
  return (
    <TestimonialCard
      key={cardId}
      testimonial={details[cardId]}
      index={index}
      backgroundImage="https://images.unsplash.com/photo-1557308536-ee471ef2c390?q=80&w=3129&auto=format&fit=crop"
    />
  );
});

const DemoOne = () => {
  return (
    <FadeIn>
      <section className="rounded-[32px] border border-[#d9c7b4]/30 bg-[color:var(--surface-card)] px-4 py-12 shadow-[0_20px_40px_rgba(59,42,30,0.08)] sm:p-12 lg:p-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center md:text-left">
            <p className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-[0.24em] text-[#b07b4a] md:justify-start">
              <span className="material-symbols-outlined text-[14px]">favorite</span>
              Customer Love
            </p>
            <h2 className="font-display mt-2 text-3xl font-extrabold leading-tight text-[#3b2a1e] sm:text-4xl">
              Tales from the sweet table.
            </h2>
          </div>
          <Carousel items={cards} />
        </div>
      </section>
    </FadeIn>
  );
};

export { DemoOne };
