import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { IconCheck, IconDeviceDesktopAnalytics, IconDragDrop, IconFileSettings, IconRocket, IconStarFilled, IconWand } from "@tabler/icons-react";
import { ThemeToggle } from "~/components/theme-toggle";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <IconWand className="size-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tight">Chai Forms</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="#how-it-works" className="transition-colors hover:text-foreground/80 text-foreground/60">How it Works</Link>
            <Link href="#reviews" className="transition-colors hover:text-foreground/80 text-foreground/60">Reviews</Link>
            <Link href="#pricing" className="transition-colors hover:text-foreground/80 text-foreground/60">Pricing</Link>
            <Link href="/explore" className="transition-colors hover:text-foreground/80 text-foreground font-semibold">Explore</Link>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" className="hidden sm:inline-flex">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden py-24 lg:py-32">
          <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary opacity-20 blur-[100px]"></div>
          </div>
          
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 mb-6">
              ✨ The easiest way to build forms
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
              Build beautiful forms <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">in seconds, not hours.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Create, share, and analyze forms with our intuitive drag-and-drop builder. No coding required. Start collecting data beautifully today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto text-base gap-2 group h-12 px-8">
                  Start for free
                  <IconRocket className="size-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base h-12 px-8">
                  See how it works
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">How it works</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Three simple steps to go from idea to collecting valuable insights.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="bg-background/60 backdrop-blur-sm border-white/10 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                    <IconDragDrop className="size-6" />
                  </div>
                  <CardTitle>1. Drag & Drop</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Build your form visually using our intuitive builder. Add inputs, multiple choice, file uploads, and more with just a click.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-background/60 backdrop-blur-sm border-white/10 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-4">
                    <IconFileSettings className="size-6" />
                  </div>
                  <CardTitle>2. Customize</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Style your form to match your brand. Customize colors, logic, and settings. Then share it with the world instantly via link.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-background/60 backdrop-blur-sm border-white/10 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                    <IconDeviceDesktopAnalytics className="size-6" />
                  </div>
                  <CardTitle>3. Analyze</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Watch responses roll in real-time. View detailed analytics, charts, and export your raw data to Excel for further processing.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* REVIEWS SECTION */}
        <section id="reviews" className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Loved by creators everywhere</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                See what our users have to say about their experience with Chai Forms.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                { name: "Sarah Jenkins", role: "Marketing Director", text: "Chai Forms completely changed how we collect user feedback. The analytics dashboard is incredible." },
                { name: "Alex Chen", role: "Startup Founder", text: "I built our entire waitlist flow in 5 minutes. The interface is stunning and it just works out of the box." },
                { name: "Emily Rodriguez", role: "Event Organizer", text: "Finally, a form builder that doesn't look like it was made in 1999. My attendees actually enjoy filling these out." }
              ].map((review, i) => (
                <Card key={i} className="bg-muted/40 border-none shadow-sm">
                  <CardHeader>
                    <div className="flex gap-1 mb-2 text-yellow-500">
                      {[...Array(5)].map((_, j) => <IconStarFilled key={j} className="size-4" />)}
                    </div>
                    <CardTitle className="text-lg">{review.name}</CardTitle>
                    <CardDescription>{review.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="italic text-muted-foreground">"{review.text}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* SUBSCRIPTION SECTION */}
        <section id="pricing" className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Simple, transparent pricing</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Choose the perfect plan for your needs. No hidden fees.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
              {/* BASIC PLAN */}
              <Card className="relative overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-2xl">Basic</CardTitle>
                  <CardDescription>Perfect for personal projects</CardDescription>
                  <div className="mt-4 flex items-baseline text-4xl font-extrabold">
                    $0
                    <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {["Up to 3 forms", "100 responses/month", "Basic analytics", "Standard templates"].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <IconCheck className="size-4 text-green-500" /> {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline">Get Started</Button>
                </CardFooter>
              </Card>

              {/* STANDARD PLAN */}
              <Card className="relative overflow-hidden border-primary shadow-xl shadow-primary/10 md:-translate-y-4">
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                  Popular
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl">Standard</CardTitle>
                  <CardDescription>For growing businesses</CardDescription>
                  <div className="mt-4 flex items-baseline text-4xl font-extrabold">
                    $19
                    <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {["Unlimited forms", "5,000 responses/month", "Advanced analytics & charts", "Data export (CSV/XLSX)", "Remove Chai Forms branding"].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <IconCheck className="size-4 text-primary" /> {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Upgrade to Standard</Button>
                </CardFooter>
              </Card>

              {/* PREMIUM PLAN */}
              <Card className="relative overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-2xl">Premium</CardTitle>
                  <CardDescription>For power users & teams</CardDescription>
                  <div className="mt-4 flex items-baseline text-4xl font-extrabold">
                    $49
                    <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {["Everything in Standard", "Unlimited responses", "Custom domains", "Webhooks & API access", "Priority 24/7 support"].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <IconCheck className="size-4 text-purple-500" /> {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline">Contact Sales</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t py-12 bg-background">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1 rounded-md">
              <IconWand className="size-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">Chai Forms</span>
          </div>
          
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
          
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Chai Forms. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
