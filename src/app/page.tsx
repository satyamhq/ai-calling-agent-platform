import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PhoneCall, Bot, Zap, BarChart, Check } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between p-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <PhoneCall className="w-6 h-6 text-primary" />
          <span className="font-serif text-2xl tracking-tight text-foreground">Callify</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Log in
          </Link>
          <Link href="/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="py-24 px-6 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Now with Vapi Integration
          </div>
          <h1 className="font-serif text-6xl md:text-8xl text-foreground leading-[1.1] mb-6">
            Your AI Calls.<br />
            <span className="italic text-primary">While You Sleep.</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Callify automates outbound calls with voice AI. Powered by Vapi, Twilio & Make.com to scale your outreach infinitely.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full">
                Start Free — 10 Calls Included
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full">
              See Demo
            </Button>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 bg-secondary/50 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="bg-card p-8 rounded-2xl border shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-2xl mb-3">AI Voice Agents</h3>
                <p className="text-muted-foreground">Lifelike conversational agents that understand context, handle objections, and book meetings for you.</p>
              </div>
              <div className="bg-card p-8 rounded-2xl border shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-2xl mb-3">Smart Automations</h3>
                <p className="text-muted-foreground">Trigger calls automatically from your CRM or Make.com webhooks based on user actions.</p>
              </div>
              <div className="bg-card p-8 rounded-2xl border shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <BarChart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-2xl mb-3">Real-time Analytics</h3>
                <p className="text-muted-foreground">Track sentiment, read transcripts, and listen to recordings of every call made by your agents.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="font-serif text-4xl md:text-5xl mb-16">How it works</h2>
            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-border -z-10"></div>
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-card border-2 border-primary rounded-full flex items-center justify-center font-serif text-4xl text-primary mb-6 bg-background">1</div>
                <h4 className="text-xl font-bold mb-2">Create Agent</h4>
                <p className="text-muted-foreground">Define your agent's personality, voice, and system prompt.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-card border-2 border-primary rounded-full flex items-center justify-center font-serif text-4xl text-primary mb-6 bg-background">2</div>
                <h4 className="text-xl font-bold mb-2">Upload Contacts</h4>
                <p className="text-muted-foreground">Import your list of leads via CSV or CRM integration.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-card border-2 border-primary rounded-full flex items-center justify-center font-serif text-4xl text-primary mb-6 bg-background">3</div>
                <h4 className="text-xl font-bold mb-2">Launch Campaign</h4>
                <p className="text-muted-foreground">Hit start and watch your AI agents make hundreds of calls.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-24 bg-foreground text-background px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl mb-4">Simple, transparent pricing</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">No hidden fees. Just pay for the credits you use.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Starter */}
              <div className="bg-card text-card-foreground p-8 rounded-3xl border border-border">
                <h3 className="font-serif text-2xl mb-2">Starter</h3>
                <div className="mb-6">
                  <span className="font-serif text-5xl">$19</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" /> 100 Call Credits</li>
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" /> 1 AI Voice Agent</li>
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" /> Basic Analytics</li>
                </ul>
                <Button className="w-full h-12 text-lg rounded-xl" variant="outline">Start Free Trial</Button>
              </div>

              {/* Pro */}
              <div className="bg-primary text-primary-foreground p-8 rounded-3xl relative transform md:-translate-y-4 shadow-xl">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-background text-foreground px-4 py-1 rounded-full text-sm font-bold">
                  Most Popular
                </div>
                <h3 className="font-serif text-2xl mb-2">Pro</h3>
                <div className="mb-6">
                  <span className="font-serif text-5xl">$49</span>
                  <span className="text-primary-foreground/80">/mo</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3"><Check className="w-5 h-5" /> 500 Call Credits</li>
                  <li className="flex items-center gap-3"><Check className="w-5 h-5" /> Unlimited Agents</li>
                  <li className="flex items-center gap-3"><Check className="w-5 h-5" /> CRM Integrations</li>
                  <li className="flex items-center gap-3"><Check className="w-5 h-5" /> Webhooks</li>
                </ul>
                <Button className="w-full h-12 text-lg rounded-xl bg-background text-foreground hover:bg-background/90">Upgrade to Pro</Button>
              </div>

              {/* Enterprise */}
              <div className="bg-card text-card-foreground p-8 rounded-3xl border border-border">
                <h3 className="font-serif text-2xl mb-2">Enterprise</h3>
                <div className="mb-6">
                  <span className="font-serif text-5xl">$149</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" /> 2000 Call Credits</li>
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" /> Custom Voice Cloning</li>
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" /> Priority Support</li>
                </ul>
                <Button className="w-full h-12 text-lg rounded-xl" variant="outline">Contact Sales</Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border text-center text-muted-foreground">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <PhoneCall className="w-5 h-5" />
            <span className="font-serif text-xl tracking-tight">Callify</span>
          </div>
          <p>© {new Date().getFullYear()} Callify Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
