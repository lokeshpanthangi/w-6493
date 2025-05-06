
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dice3D } from "@/components/ui/dice-3d";
import { CoinFlip } from "@/components/ui/coin-flip";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-dicey-purple-light/10">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Dice3D size="sm" />
          <span className="font-bold text-xl">DiceyDecisions</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Log In
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="sm">Sign Up</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-dicey-gray-dark leading-tight">
            Make Group Decisions
            <span className="text-dicey-purple block">Fun Again!</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-dicey-gray-dark/80 max-w-lg">
            End the endless debate. Let DiceyDecisions add excitement to your group choices with games, randomizers, and playful decision-making tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started Free
              </Button>
            </Link>
            <Link to="#how-it-works">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Learn How It Works
              </Button>
            </Link>
          </div>
        </div>

        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-72 h-72">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Dice3D size="lg" className="animate-float" />
            </div>
            <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2">
              <CoinFlip size="md" className="animate-bounce-small" />
            </div>
            <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2">
              <div className="spinner-wheel w-16 h-16 animate-spin-slow"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How DiceyDecisions Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-dicey-purple-light/10 rounded-xl">
              <div className="w-16 h-16 mx-auto mb-4 bg-dicey-purple rounded-full flex items-center justify-center text-white font-bold text-2xl">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Create or Join a Room</h3>
              <p className="text-dicey-gray-dark/80">
                Start a new decision room or join an existing one with your friends, roommates, or colleagues.
              </p>
            </div>

            <div className="text-center p-6 bg-dicey-yellow-light/20 rounded-xl">
              <div className="w-16 h-16 mx-auto mb-4 bg-dicey-yellow rounded-full flex items-center justify-center text-dicey-gray-dark font-bold text-2xl">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Add Your Options</h3>
              <p className="text-dicey-gray-dark/80">
                Everyone adds their preferred choices to the room — restaurants, movies, activities, or anything else.
              </p>
            </div>

            <div className="text-center p-6 bg-dicey-blue-light/10 rounded-xl">
              <div className="w-16 h-16 mx-auto mb-4 bg-dicey-blue rounded-full flex items-center justify-center text-white font-bold text-2xl">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Let Chance Decide</h3>
              <p className="text-dicey-gray-dark/80">
                Choose a fun decision method — dice roll, spinner wheel, or coin flip — and let the app pick for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-dicey-purple to-dicey-blue text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Make Decisions Fun?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of friend groups, roommates, and teams who use DiceyDecisions to end the "I don't know, what do you want to do?" cycle.
          </p>
          <Link to="/signup">
            <Button size="lg" variant="outline" className="bg-white text-dicey-purple hover:bg-dicey-purple-light hover:text-dicey-purple">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dicey-gray-dark text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center gap-2 mb-4">
                <Dice3D size="sm" />
                <span className="font-bold text-xl">DiceyDecisions</span>
              </div>
              <p className="max-w-xs text-gray-400">
                Making group decisions fun and fair through games of chance.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">How It Works</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Support</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center md:text-left text-gray-400">
            <p>&copy; {new Date().getFullYear()} DiceyDecisions. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
