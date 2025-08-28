'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '../../components/ui/button/Button';

export default function UIDemoPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-12">UI Components Demo</h1>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4">
            <h2 className="text-xl font-bold text-white">UI Components</h2>
          </div>
          <div className="p-6 space-y-6">
            <p className="text-gray-700">
              Explore the various UI components used throughout the application.
              These components are designed to be reusable, accessible, and responsive.
            </p>
            
            <div className="flex space-x-4 mt-4">
              <Link href="/ui-demo/components">
                <Button 
                  variant="default"
                  className="w-full"
                >
                  View Components
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-4">
            <h2 className="text-xl font-bold text-white">Form Examples</h2>
          </div>
          <div className="p-6 space-y-6">
            <p className="text-gray-700">
              See examples of various form layouts and input validation patterns.
              These forms demonstrate best practices for data collection and user feedback.
            </p>
            
            <div className="flex space-x-4 mt-4">
              <Link href="/ui-demo/contact-form">
                <Button 
                  variant="default"
                  className="w-full"
                >
                  View Forms
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Link href="/">
            <Button variant="outline">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
