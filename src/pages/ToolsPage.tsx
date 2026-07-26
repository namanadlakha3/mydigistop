import { Helmet } from 'react-helmet-async';
import { CidApp } from '@/features/cid/CidApp';

export function ToolsPage() {
  return (
    <>
      <Helmet>
        <title>Digital Tools — MyDigiStop</title>
        <meta
          name="description"
          content="Free digital tools: CID Generator, Bulk Key Checker, and O365 Checker. Verify your product keys and generate confirmation IDs."
        />
      </Helmet>

      {/* The CidApp already has its own full-screen layout — render it directly */}
      <CidApp />
    </>
  );
}
