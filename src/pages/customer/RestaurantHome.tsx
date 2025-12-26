import { Link, useParams } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import {
  MapPin,
  Phone,
  Clock,
  Star,
  UtensilsCrossed,
  Calendar,
  MessageSquare,
  Info,
  Navigation,
} from 'lucide-react';
import MobileActionBar from '../../components/MobileActionBar';
import CartDrawer from '../../components/CartDrawer';
import FloatingCartButton from '../../components/FloatingCartButton';
import { useEffect, useRef } from 'react';

export default function RestaurantHome() {
  const { slug } = useParams();
  const { settings } = useData();
  const menuRef = useRef<HTMLDivElement>(null);
  const reserveRef = useRef<HTMLDivElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDirections = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`,
      '_blank'
    );
  };

  const handleCall = () => {
    window.location.href = `tel:${settings.phone}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-white mb-2">{settings.name}</h1>
              <div className="flex flex-wrap gap-2 mb-3">
                {settings.cuisine.map(c => (
                  <span
                    key={c}
                    className="text-sm bg-white/20 px-3 py-1 rounded-full text-white"
                  >
                    {c}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4 text-sm text-white">
                <span
                  className={`px-3 py-1 rounded-full ${
                    settings.isOpen ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
                  {settings.isOpen ? 'Open Now' : 'Closed'}
                </span>
                {settings.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{settings.rating}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <Link
              to={`/r/${slug}/menu`}
              className="bg-white text-orange-600 px-4 py-3 rounded-lg text-center hover:bg-orange-50 transition-colors"
            >
              View Menu
            </Link>
            <Link
              to={`/r/${slug}/reserve`}
              className="bg-white/10 backdrop-blur text-white px-4 py-3 rounded-lg text-center hover:bg-white/20 transition-colors border border-white/30"
            >
              Reserve Table
            </Link>
            <button
              onClick={handleDirections}
              className="bg-white/10 backdrop-blur text-white px-4 py-3 rounded-lg text-center hover:bg-white/20 transition-colors border border-white/30"
            >
              Directions
            </button>
            <button
              onClick={handleCall}
              className="bg-white/10 backdrop-blur text-white px-4 py-3 rounded-lg text-center hover:bg-white/20 transition-colors border border-white/30"
            >
              Call
            </button>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="max-w-4xl mx-auto px-4 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 flex items-start gap-3">
            <Clock className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
            <div>
              <p className="text-gray-900 mb-1">Opening Hours</p>
              <p className="text-gray-600 text-sm">{settings.openingHours}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
            <div>
              <p className="text-gray-900 mb-1">Location</p>
              <p className="text-gray-600 text-sm">{settings.address}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 flex items-start gap-3">
            <Phone className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
            <div>
              <p className="text-gray-900 mb-1">Contact</p>
              <p className="text-gray-600 text-sm">{settings.phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-20 mt-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-6 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => scrollToSection(menuRef)}
              className="flex items-center gap-2 py-4 border-b-2 border-transparent hover:border-orange-500 text-gray-700 hover:text-orange-600 whitespace-nowrap"
            >
              <UtensilsCrossed className="w-4 h-4" />
              Menu
            </button>
            <button
              onClick={() => scrollToSection(reserveRef)}
              className="flex items-center gap-2 py-4 border-b-2 border-transparent hover:border-orange-500 text-gray-700 hover:text-orange-600 whitespace-nowrap"
            >
              <Calendar className="w-4 h-4" />
              Reservations
            </button>
            <button
              onClick={() => scrollToSection(feedbackRef)}
              className="flex items-center gap-2 py-4 border-b-2 border-transparent hover:border-orange-500 text-gray-700 hover:text-orange-600 whitespace-nowrap"
            >
              <MessageSquare className="w-4 h-4" />
              Feedback
            </button>
            <button
              onClick={() => scrollToSection(aboutRef)}
              className="flex items-center gap-2 py-4 border-b-2 border-transparent hover:border-orange-500 text-gray-700 hover:text-orange-600 whitespace-nowrap"
            >
              <Info className="w-4 h-4" />
              About
            </button>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
        {/* Menu Section */}
        <div ref={menuRef} className="scroll-mt-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-gray-900">Our Menu</h2>
            <Link
              to={`/r/${slug}/menu`}
              className="text-orange-600 hover:text-orange-700"
            >
              View Full Menu →
            </Link>
          </div>
          <div className="bg-white rounded-lg p-8 text-center">
            <UtensilsCrossed className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Explore our delicious menu with a variety of cuisines
            </p>
            <Link
              to={`/r/${slug}/menu`}
              className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Browse Menu
            </Link>
          </div>
        </div>

        {/* Reservations Section */}
        <div ref={reserveRef} className="scroll-mt-20">
          <h2 className="text-gray-900 mb-6">Table Reservations</h2>
          <div className="bg-white rounded-lg p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Book a table for your next visit</p>
            <Link
              to={`/r/${slug}/reserve`}
              className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Reserve Now
            </Link>
          </div>
        </div>

        {/* Feedback Section */}
        <div ref={feedbackRef} className="scroll-mt-20">
          <h2 className="text-gray-900 mb-6">Share Your Feedback</h2>
          <div className="bg-white rounded-lg p-8 text-center">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">We'd love to hear from you!</p>
            <Link
              to={`/r/${slug}/feedback`}
              className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Give Feedback
            </Link>
          </div>
        </div>

        {/* About Section */}
        <div ref={aboutRef} className="scroll-mt-20">
          <h2 className="text-gray-900 mb-6">About Us</h2>
          <div className="bg-white rounded-lg p-6">
            <p className="text-gray-700 mb-4">
              Welcome to {settings.name}! We serve authentic {settings.cuisine.join(', ')}{' '}
              cuisine with a focus on quality and taste.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900">Address</p>
                  <p className="text-gray-600 text-sm">{settings.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900">Hours</p>
                  <p className="text-gray-600 text-sm">{settings.openingHours}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900">Contact</p>
                  <p className="text-gray-600 text-sm">{settings.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MobileActionBar />
      <FloatingCartButton />
      <CartDrawer />
    </div>
  );
}
