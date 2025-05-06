
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dice3D } from "@/components/ui/dice-3d";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-dicey-purple-light/10 flex flex-col">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Dice3D size="sm" />
          <span className="font-bold text-xl">DiceyDecisions</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="auth-container text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-dicey-purple/10 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 text-dicey-purple"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
          <p className="text-dicey-gray-dark/80 mb-6">
            We've sent a verification link to your email address.
            Please click that link to complete your registration.
          </p>
          
          <div className="bg-dicey-purple-light/10 rounded-lg p-4 mb-6 text-left">
            <p className="font-medium mb-1">Didn't receive an email?</p>
            <ul className="text-sm text-dicey-gray-dark/80 space-y-2">
              <li>• Check your spam or junk folder</li>
              <li>• Verify you entered the correct email address</li>
              <li>• Wait a few minutes and refresh your inbox</li>
            </ul>
          </div>
          
          <Button className="w-full mb-4">Resend Verification Email</Button>
          <Link to="/login" className="text-dicey-purple hover:underline text-sm">
            Return to Login
          </Link>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-dicey-gray-dark/60">
        <p>&copy; {new Date().getFullYear()} DiceyDecisions. All rights reserved.</p>
      </footer>
    </div>
  );
}
