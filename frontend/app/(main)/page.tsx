import React from 'react'

const page = () => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="https://www.pexels.com/download/video/38286247/"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]" />

      <section className="relative z-10 flex min-h-screen items-center justify-center px-6 py-20 sm:px-8 lg:px-12">
        <div className="w-full max-w-6xl rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <span className="inline-flex rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-200">
                Dynamic experience
              </span>
              <div className="space-y-3">
                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                  Build bold interfaces with cinematic motion.
                </h1>
                <p className="max-w-xl text-lg text-slate-200 sm:text-xl">
                  A polished landing experience that blends immersive video, modern typography, and clear actions in one focused layout.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#"
                  className="rounded-full bg-cyan-400 px-5 py-3 font-medium text-slate-950 transition hover:bg-cyan-300"
                >antia   Start exploring</a>
                <a href="#" className="rounded-full border border-white/20 px-5 py-3 font-medium text-white transition hover:bg-white/10">
                  View features
                </a>
              </div>
            </div>

            <div className="rounded-3xl border border-white/15 bg-slate-950/40 p-5 shadow-lg shadow-black/20">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: 'Live visuals', value: '24/7' },
                  { label: 'Fast delivery', value: 'Instant' },
                  { label: 'Creative focus', value: '100%' },
                  { label: 'Engagement', value: 'High' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                    <p className="text-sm text-slate-300">{item.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default page
