export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <article className="prose lg:prose-xl dark:prose-invert max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>
        
        <p className="text-sm text-muted-foreground mb-6 text-center">
          Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <p>
          Welcome to BonusTracker (the &quot;Site&quot;). We are committed to protecting your personal information
          and your right to privacy. If you have any questions or concerns about this privacy notice, or our
          practices with regards to your personal information, please contact us.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. INFORMATION WE COLLECT</h2>
        <p>
          We collect personal information that you voluntarily provide to us when you register on the Site,
          express an interest in obtaining information about us or our products and services, when you
          participate in activities on the Site or otherwise when you contact us.
        </p>
        <p>
          The personal information that we collect depends on the context of your interactions with us and the
          Site, the choices you make and the products and features you use. The personal information we collect
          may include the following: names; email addresses; usernames; passwords; contact preferences; and
          other similar information.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. HOW WE USE YOUR INFORMATION</h2>
        <p>
          We use personal information collected via our Site for a variety of business purposes described below.
          We process your personal information for these purposes in reliance on our legitimate business interests,
          in order to enter into or perform a contract with you, with your consent, and/or for compliance with
          our legal obligations. We indicate the specific processing grounds we rely on next to each purpose listed
          below.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>To facilitate account creation and logon process.</li>
          <li>To post testimonials.</li>
          <li>Request feedback.</li>
          <li>To enable user-to-user communications.</li>
          <li>To manage user accounts.</li>
          <li>To send administrative information to you.</li>
          <li>To protect our Services.</li>
          <li>To enforce our terms, conditions and policies for business purposes, to comply with legal and regulatory requirements or in connection with our contract.</li>
          <li>To respond to legal requests and prevent harm.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. WILL YOUR INFORMATION BE SHARED WITH ANYONE?</h2>
        <p>
          We only share information with your consent, to comply with laws, to provide you with services,
          to protect your rights, or to fulfill business obligations.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</h2>
        <p>
          We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store
          information. Specific information about how we use such technologies and how you can refuse certain
          cookies is set out in our Cookie Policy (if applicable, otherwise this section can be expanded).
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. HOW LONG DO WE KEEP YOUR INFORMATION?</h2>
        <p>
          We keep your information for as long as necessary to fulfill the purposes outlined in this privacy
          notice unless otherwise required by law.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. HOW DO WE KEEP YOUR INFORMATION SAFE?</h2>
        <p>
          We aim to protect your personal information through a system of organizational and technical security
          measures.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. DO WE COLLECT INFORMATION FROM MINORS?</h2>
        <p>
          We do not knowingly solicit data from or market to children under 18 years of age.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. WHAT ARE YOUR PRIVACY RIGHTS?</h2>
        <p>
          In some regions (like the EEA and UK), you have rights that allow you greater access to and control
          over your personal information. You may review, change, or terminate your account at any time.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">9. CONTROLS FOR DO-NOT-TRACK FEATURES</h2>
        <p>
          Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track
          (&quot;DNT&quot;) feature or setting you can activate to signal your privacy preference not to have data about
          your online browsing activities monitored and collected. At this stage no uniform technology standard
          for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond
          to DNT browser signals or any other mechanism that automatically communicates your choice not to be
          tracked online. 
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">10. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</h2>
        <p>
          Yes, if you are a resident of California, you are granted specific rights regarding access to your
          personal information. California Civil Code Section 1798.83, also known as the &quot;Shine The Light&quot; law,
          permits our users who are California residents to request and obtain from us, once a year and free
          of charge, information about categories of personal information (if any) we disclosed to third parties
          for direct marketing purposes and the names and addresses of all third parties with which we shared
          personal information in the immediately preceding calendar year.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">11. DO WE MAKE UPDATES TO THIS NOTICE?</h2>
        <p>
          Yes, we will update this notice as necessary to stay compliant with relevant laws.
          The updated version will be indicated by an updated &quot;Revised&quot; date and the updated version will be
          effective as soon as it is accessible. 
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">12. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</h2>
        <p>
          If you have questions or comments about this notice, you may contact us by email through the contact form on our site or at the main contact email provided.
        </p>

        <p className="mt-12 text-sm text-muted-foreground">
          <em>
            Please remember that this is a generic template for a privacy policy. You should consult with
            a legal professional to ensure that your privacy policy is compliant with all applicable laws
            and regulations and accurately reflects your data processing practices.
          </em>
        </p>
      </article>
    </div>
  );
} 