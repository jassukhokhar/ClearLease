import LegalPage from '../components/layout/LegalPage.jsx';

const Disclaimer = () => (
  <LegalPage
    title="Disclaimer"
    updated="June 2026"
    intro="ClearLease is a tool to help you understand lease agreements. It is not a substitute for professional legal advice."
    sections={[
      {
        heading: 'Informational use only',
        body: 'All analysis, risk scores, clause explanations, comparisons and generated letters are for general informational purposes only. They do not constitute legal advice and do not create an attorney-client relationship.',
      },
      {
        heading: 'No guarantee of accuracy',
        body: 'AI analysis may miss clauses, misinterpret language, or produce incomplete results. Lease laws also vary by jurisdiction. Always read your full lease and confirm important details independently.',
      },
      {
        heading: 'Consult a professional',
        body: 'For binding decisions — signing, disputing, or terminating a lease — consult a licensed attorney or a qualified tenant-rights organization in your area.',
      },
      {
        heading: 'Your responsibility',
        body: 'You are solely responsible for any decisions you make based on ClearLease output. ClearLease and its creators are not liable for outcomes resulting from reliance on the service.',
      },
    ]}
  />
);

export default Disclaimer;
