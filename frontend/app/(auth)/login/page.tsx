import Link from 'next/link';
import { Button, ButtonLink } from '../../../components/ui/Button';

const features = [
  'Share dev insights and project updates',
  'Discover peer-reviewed coding resources',
  'Join collaborative study circles',
];

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_32%),linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#111827_100%)] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl">
        <section className="hidden w-[45%] flex-col justify-between bg-slate-900/70 p-8 lg:flex">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">DevCommunity</p>
            <h1 className="mt-6 text-4xl font-semibold leading-tight text-white">
              Build, learn, and grow with a network of developers.
            </h1>
            <p className="mt-4 max-w-md text-base text-slate-300">
              Log in to keep your ideas moving, find mentors, and stay connected with the builders shaping tomorrow.
            </p>
          </div>

          <div className="space-y-3 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
            {features.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-300" />
                <p className="text-sm text-slate-200">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex-1 p-6 sm:p-8 lg:p-10">
          <div className="mx-auto flex h-full max-w-md flex-col justify-center">
            <div className="mb-8">
              <p className="text-sm font-medium text-cyan-300">Welcome back</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Sign in to your account</h2>
              <p className="mt-2 text-sm text-slate-400">
                Continue the conversation with your fellow builders.
              </p>
            </div>

            <form className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-slate-300" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@devmail.com"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none ring-0 transition focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center justify-between text-sm text-slate-400">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-slate-900" />
                  Remember me
                </label>
                <Link href="#" className="text-cyan-300 transition hover:text-cyan-200">
                  Forgot password?
                </Link>
              </div>

              <Button className="w-full">Sign in</Button>
            </form>

            <div className="my-6 flex items-center gap-3 text-sm text-slate-500">
              <div className="h-px flex-1 bg-white/10" />
              <span>or</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <Button variant="secondary" className="w-full">
              Continue with GitHub
            </Button>

            <p className="mt-8 text-center text-sm text-slate-400">
              New here?{' '}
              <ButtonLink href="/register" variant="ghost" className="px-0 py-0 text-cyan-300 hover:text-cyan-200">
                Create an account
              </ButtonLink>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
