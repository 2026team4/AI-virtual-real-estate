import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

const footerLinks = {
  Company:    [{ label: 'About Us', to: '#' }, { label: 'Careers', to: '#' }, { label: 'Press', to: '#' }, { label: 'Blog', to: '#' }],
  Properties: [{ label: 'Buy Property', to: '/properties?status=sale' }, { label: 'Rent Property', to: '/properties?status=rent' }, { label: 'Sell Property', to: '/add-listing' }, { label: 'New Projects', to: '/properties' }],
  Support:    [{ label: 'Help Center', to: '#' }, { label: 'Contact Us', to: '#' }, { label: 'Privacy Policy', to: '#' }, { label: 'Terms of Service', to: '#' }],
};

const socials = [
  { icon: <Facebook size={18} />,  href: '#', label: 'Facebook' },
  { icon: <Twitter size={18} />,   href: '#', label: 'Twitter' },
  { icon: <Instagram size={18} />, href: '#', label: 'Instagram' },
  { icon: <Linkedin size={18} />,  href: '#', label: 'LinkedIn' },
  { icon: <Youtube size={18} />,   href: '#', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className="bg-dark-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <Building2 size={22} className="text-white" />
              </div>
              <span className="font-heading font-bold text-white text-xl">AI RealEstate</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              India's smartest property platform — discover, explore, and own your dream home with the power of AI and immersive virtual tours.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin size={15} className="text-primary-400 flex-shrink-0" />
                <span>123, Tech Park, Bengaluru, Karnataka 560001</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Phone size={15} className="text-primary-400" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Mail size={15} className="text-primary-400" />
                <span>hello@airealestate.in</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-semibold text-white mb-4">{section}</h4>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-gray-400 hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} AI RealEstate. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <a key={s.label} href={s.href} aria-label={s.label}
                className="w-9 h-9 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors duration-200">
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
