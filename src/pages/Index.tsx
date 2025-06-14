
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AnnouncementBanner } from '@/components/AnnouncementBanner';
import { Gamepad2, Trophy, Users, Calendar } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <AnnouncementBanner />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
              <span className="text-white font-bold text-xl">TSS</span>
            </div>
            <div>
              <h1 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Sapience Esports Cup
              </h1>
              <p className="text-gray-300 text-lg">The Sapience School, Vikasnagar</p>
            </div>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join the ultimate inter-class gaming championship! Compete in your favorite games, 
            showcase your skills, and claim victory for your class.
          </p>
        </header>

        {/* Tournament Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Inter-Class Tournament</h3>
              <p className="text-gray-300">Compete against other classes and prove your gaming supremacy</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Class 9 & Above</h3>
              <p className="text-gray-300">Open to all students from Class 9 onwards</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Gamepad2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Multiple Games</h3>
              <p className="text-gray-300">Choose from Free Fire, CODM, and FC Mobile</p>
            </CardContent>
          </Card>
        </div>

        {/* Featured Games */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Featured Games</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="relative group overflow-hidden rounded-lg">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-8 text-center transform group-hover:scale-105 transition-transform duration-300">
                <h3 className="text-2xl font-bold text-white mb-2">Free Fire</h3>
                <p className="text-orange-100">Battle Royale at its finest</p>
              </div>
            </div>
            
            <div className="relative group overflow-hidden rounded-lg">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-center transform group-hover:scale-105 transition-transform duration-300">
                <h3 className="text-2xl font-bold text-white mb-2">Call of Duty Mobile</h3>
                <p className="text-green-100">Tactical warfare redefined</p>
              </div>
            </div>
            
            <div className="relative group overflow-hidden rounded-lg">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 text-center transform group-hover:scale-105 transition-transform duration-300">
                <h3 className="text-2xl font-bold text-white mb-2">FC Mobile</h3>
                <p className="text-blue-100">The beautiful game in your hands</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Compete?</h2>
            <p className="text-blue-100 text-lg mb-6">
              Register now and secure your spot in the tournament!
            </p>
            <Link to="/register">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 font-bold text-lg px-8 py-3 rounded-full transform hover:scale-105 transition-all duration-300">
                Register Now
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-400 mt-12 pt-8 border-t border-slate-700">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold text-white mb-2">The Sapience School, Vikasnagar</p>
              <p>Contact: school@sapience.edu</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Tournament Organizer</p>
              <p>Arham Ali - Class 9-B</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
