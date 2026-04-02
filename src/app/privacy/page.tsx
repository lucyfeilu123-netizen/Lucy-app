export default function PrivacyPage() {
  return (
    <div className="min-h-dvh bg-[var(--bg-base)] px-6 py-12 max-w-2xl mx-auto">
      <h1
        className="text-3xl font-bold text-[var(--fg)] mb-8"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        Privacy Policy
      </h1>

      <div className="space-y-6 text-sm text-[var(--fg-quiet)] leading-relaxed">
        <p><strong className="text-[var(--fg)]">Last updated:</strong> April 2, 2026</p>

        <section>
          <h2 className="text-lg font-semibold text-[var(--fg)] mb-2">What We Collect</h2>
          <p>When you sign in with Google or GitHub, we receive your email address and display name. We use this solely to identify your account and sync your data across devices.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--fg)] mb-2">How We Use Your Data</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Authenticate your account</li>
            <li>Store your tasks, lists, and timer settings</li>
            <li>Sync data across your devices</li>
          </ul>
          <p className="mt-2">We do not sell, share, or use your data for advertising.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--fg)] mb-2">Data Storage</h2>
          <p>Your data is stored securely on Supabase (hosted on AWS). Task data is stored locally on your device and optionally synced to the cloud when you sign in.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--fg)] mb-2">Third-Party Services</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Supabase</strong> — Authentication and database</li>
            <li><strong>Vercel</strong> — Hosting</li>
            <li><strong>Google OAuth</strong> — Sign in with Google</li>
            <li><strong>GitHub OAuth</strong> — Sign in with GitHub</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--fg)] mb-2">Your Rights</h2>
          <p>You can delete your account and all associated data at any time by contacting us. You can also clear your local data from the app settings.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--fg)] mb-2">Contact</h2>
          <p>Questions? Email <a href="mailto:lucyfeilu@gmail.com" className="text-[var(--accent)] hover:underline">lucyfeilu@gmail.com</a></p>
        </section>
      </div>
    </div>
  );
}
