import { Github, Twitter, Mail, Heart, Shield, FileText, Users, DollarSign } from 'lucide-react'

const links = [
  { icon: Users,      label: 'Client Management' },
  { icon: DollarSign, label: 'Invoicing' },
  { icon: FileText,   label: 'Meeting Notes' },
  { icon: Shield,     label: 'Secure & Private' },
]

export default function AuthFooter() {
  return (
    <footer className="bg-gray-900 text-gray-400 px-6 py-10 md:py-12">
      <div className="max-w-6xl mx-auto">

        {/* Top row */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-8">

          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <img src="/icon.png" alt="FreelanceFlow" className="w-8 h-8 rounded-lg" />
              <span className="text-white font-bold text-lg">FreelanceFlow</span>
            </div>
            <p className="text-sm leading-relaxed">
              The all-in-one CRM built specifically for freelancers. Manage clients, track projects, send invoices, and grow your business — all from one place.
            </p>
          </div>

          {/* Features */}
          <div>
            <p className="text-white text-sm font-semibold mb-3">Features</p>
            <ul className="space-y-2">
              {links.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2 text-sm">
                  <Icon size={13} className="text-primary-400" />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          {/* Tech stack */}
          <div>
            <p className="text-white text-sm font-semibold mb-3">Built With</p>
            <ul className="space-y-1.5 text-sm">
              <li>⚛️ React 18 + Vite</li>
              <li>🟢 Node.js + Express</li>
              <li>🍃 MongoDB + Mongoose</li>
              <li>🎨 Tailwind CSS</li>
              <li>🔐 JWT Authentication</li>
            </ul>
          </div>

          {/* Contact / social */}
          <div>
            <p className="text-white text-sm font-semibold mb-3">Connect</p>
            <div className="flex flex-col gap-2 text-sm">
              <a href="mailto:support@freelanceflow.app" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail size={13} /> support@freelanceflow.app
              </a>
              <a href="#" className="flex items-center gap-2 hover:text-white transition-colors">
                <Github size={13} /> GitHub Repository
              </a>
              <a href="#" className="flex items-center gap-2 hover:text-white transition-colors">
                <Twitter size={13} /> @FreelanceFlow
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>© {new Date().getFullYear()} FreelanceFlow. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart size={11} className="fill-red-500 text-red-500 mx-0.5" /> for freelancers everywhere
          </p>
        </div>

      </div>
    </footer>
  )
}
