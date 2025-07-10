import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Hedge Fund Manager",
    content: "This platform's algorithmic trading capabilities have transformed our investment strategy. The real-time analytics and AI-driven insights are exceptional.",
    rating: 5
  },
  {
    name: "Marcus Rodriguez",
    role: "Day Trader",
    content: "The precision and speed of execution are unmatched. I've seen a significant improvement in my trading performance since adopting this system.",
    rating: 5
  },
  {
    name: "Emily Thompson",
    role: "Investment Analyst",
    content: "The advanced analytics and pattern recognition have given us a competitive edge in market analysis. Truly revolutionary technology.",
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden" id="testimonials">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover why leading traders and institutions trust our platform for their algorithmic trading needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700"
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <p className="text-gray-300 mb-6">{testimonial.content}</p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-gray-400 text-sm">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;