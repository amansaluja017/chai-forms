"use client";

import Link from "next/link";
import { useGetPublicForms } from "~/hooks/api/form/form.hook";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { IconWand, IconArrowRight, IconEye, IconUser, IconCalendar } from "@tabler/icons-react";
import { ThemeToggle } from "~/components/theme-toggle";
import { format } from "date-fns";

export default function ExplorePage() {
  const { data: publicForms, isLoading } = useGetPublicForms();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <IconWand className="size-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tight">Chai Forms</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">Home</Link>
            <Link href="/explore" className="transition-colors text-foreground font-semibold">Explore</Link>
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

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Explore Public Forms
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Discover and fill out forms created by the Chai Forms community.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <Spinner className="size-10 text-primary" />
          </div>
        ) : !publicForms || publicForms.length === 0 ? (
          <div className="text-center py-24 bg-muted/30 rounded-2xl border border-dashed">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <IconWand className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No forms found</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              It looks like there aren't any public forms available right now. Be the first to publish one!
            </p>
            <Link href="/register">
              <Button>Create a Form</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicForms.map((form) => (
              <Card key={form.id} className="flex flex-col h-full hover:shadow-lg transition-shadow border-muted">
                <CardHeader>
                  <CardTitle className="line-clamp-1" title={form.title}>{form.title}</CardTitle>
                  <CardDescription className="line-clamp-2 h-10" title={form.description || ""}>
                    {form.description || "No description provided."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <IconUser className="size-4" />
                      <span>{form.creatorName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconCalendar className="size-4" />
                      <span>{form.createdAt ? format(new Date(form.createdAt), "MMM d, yyyy") : "Unknown date"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconEye className="size-4" />
                      <span>{form.views} views</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/f/${form.id}`} className="w-full">
                    <Button className="w-full group">
                      Fill out form
                      <IconArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t py-12 bg-background mt-auto">
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
