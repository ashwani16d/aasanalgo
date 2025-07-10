export interface NavLink {
  label: string;
  href: string;
}

export interface Feature {
  id: number;
  title: string;
  description: string;
  icon: React.FC;
}

export interface PricingPlan {
  id: number;
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  message: string;
  avatar: string;
}

export interface Stat {
  id: number;
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
}