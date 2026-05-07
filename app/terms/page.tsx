export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10">

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
            Terms & Conditions
          </h1>

          <p className="mt-5 text-lg leading-8 text-gray-600 dark:text-gray-400 max-w-3xl">
            These Terms & Conditions govern your access to and use of
            CloudNest. By creating an account or using our platform,
            you agree to comply with these terms.
          </p>

          <p className="mt-3 text-sm text-gray-500 dark:text-gray-500">
            Last Updated: May 2026
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6">

          {/* Acceptance */}
          <section className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-8">

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Acceptance of Terms
            </h2>

            <p className="mt-4 leading-7 text-gray-700 dark:text-gray-300">
              By accessing or using CloudNest, you confirm that you have
              read, understood, and agreed to these Terms & Conditions.
              If you do not agree with any part of these terms, you
              should discontinue using the platform immediately.
            </p>

          </section>

          {/* User Responsibilities */}
          <section className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-8">

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              User Responsibilities
            </h2>

            <p className="mt-4 text-gray-700 dark:text-gray-300 leading-7">
              Users are responsible for maintaining the security and
              lawful use of their CloudNest account.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">

              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-5">

                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Allowed Usage
                </h3>

                <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Store personal or professional files</li>
                  <li>• Organize folders and documents</li>
                  <li>• Access files securely across devices</li>
                </ul>

              </div>

              <div className="rounded-2xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 p-5">

                <h3 className="font-semibold text-red-700 dark:text-red-400">
                  Prohibited Activities
                </h3>

                <ul className="mt-3 space-y-2 text-sm text-red-700 dark:text-red-300">
                  <li>• Uploading illegal or harmful content</li>
                  <li>• Distributing malware or viruses</li>
                  <li>• Violating copyright laws</li>
                  <li>• Attempting unauthorized access</li>
                </ul>

              </div>

            </div>
          </section>

          {/* Account Security */}
          <section className="rounded-3xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/20 p-8">

            <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-400">
              Account Security
            </h2>

            <p className="mt-4 text-blue-900 dark:text-blue-200 leading-7">
              You are responsible for maintaining the confidentiality
              of your account credentials and activities associated
              with your account.
            </p>

            <div className="mt-6 space-y-3 text-blue-900 dark:text-blue-200">
              <p>
                • Use a strong and secure password
              </p>

              <p>
                • Do not share your account credentials
              </p>

              <p>
                • Notify us immediately of unauthorized access
              </p>

              <p>
                • Regularly review your account activity
              </p>
            </div>

          </section>

          {/* Storage */}
          <section className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-8">

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Storage Limits
            </h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">

              <div className="rounded-2xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 p-5">

                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Free Plan
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  Free accounts currently receive up to 15 GB of cloud
                  storage space.
                </p>

              </div>

              <div className="rounded-2xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 p-5">

                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Usage Monitoring
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  Users are responsible for managing their storage usage
                  and removing unnecessary files when required.
                </p>

              </div>

            </div>

          </section>

          {/* Intellectual Property */}
          <section className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-8">

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Intellectual Property
            </h2>

            <p className="mt-4 leading-7 text-gray-700 dark:text-gray-300">
              Users retain ownership of their uploaded content.
              However, you must ensure that any content uploaded to
              CloudNest does not violate intellectual property rights,
              copyright laws, or third-party agreements.
            </p>

          </section>

          {/* Suspension */}
          <section className="rounded-3xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/20 p-8">

            <h2 className="text-2xl font-semibold text-amber-700 dark:text-amber-400">
              Suspension & Termination
            </h2>

            <p className="mt-4 leading-7 text-amber-900 dark:text-amber-200">
              CloudNest reserves the right to suspend or permanently
              terminate accounts that violate these terms, abuse the
              platform, or engage in activities that may compromise
              security or service stability.
            </p>

            <div className="mt-6 space-y-3 text-amber-900 dark:text-amber-200">
              <p>
                • Accounts violating policies may be restricted
              </p>

              <p>
                • Illegal activities may be reported to authorities
              </p>

              <p>
                • Severe violations may result in permanent bans
              </p>
            </div>

          </section>

          {/* Disclaimer */}
          <section className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-8">

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Service Disclaimer
            </h2>

            <p className="mt-4 leading-7 text-gray-700 dark:text-gray-300">
              CloudNest is provided on an “as available” basis.
              While we strive to maintain secure and reliable services,
              we do not guarantee uninterrupted access, error-free
              operation, or permanent data availability under all
              circumstances.
            </p>

          </section>

          {/* Updates */}
          <section className="rounded-3xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950/20 p-8">

            <h2 className="text-2xl font-semibold text-indigo-700 dark:text-indigo-400">
              Updates to Terms
            </h2>

            <p className="mt-4 leading-7 text-indigo-900 dark:text-indigo-200">
              These Terms & Conditions may be updated periodically to
              reflect legal, security, or service changes. Continued
              use of CloudNest after updates means you accept the
              revised terms.
            </p>

          </section>

          {/* Contact */}
          <section className="rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-600 p-8 text-white">

            <h2 className="text-3xl font-bold">
              Contact Information
            </h2>

            <p className="mt-3 text-indigo-100 leading-7 max-w-2xl">
              If you have questions regarding these Terms &
              Conditions, please contact our support team for further
              clarification.
            </p>

            <div className="mt-6 inline-flex flex-col rounded-2xl border border-white/20 bg-white/10 px-5 py-4">

              <span className="text-sm text-indigo-100">
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