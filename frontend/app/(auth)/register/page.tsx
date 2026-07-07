import Link from 'next/link';
import { Button, ButtonLink } from '../../../components/ui/Button';

const perks = [
  'Launch your profile in minutes',
  'Join coding circles and hackathons',
  'Showcase your projects to peers',
];

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.14),_transparent_32%),linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#111827_100%)] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl">
        <section className="hidden w-[45%] flex-col justify-between bg-slate-900/70 p-8 lg:flex">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">Join the circle</p>
            <h1 className="mt-6 text-4xl font-semibold leading-tight text-white">
              Start building your developer identity today.
            </h1>
            <p className="mt-4 max-w-md text-base text-slate-300">
              Create a profile to share ideas, get feedback, and connect with passionate developers from around the world.
            </p>
          </div>

          <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            {perks.map((item) => (
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
              <p className="text-sm font-medium text-cyan-300">Create account</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Join DevCommunity</h2>
              <p className="mt-2 text-sm text-slate-400">
                Make your mark in a community built for curious minds.
              </p>
            </div>

            <form className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-slate-300" htmlFor="firstName">
                    First name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="Ava"
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-slate-300" htmlFor="lastName">
                    Last name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Nguyen"
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300" htmlFor="username">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="a.nguyen"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@devmail.com"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                />
              </div>

              <div className="text-sm text-slate-400">
                By creating an account, you agree to our{' '}
                <Link href="#" className="text-cyan-300 transition hover:text-cyan-200">
                  terms and privacy policy
                </Link>
              </div>

              <Button className="w-full">Create account</Button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-400">
              Already part of the community?{' '}
              <ButtonLink href="/login" variant="ghost" className="px-0 py-0 text-cyan-300 hover:text-cyan-200">
                Sign in
              </ButtonLink>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
