
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthForm } from "@/components/auth/AuthForm";
import { Dice3D } from "@/components/ui/dice-3d";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-dicey-purple-light/10 flex flex-col">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Dice3D size="sm" />
          <span className="font-bold text-xl">DiceyDecisions</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <AuthForm />
      </main>

      <footer className="py-6 text-center text-sm text-dicey-gray-dark/60">
        <p>&copy; {new Date().getFullYear()} DiceyDecisions. All rights reserved.</p>
      </footer>
    </div>
  );
}
