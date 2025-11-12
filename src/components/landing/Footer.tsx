'use client';

import Link from 'next/link';
import { Twitter, Linkedin, Github, Mail } from 'lucide-react';

/**
 * Footer Component
 * 
 * Site footer with links, social media, and copyright
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-xl font-bold text-white">ClientHunt</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Find your next freelance opportunity on Reddit with AI-powered automation.
            </p>
            {/* Social Links */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors cursor-not-allowed"
                aria-label="Twitter"
                onClick={(e) => e.preventDefault()}
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors cursor-not-allowed"
                aria-label="LinkedIn"
                onClick={(e) => e.preventDefault()}
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors cursor-not-allowed"
                aria-label="GitHub"
                onClick={(e) => e.preventDefault()}
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="mailto:support@clienthunt.app"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#features" className="text-sm hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-sm hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-sm hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="text-sm hover:text-white transition-colors">
                  Changelog
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-sm hover:text-white transition-colors">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-sm hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-sm hover:text-white transition-colors">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © {currentYear} ClientHunt. All rights reserved.
            </p>
            <p className="text-sm text-gray-400 mt-4 md:mt-0">
              Made with ❤️ for freelancers worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
