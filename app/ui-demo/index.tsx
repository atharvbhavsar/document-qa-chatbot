'use client';

import React from 'react';
import Link from 'next/link';

export default function UiDemoIndex() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Modern UI Components
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Explore our collection of beautiful, animated input components built with Tailwind CSS and minimal custom animations.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link 
              href="/ui-demo/components"
              className="block group"
            >
              <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-6 h-full transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Input Components Demo
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Explore various input components with different styles, animations and states.
                </p>
                <div className="text-blue-600 dark:text-blue-400 flex items-center font-medium">
                  View Demo
                  <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
            
            <Link 
              href="/ui-demo/contact-form"
              className="block group"
            >
              <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-6 h-full transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Contact Form Example
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  See how these input components work together in a real-world contact form application.
                </p>
                <div className="text-blue-600 dark:text-blue-400 flex items-center font-medium">
                  View Demo
                  <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">Features</h3>
            <ul className="list-disc pl-5 text-blue-700 dark:text-blue-200 space-y-1">
              <li>Rounded corners, shadows, and gradient border highlights</li>
              <li>Animated borders on focus (glow and expansion effects)</li>
              <li>Floating labels that animate smoothly</li>
              <li>High contrast text for readability</li>
              <li>Hover effects and transitions for better user experience</li>
              <li>Error and success states with appropriate styling</li>
              <li>Multiple style variants to choose from</li>
              <li>Responsive design that works on all screen sizes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
