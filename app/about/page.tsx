import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About Keep Media Public</h1>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What This Is</h2>
            <p className="text-gray-700 mb-4">
              <b>Keep Media Public</b> is a website that helps you identify and donate to public media stations in need.
              It makes it easy to support your local station as well as stations across the country most dependent
              on federal funding.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why This Exists</h2>
            <p className="text-gray-700 mb-4">
              On September 30, 2025, the Corporation for Public Broadcasting (CPB) shut down after
              nearly 60 years of supporting public media. Over 1,500 public TV and radio stations
              that relied on CPB funding now face an existential crisis.
            </p>
            <p className="text-gray-700 mb-4">
              When CPB funding vanished, many people wanted to help but didn&apos;t know which stations needed support most urgently.
              <b>Keep Media Public</b> solves this by making station financial data accessible and actionable, helping donors direct their
              support where it&apos;s needed most.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-700 mb-4">
              Enter your ZIP code or station call sign, and the site shows you:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Your nearest local stations with direct donation links</li>
              <li>Stations in critical need across the country</li>
              <li>Each station&apos;s dependency on CPB funding (when available)</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Clicking &ldquo;Donate Now&rdquo; takes you directly to the station&apos;s donation page. All contributions go straight to the
              stations—<b>Keep Media Public</b> takes no fees or commissions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Calculate Risk</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <p className="text-yellow-800 font-medium">
                <strong>Note:</strong> Risk profiles are currently estimated as we continue to gather and validate
                operational funding data from stations. We have confirmed CPB grant amounts but are still collecting
                total revenue figures needed to calculate precise dependency percentages.
              </p>
            </div>
            <p className="text-gray-700 mb-4">
              We assess each station&apos;s vulnerability to the loss of CPB funding using publicly available
              financial data from station annual reports (fiscal year 2024). Our risk tiers will be based on:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>
                <strong>CPB Revenue Share:</strong> The percentage of a station&apos;s total revenue that
                came from CPB grants (before the shutdown)
              </li>
              <li>
                <strong>Geographic Isolation:</strong> Stations in rural areas often serve as the
                primary news source for their communities
              </li>
              <li>
                <strong>Market Size:</strong> Smaller markets typically have fewer alternative funding
                sources
              </li>
            </ul>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">Planned Risk Tiers:</h3>
              <ul className="space-y-2 text-gray-700">
                <li><strong className="text-red-700">Critical:</strong> 50%+ CPB dependent - station survival uncertain without immediate community support</li>
                <li><strong className="text-orange-700">High:</strong> 35-50% CPB dependent - significant service cuts or closures likely</li>
                <li><strong className="text-yellow-700">Moderate:</strong> 20-35% CPB dependent - major restructuring required</li>
                <li><strong className="text-green-700">Stable:</strong> &lt;20% CPB dependent - better positioned with diverse funding sources</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Transparency</h2>
            <p className="text-gray-700 mb-4">
              <b>Keep Media Public</b> is completely transparent about its operations:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li><strong>No fees or commissions:</strong> 100% of your donation goes to the station. This site takes nothing.</li>
              <li><strong>Minimal data collection:</strong> We log only what&apos;s needed to ensure fair station exposure—no personal information, no tracking cookies, no data sharing.</li>
              <li><strong>Open methodology:</strong> Risk calculations and station selection algorithms are documented and verifiable.</li>
              <li><strong>Direct donations:</strong> Clicking &ldquo;Donate Now&rdquo; takes you directly to each station&apos;s own donation page.</li>
            </ul>
            <p className="text-gray-700 mb-4">
              The &ldquo;Stations That Need Your Help&rdquo; section uses weighted rotation to ensure equitable exposure. Stations that have
              received fewer recent impressions or donations are more likely to be shown, preventing any single station from
              dominating the list.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Sources</h2>
            <p className="text-gray-700 mb-4">
              Our station financial data comes from:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Station annual financial reports filed with CPB</li>
              <li>IRS Form 990 filings for nonprofit licensees</li>
              <li>State and university budget documents for public licensees</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Our current data is from fiscal year 2024 (the last full year before CPB&apos;s shutdown).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Who Built This</h2>
            <p className="text-gray-700 mb-4">
              <b>Keep Media Public</b> was built by John Bear,
              a developer and longtime public media supporter. I grew up watching{' '}
              <a href="https://www.ctpublic.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">WEDH (CPTV)</a> and{' '}
              <a href="https://www.wgbh.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">GBH Boston</a>;
              public media has been a constant companion in my daily life for decades. 
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Get Involved</h2>
            <p className="text-gray-700 mb-4">
              This project is open source and community-driven. You can help by:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li><strong>Contributing data:</strong> If you have access to station financial information, operational budgets, or other relevant data, please share it.</li>
              <li><strong>Improving the site:</strong> Visit our <a href="https://github.com/bunchoftrees/keepmediapublic.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">GitHub repository</a> to contribute code, suggest features, or report issues.</li>
              <li><strong>Spreading the word:</strong> Share <b>Keep Media Public</b> with friends, family, and fellow public media supporters.</li>
              <li><strong>Supporting stations:</strong> Most importantly—donate to stations in need.</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Questions, feedback, or data to share? Contact me at{' '}
              <a href="mailto:john@keepmediapublic.org" className="text-blue-600 hover:text-blue-700 underline">john@keepmediapublic.org</a>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
