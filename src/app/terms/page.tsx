export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <article className="prose lg:prose-xl dark:prose-invert max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Terms of Service</h1>

        <p className="text-sm text-muted-foreground mb-6 text-center">
          Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <p>
          Welcome to BonusTracker (the &quot;Site&quot;). These Terms of Service (&quot;Terms&quot;) govern your use of our Site
          and its content, features, and services (collectively, the &quot;Services&quot;). By accessing or using our
          Services, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use
          our Services.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Use of Our Services</h2>
        <p>
          You must be at least 18 years old or the legal age of majority in your jurisdiction to use our Services.
          You agree to use our Services only for lawful purposes and in accordance with these Terms. You are
          responsible for ensuring that your use of the Services complies with all applicable laws, regulations,
          and ordinances.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Accounts</h2>
        <p>
          When you create an account with us, you must provide information that is accurate, complete, and current
          at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate
          termination of your account on our Service. You are responsible for safeguarding the password that you
          use to access the Service and for any activities or actions under your password.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Intellectual Property</h2>
        <p>
          The Service and its original content (excluding Content provided by users), features, and functionality
          are and will remain the exclusive property of BonusTracker and its licensors. The Service is protected by
          copyright, trademark, and other laws of both the United States and foreign countries.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Affiliate Links and Commissions</h2>
        <p>
          Our Site may contain links to third-party websites or services that are not owned or controlled by
          BonusTracker. Some of these links may be affiliate links, which means we may earn a commission if you
          click on the link or make a purchase using the link. When you make a purchase or sign up through an
          affiliate link, we may receive a commission at no additional cost to you.
        </p>
        <p>
          We only promote products or services that we believe will be of value to our users. However, we have no
          control over, and assume no responsibility for, the content, privacy policies, or practices of any
          third-party web sites or services. You further acknowledge and agree that BonusTracker shall not be
          responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by
          or in connection with the use of or reliance on any such content, goods or services available on or
          through any such web sites or services.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. User Content</h2>
        <p>
          Our Service may allow you to post, link, store, share and otherwise make available certain information,
          text, graphics, videos, or other material (&quot;Content&quot;). You are responsible for the Content that you
          post on or through the Service, including its legality, reliability, and appropriateness.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Limitation of Liability</h2>
        <p>
          In no event shall BonusTracker, nor its directors, employees, partners, agents, suppliers, or affiliates,
          be liable for any indirect, incidental, special, consequential or punitive damages, including without
          limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access
          to or use of or inability to access or use the Service.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Disclaimer</h2>
        <p>
          Your use of the Service is at your sole risk. The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot;
          basis. The Service is provided without warranties of any kind, whether express or implied, including, but
          not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement
          or course of performance.
        </p>
        <p>
          BonusTracker does not warrant that a) the Service will function uninterrupted, secure or available at any
          particular time or location; b) any errors or defects will be corrected; c) the Service is free of
          viruses or other harmful components; or d) the results of using the Service will meet your requirements.
        </p>
        <p>
          The information provided on BonusTracker is for general informational and entertainment purposes only.
          We are not financial advisors, and nothing on this site should be taken as financial advice.
          Sweepstakes casinos involve risk, and you should only participate with funds you can afford to lose.
          Please gamble responsibly.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Governing Law</h2>
        <p>
          These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which the
          company is established, without regard to its conflict of law provisions.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">9. Changes to Terms</h2>
        <p>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision
          is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What
          constitutes a material change will be determined at our sole discretion.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">10. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us through the contact form on our Site.
        </p>

      </article>
    </div>
  );
} 