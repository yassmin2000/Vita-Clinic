import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards';

export default function TestimonialsSection() {
  return (
    <div id="testimonials" className="pb-16">
      <div className="mb-6 flex items-center justify-center">
        <h2 className="text-4xl font-bold text-primary">Testimonials</h2>
      </div>
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </div>
  );
}

const testimonials = [
  {
    testimonial:
      'Vita Clinic provided exceptional care throughout my treatment journey. The personalized approach and advanced treatments truly made a difference.',
    name: 'Emily Brown',
  },
  {
    testimonial:
      "I am grateful for the compassionate support and expertise at Vita Clinic. The team's dedication to my well-being was evident every step of the way.",
    name: 'James Kim',
  },
  {
    testimonial:
      'The advanced technology and attentive staff at Vita Clinic ensured I received the best possible care. They made a challenging time easier to navigate.',
    name: 'Olivia Perez',
  },
  {
    testimonial:
      'Choosing Vita Clinic was the best decision for my treatment. The comprehensive care and understanding of my needs were exceptional.',
    name: 'Sophia Martinez',
  },
  {
    testimonial:
      'I appreciate the holistic approach Vita Clinic took in my treatment plan. From diagnosis to recovery, they were with me every step, providing support and expertise.',
    name: 'Liam Roberts',
  },
  {
    testimonial:
      "Vita Clinic's commitment to patient care is outstanding. They not only treated my condition but also supported me emotionally throughout the process.",
    name: 'Ethan Martinez',
  },
];
