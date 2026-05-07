export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 mb-5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />

            <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
              Legal & Privacy
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
            Privacy Policy
          </h1>

          <p className="mt-5 text-lg leading-8 text-gray-600 dark:text-gray-400 max-w-3xl">
            Your privacy is important to us. This Privacy Policy explains
            how CloudNest collects, uses, stores, and protects your
            information when you use our cloud storage platform.
          </p>

          <p className="mt-3 text-sm text-gray-500 dark:text-gray-500">
            Last Updated: May 2026
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6">

          {/* Section */}
          <section className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Information We Collect
            </h2>

            <p className="mt-4 text-gray-700 dark:text-gray-300 leading-7">
              To provide secure cloud storage services, CloudNest may collect
              certain information associated with your account and usage.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">

              <div className="rounded-2xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 p-5">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Account Information
                </h3>

                <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Name</li>
                  <li>• Email address</li>
                </ul>
              </div>

              <div className="rounded-2xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 p-5">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Storage Data
                </h3>

                <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Uploaded files & folders</li>
                  <li>• File metadata</li>
                  <li>• Storage usage statistics</li>
                </ul>
              </div>

            </div>
          </section>

          {/* Section */}
          <section className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              How We Use Your Information
            </h2>

            <div className="mt-5 space-y-4 text-gray-700 dark:text-gray-300 leading-7">
              <p>
                CloudNest uses your information only for providing and
                improving our services.
              </p>

              <ul className="space-y-3">
                <li>
                  • To securely store and manage your files
                </li>

                <li>
                  • To authenticate and protect your account
                </li>

                <li>
                  • To sync your files across devices
                </li>

                <li>
                  • To improve service reliability and user experience
                </li>

                <li>
                  • To respond to support requests and security concerns
                </li>
              </ul>
            </div>
          </section>

          {/* Security */}
          <section className="rounded-3xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/20 p-8">

            <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-400">
              Security & Data Protection
            </h2>

            <p className="mt-4 text-blue-900 dark:text-blue-200 leading-7">
              We take reasonable security measures to protect your personal
              information and stored files from unauthorized access,
              disclosure, or loss.
            </p>

            <div className="mt-6 space-y-3 text-blue-900 dark:text-blue-200">
              <p>
                • Authentication is securely managed using Firebase
                Authentication
              </p>

              <p>
                • Files are stored using protected cloud infrastructure
              </p>

              <p>
                • Encrypted connections are used during data transfer
              </p>

              <p>
                • Access to account data is restricted to authorized users only
              </p>
            </div>
          </section>

          {/* User Rights */}
          <section className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-8">

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Your Rights
            </h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">

              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-5">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Access & Control
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  You can access, manage, update, or delete your account data
                  directly through your CloudNest account settings.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-5">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Account Deletion
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  You can permanently delete your account at any time from the
                  Help & Security Center.
                </p>
              </div>

            </div>
          </section>

          {/* Third Party */}
          <section className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-8">

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Third-Party Services
            </h2>

            <p className="mt-4 text-gray-700 dark:text-gray-300 leading-7">
              CloudNest uses trusted third-party services such as Firebase
              for authentication, cloud storage, and database management.
              These services may process limited information required to
              provide the platform functionality securely.
            </p>
          </section>

          {/* Policy Updates */}
          <section className="rounded-3xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/20 p-8">

            <h2 className="text-2xl font-semibold text-amber-700 dark:text-amber-400">
              Policy Updates
            </h2>

            <p className="mt-4 text-amber-900 dark:text-amber-200 leading-7">
              This Privacy Policy may be updated periodically to reflect
              improvements, security updates, or legal requirements.
              Continued use of CloudNest after changes means you agree to the
              updated policy.
            </p>
          </section>

          {/* Contact */}
          <section className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">

            <h2 className="text-3xl font-bold">
              Contact Us
            </h2>

            <p className="mt-3 text-blue-100 leading-7 max-w-2xl">
              If you have questions, concerns, or requests related to this
              Privacy Policy or your personal data, please contact our support
              team.
            </p>

            <div className="mt-6 inline-flex flex-col rounded-2xl border border-white/20 bg-white/10 px-5 py-4">
              <span className="text-sm text-blue-100">
                Support Email
              </span>

              <a
                href="mailto:support@cloudnest.com"
                className="mt-1 text-lg font-semibold hover:underline"
              >
                support@cloudnest.com
              </a>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}