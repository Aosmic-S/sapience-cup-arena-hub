
import { useDeviceType } from "@/hooks/useDeviceType";
import { AnnouncementBanner } from '@/components/AnnouncementBanner';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const MobileHome = () => (
  <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 px-2 py-4 relative">
    <AnnouncementBanner />

    <div className="mb-4 flex flex-col items-center">
      <img
        src="/lovable-uploads/42b5ce77-8484-4734-ae6e-ed1ab7f4a641.png"
        className="w-20 h-20 rounded-full mb-2"
        alt="Logo"
      />
      <h1 className="text-3xl font-bold text-white mb-1 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Esports Cup
      </h1>
      <p className="text-purple-200 text-[15px] text-center">Sapience School, Vikasnagar</p>
    </div>
    <p className="text-gray-200 text-base mb-6 text-center">
      Inter-class gaming championship! Tap to register & lead your class to glory.
    </p>

    <div className="flex flex-col space-y-3 mb-7">
      <div className="bg-slate-800/60 rounded-lg py-4 px-5 text-center">
        <span className="font-semibold text-blue-300 block text-[15px] mb-1">Prizes & Glory</span>
        <span className="text-white text-base">Battle classmates & win!</span>
      </div>
      <div className="bg-slate-800/60 rounded-lg py-4 px-5 text-center">
        <span className="font-semibold text-green-300 block text-[15px] mb-1">Who Can Join?</span>
        <span className="text-white text-base">Class 9+ students</span>
      </div>
      <div className="bg-slate-800/60 rounded-lg py-4 px-5 text-center">
        <span className="font-semibold text-orange-300 block text-[15px] mb-1">Games</span>
        <span className="text-white text-base">Free Fire, CODM, FC Mobile</span>
      </div>
    </div>

    <div className="mb-10 flex justify-center">
      <Link to="/register">
        <Button className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-8 py-2 rounded-full text-lg drop-shadow">
          Register
        </Button>
      </Link>
    </div>

    <footer className="text-center text-gray-400 pt-8 border-t border-slate-700 text-xs">
      <p>Sapience School, Vikasnagar · thesapienceschool@gmail.com</p>
      <p>Organizer: Hynx Studios</p>
    </footer>
  </div>
);

const TabletHome = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-8">
    <AnnouncementBanner />
    <div className="container mx-auto py-6">
      <header className="mb-12 flex flex-col items-center">
        <img
          src="/lovable-uploads/42b5ce77-8484-4734-ae6e-ed1ab7f4a641.png"
          className="w-24 h-24 rounded-full mb-4"
          alt="Logo"
        />
        <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">
          Sapience Esports Cup
        </h1>
        <p className="text-lg text-purple-200 mb-2">The Sapience School, Vikasnagar</p>
        <p className="text-md text-gray-300 max-w-2xl text-center">
          Join the ultimate class tournament on mobile: Free Fire, CODM, FC Mobile!
        </p>
      </header>
      <div className="grid grid-cols-2 gap-6 mb-10">
        <div className="bg-slate-800/60 rounded-xl p-6 flex flex-col items-center">
          <span className="text-yellow-300 font-semibold text-lg mb-1">Vs All Classes</span>
          <span className="text-white">Win prizes & glory</span>
        </div>
        <div className="bg-slate-800/60 rounded-xl p-6 flex flex-col items-center">
          <span className="text-blue-300 font-semibold text-lg mb-1">Class 9+</span>
          <span className="text-white">Eligible to play</span>
        </div>
        <div className="bg-slate-800/60 rounded-xl p-6 flex flex-col items-center col-span-2">
          <span className="text-green-300 font-semibold text-lg mb-1">Featured</span>
          <span className="text-white">Free Fire, CODM, FC Mobile</span>
        </div>
      </div>
      <div className="flex justify-center mb-10">
        <Link to="/register">
          <Button className="bg-white text-blue-600 hover:bg-gray-100 font-bold text-lg px-7 py-3 rounded-full">
            Register Now
          </Button>
        </Link>
      </div>
      <footer className="text-center text-gray-400 pt-8 border-t border-slate-700 text-sm">
        <div>The Sapience School • thesapienceschool@gmail.com</div>
        <div>Organized by Hynx Studios</div>
      </footer>
    </div>
  </div>
);

const DesktopHome = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
    <AnnouncementBanner />
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-12 flex flex-col items-center">
        <div className="flex flex-col items-center justify-center mb-6">
          <img
            src="/lovable-uploads/42b5ce77-8484-4734-ae6e-ed1ab7f4a641.png"
            className="w-32 h-32 mb-4 rounded-full"
            alt="Logo"
          />
          <h1 className="text-6xl font-extrabold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Sapience Esports Cup 2024
          </h1>
          <p className="text-2xl text-purple-200 mb-2">The Sapience School, Vikasnagar</p>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Welcome to the ULTIMATE gaming championship. Fight for your class and win huge!
          </p>
        </div>
      </header>
      <div className="flex justify-center gap-12 mb-16">
        <div className="bg-slate-800/40 rounded-2xl px-10 py-8 w-80 shadow-md text-center">
          <div className="text-yellow-400 text-3xl font-semibold mb-2">🏆</div>
          <h3 className="text-2xl text-white font-bold mb-1">Inter-Class Battle</h3>
          <p className="text-gray-200">Dominate across all classes to win prizes & fame!</p>
        </div>
        <div className="bg-slate-800/40 rounded-2xl px-10 py-8 w-80 shadow-md text-center">
          <div className="text-green-400 text-3xl font-semibold mb-2">🎮</div>
          <h3 className="text-2xl text-white font-bold mb-1">Multiple Games</h3>
          <p className="text-gray-200">Free Fire | CODM | FC Mobile</p>
        </div>
        <div className="bg-slate-800/40 rounded-2xl px-10 py-8 w-80 shadow-md text-center">
          <div className="text-blue-400 text-3xl font-semibold mb-2">👥</div>
          <h3 className="text-2xl text-white font-bold mb-1">Class 9+</h3>
          <p className="text-gray-200">Registration Open</p>
        </div>
      </div>
      <div className="flex justify-center mb-12">
        <Link to="/register">
          <Button className="bg-white text-blue-600 hover:bg-gray-100 font-bold text-xl px-12 py-5 rounded-full hover:scale-110 transition-all duration-300 shadow-lg">
            Register Now
          </Button>
        </Link>
      </div>
      <footer className="text-center text-gray-400 pt-8 border-t border-slate-700 text-base">
        <div>The Sapience School, Vikasnagar · thesapienceschool@gmail.com</div>
        <div>Organizer: Hynx Studios</div>
      </footer>
    </div>
  </div>
);

const Index = () => {
  const deviceType = useDeviceType();
  if (deviceType === "mobile") return <MobileHome />;
  if (deviceType === "tablet") return <TabletHome />;
  return <DesktopHome />;
};

export default Index;
