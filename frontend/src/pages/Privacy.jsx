import LegalPage from '../components/layout/LegalPage.jsx';

const Privacy = () => (
  <LegalPage
    title="Privacy Policy"
    updated="June 2026"
    intro="Your privacy matters. This policy explains what data ClearLease collects, how we use it, and the choices you have."
    sections={[
      {
        heading: 'Information we collect',
        body: [
          'Account details you provide: name, email, and a hashed password.',
          'Lease documents you upload and the text extracted from them for analysis.',
          'AI analysis results, risk reports, chat conversations and comparisons tied to your account.',
        ],
      },
      {
        heading: 'How we use your information',
        body: [
          'To analyze your lease and generate risk reports and recommendations.',
          'To power the AI assistant, comparison, negotiation and export features.',
          'To maintain your account, history, and secure access to your data.',
        ],
      },
      {
        heading: 'How your data is protected',
        body: 'Documents and reports are tied to your account and protected behind authentication. Passwords are hashed with bcrypt and never stored in plain text. Access is restricted so you can only see your own leases, chats and reports.',
      },
      {
        heading: 'Data sharing',
        body: 'We do not sell your data. Lease text is sent to our AI provider solely to generate your analysis. We do not share your documents publicly or with other users.',
      },
      {
        heading: 'Your choices',
        body: 'You can delete any lease and its report at any time from your history. Deleting a lease removes its stored file and analysis from our systems.',
      },
      {
        heading: 'Contact',
        body: 'Questions about privacy? Reach us at hello@clearlease.app.',
      },
    ]}
  />
);

export default Privacy;
