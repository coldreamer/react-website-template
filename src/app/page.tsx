import { ConversionForm } from "@/components/features/ConversionForm";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black py-12 px-4 sm:px-6 lg:px-8">
      <main className="w-full">
        <ConversionForm />
      </main>
    </div>
  );
}
