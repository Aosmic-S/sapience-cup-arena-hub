
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Shield, Target, Gamepad2, AlertTriangle, Smartphone } from 'lucide-react';

const Rules = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card className="max-w-4xl mx-auto bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white text-center">
              Tournament Rules & Guidelines
            </CardTitle>
            <p className="text-gray-300 text-center">
              Please read all rules carefully before participating
            </p>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-slate-700">
                <TabsTrigger value="general" className="text-sm">General</TabsTrigger>
                <TabsTrigger value="freefire" className="text-sm">Free Fire</TabsTrigger>
                <TabsTrigger value="codm" className="text-sm">CODM</TabsTrigger>
                <TabsTrigger value="fcmobile" className="text-sm">FC Mobile</TabsTrigger>
                <TabsTrigger value="conduct" className="text-sm">Conduct</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="mt-6">
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <Shield className="w-6 h-6 text-blue-400 mr-3" />
                    <h3 className="text-2xl font-bold text-white">General Rules</h3>
                  </div>
                  
                  <div className="bg-slate-700/50 rounded-lg p-6">
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-3">•</span>
                        <span>Open to students of Class 9 and above from The Sapience School, Vikasnagar</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-3">•</span>
                        <span>Each student can participate in only ONE game category</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-3">•</span>
                        <span>Registration deadline: [To be announced by admin]</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-3">•</span>
                        <span>Entry fee must be paid before the registration deadline</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-3">•</span>
                        <span>All matches will be played on mobile devices only</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-3">•</span>
                        <span>Players must bring their own devices and ensure stable internet connection</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-3">•</span>
                        <span>Tournament organizers' decisions are final and binding</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-3">•</span>
                        <span>Prizes will be awarded to winners of each game category</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="freefire" className="mt-6">
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <Target className="w-6 h-6 text-orange-400 mr-3" />
                    <h3 className="text-2xl font-bold text-white">Free Fire Rules</h3>
                  </div>
                  
                  <div className="bg-slate-700/50 rounded-lg p-6">
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-start">
                        <span className="text-orange-400 mr-3">•</span>
                        <span>Team mode: 4 players per team (Squad mode)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-400 mr-3">•</span>
                        <span>Solo mode: Individual players compete</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-400 mr-3">•</span>
                        <span>Custom room matches will be organized</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-400 mr-3">•</span>
                        <span>Map: Bermuda (Classic mode)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-400 mr-3">•</span>
                        <span>All characters and pets allowed</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-400 mr-3">•</span>
                        <span>No third-party apps or hacks allowed</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-400 mr-3">•</span>
                        <span>Players must join the custom room within 5 minutes of invitation</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-400 mr-3">•</span>
                        <span>Screenshot of final results must be submitted</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="codm" className="mt-6">
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <Gamepad2 className="w-6 h-6 text-green-400 mr-3" />
                    <h3 className="text-2xl font-bold text-white">Call of Duty Mobile Rules</h3>
                  </div>
                  
                  <div className="bg-slate-700/50 rounded-lg p-6">
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-start">
                        <span className="text-green-400 mr-3">•</span>
                        <span>Team mode: 5 players per team</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-400 mr-3">•</span>
                        <span>Game mode: Multiplayer - Team Deathmatch</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-400 mr-3">•</span>
                        <span>Private room matches will be organized</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-400 mr-3">•</span>
                        <span>Maps will be announced before each match</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-400 mr-3">•</span>
                        <span>All weapons and attachments allowed except banned items</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-400 mr-3">•</span>
                        <span>Banned items: Purifier, War Machine, Gravity Spikes</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-400 mr-3">•</span>
                        <span>No camping allowed - players must actively engage</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-400 mr-3">•</span>
                        <span>Match duration: 10 minutes or first to 50 kills</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="fcmobile" className="mt-6">
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <Target className="w-6 h-6 text-blue-400 mr-3" />
                    <h3 className="text-2xl font-bold text-white">FC Mobile Rules</h3>
                  </div>
                  
                  <div className="bg-slate-700/50 rounded-lg p-6">
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-3">•</span>
                        <span>1v1 matches in tournament bracket format</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-3">•</span>
                        <span>Match duration: 6 minutes (3 minutes each half)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-3">•</span>
                        <span>Difficulty level: Professional</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-3">•</span>
                        <span>All teams and formations allowed</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-3">•</span>
                        <span>No pausing during active gameplay</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-3">•</span>
                        <span>In case of a draw, extra time will be played (2 minutes)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-3">•</span>
                        <span>If still tied, penalty shootout will decide the winner</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-3">•</span>
                        <span>Players must use their own accounts and teams</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="conduct" className="mt-6">
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-400 mr-3" />
                    <h3 className="text-2xl font-bold text-white">Code of Conduct & Disqualification</h3>
                  </div>
                  
                  <div className="bg-slate-700/50 rounded-lg p-6 mb-6">
                    <h4 className="text-lg font-semibold text-white mb-3">Code of Conduct</h4>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-start">
                        <span className="text-yellow-400 mr-3">•</span>
                        <span>Maintain respectful behavior towards all participants and organizers</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-400 mr-3">•</span>
                        <span>No toxic language, harassment, or unsportsmanlike conduct</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-400 mr-3">•</span>
                        <span>Follow all school rules and maintain discipline</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-400 mr-3">•</span>
                        <span>Disputes should be raised politely with organizers</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-red-900/30 rounded-lg p-6 border border-red-700">
                    <h4 className="text-lg font-semibold text-red-400 mb-3">Disqualification Policy</h4>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-start">
                        <span className="text-red-400 mr-3">•</span>
                        <span>Use of cheats, hacks, or third-party software</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-400 mr-3">•</span>
                        <span>Account sharing or playing on behalf of others</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-400 mr-3">•</span>
                        <span>Late arrival (more than 10 minutes after scheduled time)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-400 mr-3">•</span>
                        <span>Toxic behavior or unsportsmanlike conduct</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-400 mr-3">•</span>
                        <span>Violation of any tournament rules</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-400 mr-3">•</span>
                        <span>Technical issues due to inadequate device/internet (not organizer's fault)</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-slate-700/50 rounded-lg p-6">
                    <div className="flex items-center mb-3">
                      <Smartphone className="w-5 h-5 text-purple-400 mr-3" />
                      <h4 className="text-lg font-semibold text-white">Device Guidelines</h4>
                    </div>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-start">
                        <span className="text-purple-400 mr-3">•</span>
                        <span>Participants must bring their own mobile devices</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-400 mr-3">•</span>
                        <span>Ensure device is fully charged or bring power bank</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-400 mr-3">•</span>
                        <span>Stable internet connection is mandatory</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-400 mr-3">•</span>
                        <span>Games must be updated to the latest version</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-400 mr-3">•</span>
                        <span>Headphones/earphones recommended for better experience</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Rules;
