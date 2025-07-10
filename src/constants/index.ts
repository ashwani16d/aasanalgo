import { Feature, NavLink, PricingPlan, Stat, Testimonial } from '../types';
import { BarChart4, BrainCircuit, BarChart, Cpu, Gauge, Lock, LineChart, PieChart, Zap } from 'lucide-react';

export const NAVIGATION_LINKS: NavLink[] = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'About', href: '#about' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Pricing', href: '#pricing' },
];

export const FEATURES: Feature[] = [
  {
    id: 1,
    title: 'Advanced Algorithms',
    description: 'State-of-the-art trading algorithms leveraging machine learning and pattern recognition.',
    icon: BrainCircuit,
  },
  {
    id: 2,
    title: 'Real-time Analysis',
    description: 'Process market data in milliseconds with our high-performance engine.',
    icon: Zap,
  },
  {
    id: 3,
    title: 'Risk Management',
    description: 'Sophisticated risk assessment and position sizing to protect your capital.',
    icon: Lock,
  },
  {
    id: 4,
    title: 'Performance Tracking',
    description: 'Comprehensive dashboards and metrics to monitor your trading performance.',
    icon: BarChart,
  },
  {
    id: 5,
    title: 'Multi-market Support',
    description: 'Trade across forex, crypto, stocks, and futures with a single platform.',
    icon: BarChart4,
  },
  {
    id: 6,
    title: 'Low Latency Execution',
    description: 'Execute trades with microsecond precision for optimal entry and exit points.',
    icon: Cpu,
  },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 1,
    name: 'Starter',
    price: '$49',
    description: 'Perfect for beginners looking to enter the world of algorithmic trading.',
    features: [
      'Access to 3 trading algorithms',
      'Real-time market data',
      'Basic backtesting tools',
      'Email support',
      'Up to $10,000 portfolio size',
    ],
    buttonText: 'Get Started',
  },
  {
    id: 2,
    name: 'Professional',
    price: '$149',
    description: 'For serious traders who need advanced features and higher trading volumes.',
    features: [
      'Access to all trading algorithms',
      'Real-time market data with advanced indicators',
      'Advanced backtesting environment',
      'Priority email & chat support',
      'Up to $100,000 portfolio size',
      'Custom risk parameters',
    ],
    buttonText: 'Upgrade Now',
    isPopular: true,
  },
  {
    id: 3,
    name: 'Enterprise',
    price: '$499',
    description: 'Tailored solutions for institutions and professional trading operations.',
    features: [
      'Unlimited access to all features',
      'Custom algorithm development',
      'Dedicated hosting & infrastructure',
      '24/7 phone & email support',
      'Unlimited portfolio size',
      'Custom integrations',
      'Personalized onboarding',
    ],
    buttonText: 'Contact Sales',
  },
];

export const PERFORMANCE_STATS: Stat[] = [
  {
    id: 1,
    value: '87',
    label: 'Win Rate',
    suffix: '%',
  },
  {
    id: 2,
    value: '0.8',
    label: 'Sharpe Ratio',
  },
  {
    id: 3,
    value: '2.7',
    label: 'Profit Factor',
  },
  {
    id: 4,
    value: '32',
    label: 'Annual Return',
    suffix: '%',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Alex Johnson',
    role: 'Hedge Fund Manager',
    company: 'Quantum Capital',
    message: 'This algorithmic trading platform has completely transformed our operations. The performance and reliability are unmatched in the industry.',
    avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 2,
    name: 'Sarah Chen',
    role: 'Day Trader',
    company: 'Independent',
    message: 'As an individual trader, this platform gave me capabilities previously only available to institutions. My returns have increased by 43% since adoption.',
    avatar: 'https://images.pexels.com/photos/3785424/pexels-photo-3785424.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 3,
    name: 'Michael Patel',
    role: 'CTO',
    company: 'TechTrade Solutions',
    message: 'The technical architecture is impressive. Low latency, high reliability, and the 3D visualization tools provide insights we never had before.',
    avatar: 'https://images.pexels.com/photos/2589653/pexels-photo-2589653.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
];