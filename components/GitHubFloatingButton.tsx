export function GitHubFloatingButton() {
  return (
    <div className="fixed bottom-5 left-5 z-40 hidden flex-col gap-3 sm:flex">
      <a
        aria-label="Email Xulin Fu"
        className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.035] text-white/66 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-md transition duration-300 hover:scale-105 hover:border-antique/45 hover:bg-white/[0.07] hover:text-white"
        href="mailto:xulinfu2002@gmail.com"
      >
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path d="M4.75 6.75h14.5v10.5H4.75z" />
          <path d="m5.25 7.25 6.75 5 6.75-5" />
        </svg>
      </a>
      <a
        aria-label="Open Xulin Fu on GitHub"
        className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.035] text-white/66 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-md transition duration-300 hover:scale-105 hover:border-mist/45 hover:bg-white/[0.07] hover:text-white"
        href="https://github.com/oasisfxl"
        rel="noreferrer"
        target="_blank"
      >
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.48 2 2 6.58 2 12.24c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49 0-.24-.01-1.05-.01-1.9-2.51.47-3.16-.63-3.36-1.2-.11-.29-.6-1.2-1.03-1.44-.35-.19-.85-.66-.01-.67.79-.01 1.35.74 1.54 1.05.9 1.55 2.34 1.12 2.91.85.09-.67.35-1.12.64-1.38-2.22-.26-4.55-1.14-4.55-5.05 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.22 9.22 0 0 1 12 6.99c.85 0 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.92-2.34 4.79-4.57 5.05.36.32.68.93.68 1.89 0 1.37-.01 2.47-.01 2.8 0 .27.18.59.69.49A10.1 10.1 0 0 0 22 12.24C22 6.58 17.52 2 12 2Z" />
        </svg>
      </a>
    </div>
  );
}
