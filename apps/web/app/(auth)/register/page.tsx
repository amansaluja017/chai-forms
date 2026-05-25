import { SignupForm } from "~/components/signup-form";

function RegisterPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background py-10">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -left-[10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px] mix-blend-screen opacity-50"></div>
        <div className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-chart-2/20 blur-[120px] mix-blend-screen opacity-50"></div>
        
        {/* Subtle radial gradient to focus center */}
        <div className="absolute inset-0 bg-radial from-transparent to-background/80"></div>
      </div>
      
      {/* Content */}
      <div className="z-10 w-full max-w-[420px] px-4 animate-in fade-in zoom-in-95 duration-700">
        <SignupForm />
      </div>
    </main>
  );
}

export default RegisterPage;
