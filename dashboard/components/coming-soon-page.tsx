import Link from "next/link";
import { Orbitron, Rajdhani, Share_Tech_Mono } from "next/font/google";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});
const shareTechMono = Share_Tech_Mono({ subsets: ["latin"], weight: "400" });
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

type ComingSoonPageProps = {
  title: string;
  description: string;
};

export function ComingSoonPage({ title, description }: ComingSoonPageProps) {
  return (
    <main
      className={`${rajdhani.className} min-h-screen bg-[radial-gradient(circle_at_top,_#101b3d_0%,_#050814_58%,_#020408_100%)] text-white`}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-20">
        <div className="rounded-3xl border border-white/15 bg-black/40 p-8 backdrop-blur-xl md:p-12">
          <p className={`${shareTechMono.className} mb-4 text-xs tracking-[0.3em] text-white/60`}>
            ACTUMX
          </p>
          <h1 className={`${orbitron.className} text-4xl uppercase leading-tight md:text-6xl`}>
            {title}
          </h1>
          <p className={`${shareTechMono.className} mt-5 max-w-2xl text-sm leading-7 text-white/75 md:text-base`}>
            {description}
          </p>
          <div className={`${shareTechMono.className} mt-10 flex flex-wrap gap-3`}>
            <Link
              href="/"
              className="inline-flex items-center border border-white/35 px-5 py-2 text-xs uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-black"
            >
              Back to Home
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center bg-[#4d6fff] px-5 py-2 text-xs uppercase tracking-[0.16em] text-white transition hover:bg-[#3659ff]"
            >
              Launch App
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
