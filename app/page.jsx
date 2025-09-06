'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PaymentModal from '../components/PaymentModal';
import BackgroundSection from '../components/BackgroundSection';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [paymentModal, setPaymentModal] = useState({
    isOpen: false,
    planName: '',
    amount: 0,
    originalAmount: 0
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/95 backdrop-blur-sm z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Verba AI
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-700 hover:text-blue-600 transition">
                Features
              </Link>
              <Link href="#compliance" className="text-gray-700 hover:text-blue-600 transition">
                HIPAA Compliance
              </Link>
              <Link href="#pricing" className="text-gray-700 hover:text-blue-600 transition">
                Pricing
              </Link>
              <Link href="#contact" className="text-gray-700 hover:text-blue-600 transition">
                Contact
              </Link>
              <Link href="/recorder" className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition">
                Live Demo
              </Link>
              <Link href="/dashboard" className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition">
                Dashboard
              </Link>
              <button 
                onClick={() => setPaymentModal({
                  isOpen: true,
                  planName: 'Professional',
                  amount: 40,
                  originalAmount: 80
                })}
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition">
                Get Early Access
              </button>
            </div>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="#features" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
                Features
              </Link>
              <Link href="#compliance" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
                HIPAA Compliance
              </Link>
              <Link href="#pricing" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
                Pricing
              </Link>
              <Link href="#contact" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
                Contact
              </Link>
              <button className="w-full text-left bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700">
                Get Early Access
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/85 to-cyan-900/90"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-6 px-6 py-2 bg-green-500/20 text-green-100 rounded-full text-sm font-semibold backdrop-blur-sm border border-green-400/30">
            🎉 50% Early Bird Discount - Limited Time Only
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Transform Clinical
            <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Documentation
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
            AI-powered HIPAA-compliant clinical notes from recorded sessions. 
            Save hours on documentation while maintaining objective, evidence-based notes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button 
              onClick={() => setPaymentModal({
                isOpen: true,
                planName: 'Professional',
                amount: 40,
                originalAmount: 80
              })}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-12 py-5 rounded-full text-lg font-bold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25 transform hover:-translate-y-1">
              Claim 50% Discount Now
            </button>
            <button 
              onClick={() => document.getElementById('demo-video')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-12 py-5 rounded-full text-lg font-semibold hover:bg-white/20 transition-all duration-300">
              Watch Demo
            </button>
          </div>
          
          <p className="mt-8 text-blue-200 text-lg">
            Full service launches October 2024
          </p>
        </div>

        {/* Floating Cards */}
        <div className="absolute bottom-10 left-10 hidden lg:block">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white border border-white/20">
            <div className="text-3xl mb-2">🎙️</div>
            <p className="text-sm font-semibold">Real-time Recording</p>
          </div>
        </div>
        
        <div className="absolute top-32 right-10 hidden lg:block">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white border border-white/20">
            <div className="text-3xl mb-2">📝</div>
            <p className="text-sm font-semibold">AI Documentation</p>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔒</span>
              <span className="font-semibold">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🛡️</span>
              <span className="font-semibold">BAA Available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔐</span>
              <span className="font-semibold">End-to-End Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✅</span>
              <span className="font-semibold">SOC 2 Type II</span>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section id="demo-video" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              See Verba AI in Action
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Watch how our AI transforms therapy sessions into professional clinical documentation
            </p>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-900 to-cyan-900">
            {/* Video Container */}
            <div className="aspect-video relative">
              {/* Background Image from Unsplash */}
              <div className="absolute inset-0">
                <div 
                  className="w-full h-full bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2088&q=80')`
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/50"></div>
              </div>
              
              {/* Video Content Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white max-w-2xl px-8">
                  <div className="w-24 h-24 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 group cursor-pointer hover:bg-white/30 transition-all duration-300">
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Experience the Future of Clinical Documentation</h3>
                  <p className="text-blue-200 text-lg leading-relaxed mb-6">
                    See how therapists maintain full attention on their clients while Verba AI handles the documentation
                  </p>
                  <button className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-8 py-3 rounded-full font-semibold hover:bg-white/30 transition-all duration-300">
                    Watch Demo
                  </button>
                </div>
              </div>
            </div>

            {/* Video Description Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
              <div className="text-white">
                <h4 className="text-xl font-bold mb-2">AI Voiceover Concept:</h4>
                <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-300">
                  <div>
                    <p className="mb-2">"Could you imagine a world where you could be paying full attention to your client without the distractions of jotting down notes?"</p>
                    <p>"This builds deeper trust and connection with your patients."</p>
                  </div>
                  <div>
                    <p className="mb-2">"The time is now to revolutionize clinical documentation."</p>
                    <p className="font-semibold text-cyan-300">Welcome to Verba AI.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Benefits */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">👁️</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Full Attention</h4>
              <p className="text-gray-600">Focus entirely on your client without note-taking distractions</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">🤝</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Build Trust</h4>
              <p className="text-gray-600">Deeper connections through uninterrupted therapeutic presence</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Instant Notes</h4>
              <p className="text-gray-600">Professional documentation generated in real-time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need for Clinical Documentation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Streamline your practice with intelligent features designed specifically for mental health professionals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '📝',
                title: 'Multiple Note Templates',
                description: 'SOAP, DAP, BIRP, GIRP, and custom templates for every session type',
                bgImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
              },
              {
                icon: '🎯',
                title: 'Objective Language',
                description: 'Automatically converts subjective language to objective, clinical observations',
                bgImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
              },
              {
                icon: '⚠️',
                title: 'Risk Detection',
                description: 'Flags SI/HI indicators, abuse concerns, and mandated reporting situations',
                bgImage: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
              },
              {
                icon: '🔊',
                title: 'Speaker Diarization',
                description: 'Accurately identifies and separates therapist and client voices',
                bgImage: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
              },
              {
                icon: '💊',
                title: 'Coding Assistance',
                description: 'Suggests appropriate CPT and ICD-10 codes for billing',
                bgImage: 'https://images.unsplash.com/photo-1576671081837-49000212a370?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
              },
              {
                icon: '🔄',
                title: 'EHR Integration',
                description: 'Export to major EHR systems or copy-paste ready formats',
                bgImage: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
              }
            ].map((feature, index) => (
              <div key={index} className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <div 
                    className="w-full h-full bg-cover bg-center bg-no-repeat transform group-hover:scale-110 transition-transform duration-700"
                    style={{ backgroundImage: `url('${feature.bgImage}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-800/70 to-blue-600/50 group-hover:from-blue-900/95 group-hover:via-blue-800/80 transition-all duration-300"></div>
                </div>
                
                {/* Content */}
                <div className="relative z-10 p-8 h-80 flex flex-col justify-end text-white">
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-blue-100 leading-relaxed group-hover:text-white transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold animate-pulse">
              Limited Time: 50% Off All Plans
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join before October 2024 and lock in 50% off for life
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
              <p className="text-gray-600 mb-4">For individual practitioners</p>
              <div className="mb-6">
                <span className="text-gray-400 line-through text-2xl">$40</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-gray-900">$20</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>100 sessions/month</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>All note templates</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Risk detection</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>HIPAA compliant</span>
                </li>
              </ul>
              <button 
                onClick={() => setPaymentModal({
                  isOpen: true,
                  planName: 'Starter',
                  amount: 20,
                  originalAmount: 40
                })}
                className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition">
                Get Early Access
              </button>
            </div>

            {/* Professional Plan */}
            <div className="bg-gradient-to-b from-blue-600 to-blue-700 text-white p-8 rounded-2xl shadow-xl transform md:scale-105">
              <div className="inline-block px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-sm font-semibold mb-4">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Professional</h3>
              <p className="text-blue-100 mb-4">For growing practices</p>
              <div className="mb-6">
                <span className="text-blue-200 line-through text-2xl">$80</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold">$40</span>
                  <span className="text-blue-100">/month</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-green-300">✓</span>
                  <span>Unlimited sessions</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-300">✓</span>
                  <span>Custom templates</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-300">✓</span>
                  <span>EHR integrations</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-300">✓</span>
                  <span>Priority support</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-300">✓</span>
                  <span>Team collaboration</span>
                </li>
              </ul>
              <button 
                onClick={() => setPaymentModal({
                  isOpen: true,
                  planName: 'Professional',
                  amount: 40,
                  originalAmount: 80
                })}
                className="w-full bg-white text-blue-600 py-3 rounded-full font-semibold hover:bg-blue-50 transition">
                Get Early Access
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <p className="text-gray-600 mb-4">For organizations</p>
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-gray-900">Custom</span>
                </div>
                <span className="text-green-600 font-semibold">50% off setup fee</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Unlimited everything</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>On-premise option</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Custom workflows</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Dedicated support</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Training included</span>
                </li>
              </ul>
              <button 
                onClick={() => window.location.href = 'mailto:sales@verba-ai.com?subject=Enterprise%20Inquiry'}
                className="w-full bg-gray-900 text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition">
                Contact Sales
              </button>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600">
              🔒 All plans include HIPAA compliance, BAA, and end-to-end encryption
            </p>
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section id="compliance" className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&auto=format&fit=crop&w=2126&q=80')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-blue-900/90 to-gray-900/95"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Built for Healthcare
                <span className="block text-cyan-400">Compliance</span>
              </h2>
              <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                Enterprise-grade security and compliance built from the ground up, so you can focus entirely on patient care.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  'HIPAA compliant infrastructure with BAA',
                  'End-to-end encryption for all data',
                  'Comprehensive audit logs for compliance',
                  'Role-based access controls (RBAC)',
                  'Data retention policies (7-year default)',
                  'No training on your data - ever',
                  'Regular security audits and penetration testing',
                  'GDPR and CCPA compliant'
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <span className="text-green-400 text-xl mt-1 flex-shrink-0">✓</span>
                    <span className="text-white text-sm font-medium leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              {/* Main Security Card */}
              <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl p-10 rounded-3xl border border-white/30 shadow-2xl">
                <div className="text-center space-y-8">
                  <div className="text-8xl">🛡️</div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-4">Enterprise-Grade Security</h3>
                    <p className="text-blue-200 text-lg leading-relaxed">
                      Your data is protected with the same security standards used by major healthcare systems worldwide
                    </p>
                  </div>
                  <div className="flex justify-center gap-4 flex-wrap">
                    <span className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold border border-white/30">SOC 2 Type II</span>
                    <span className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold border border-white/30">HIPAA</span>
                    <span className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold border border-white/30">AES-256</span>
                    <span className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold border border-white/30">TLS 1.3</span>
                  </div>
                </div>
              </div>
              
              {/* Floating Security Elements */}
              <div className="absolute -top-4 -right-4 bg-green-500/20 backdrop-blur-sm rounded-2xl p-4 border border-green-400/30">
                <div className="text-2xl">🔐</div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-blue-500/20 backdrop-blur-sm rounded-2xl p-4 border border-blue-400/30">
                <div className="text-2xl">🔒</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <BackgroundSection
        backgroundImage="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80"
        overlay="bg-gradient-to-r from-blue-600/95 to-cyan-600/95"
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your
            <span className="block text-cyan-300">Documentation?</span>
          </h2>
          <p className="text-xl text-blue-100 mb-12 leading-relaxed">
            Join hundreds of clinicians saving hours on documentation every week.
            Lock in your 50% discount before October 2024.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button 
              onClick={() => setPaymentModal({
                isOpen: true,
                planName: 'Professional',
                amount: 40,
                originalAmount: 80
              })}
              className="bg-white text-blue-600 px-12 py-5 rounded-full text-lg font-bold hover:bg-blue-50 transition-all duration-300 shadow-2xl hover:shadow-white/25 transform hover:-translate-y-1">
              Claim Your 50% Discount
            </button>
            <button className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-12 py-5 rounded-full text-lg font-semibold hover:bg-white/20 transition-all duration-300">
              Schedule Demo
            </button>
          </div>
          <p className="mt-8 text-blue-200 text-lg">
            30-day money-back guarantee • Cancel anytime
          </p>
        </div>
      </BackgroundSection>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Verba AI</h3>
              <p className="text-gray-400">
                HIPAA-compliant clinical documentation powered by AI
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="#features" className="hover:text-white transition">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white transition">Security</Link></li>
                <li><Link href="#" className="hover:text-white transition">Roadmap</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-white transition">Documentation</Link></li>
                <li><Link href="#" className="hover:text-white transition">API Reference</Link></li>
                <li><Link href="#" className="hover:text-white transition">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition">Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li>support@verba-ai.com</li>
                <li>1-800-VERBA-AI</li>
                <li className="flex gap-4 mt-4">
                  <a href="#" className="hover:text-white transition">LinkedIn</a>
                  <a href="#" className="hover:text-white transition">Twitter</a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2024 Verba AI. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="#" className="hover:text-white transition">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition">Terms of Service</Link>
              <Link href="#" className="hover:text-white transition">HIPAA Notice</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ ...paymentModal, isOpen: false })}
        planName={paymentModal.planName}
        amount={paymentModal.amount}
        originalAmount={paymentModal.originalAmount}
      />
    </div>
  );
}