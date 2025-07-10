import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "What is algorithmic trading?",
    answer: "Algorithmic trading is a method of executing trades using automated pre-programmed trading instructions that account for variables such as price, timing, and volume. Our platform provides ready-to-use algorithms for options trading in Indian markets."
  },
  {
    question: "Which brokers are supported?",
    answer: "We support integration with major Indian brokers including Zerodha, Upstox, Angel One, Fyers, and Dhan. You can easily connect your existing trading account with our platform."
  },
  {
    question: "What trading strategies are available?",
    answer: "We offer pre-built Options Buying strategies specifically designed for index trading in NIFTY50, BANKNIFTY, and SENSEX. These strategies are optimized for fast and accurate trade execution."
  },
  {
    question: "Is it suitable for beginners?",
    answer: "Yes! Our platform is designed to be user-friendly for both beginners and experienced traders. We provide comprehensive educational resources and support to help you get started."
  },
  {
    question: "How does the risk management work?",
    answer: "Our platform includes advanced risk management features such as position sizing, stop-loss automation, and daily loss limits. You can customize these parameters according to your risk tolerance."
  },
  {
    question: "What are the subscription charges?",
    answer: "We offer flexible pricing plans starting at ₹4,999 per month. You can try our platform with a 7-day free trial, no credit card required."
  }
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 px-4 relative" id="faq">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-400">
            Find answers to common questions about our algorithmic trading platform
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-medium">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-primary-500" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
              
              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? 'auto' : 0,
                  opacity: openIndex === index ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-4 text-gray-400">
                  {faq.answer}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;