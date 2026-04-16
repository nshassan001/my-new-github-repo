import Link from "next/link";
import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">RankSpark</span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              AI-powered ranking platform. Create, discover, and debate the best
              rankings on any topic.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/explore" className="hover:text-white transition-colors">
                  Explore
                </Link>
              </li>
              <li>
                <Link href="/rankings" className="hover:text-white transition-colors">
                  Rankings
                </Link>
              </li>
              <li>
                <Link href="/create" className="hover:text-white transition-colors">
                  Create
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Account</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/auth/signin" className="hover:text-white transition-colors">
                  Sign in
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="hover:text-white transition-colors">
                  Sign up
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-white transition-colors">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-sm text-center">
          <p>© {new Date().getFullYear()} RankSpark. Powered by Claude AI.</p>
        </div>
      </div>
    </footer>
  );
}
