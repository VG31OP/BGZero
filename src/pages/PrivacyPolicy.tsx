import { Link } from "react-router-dom";

const PrivacyPolicy = () => (
  <div className="min-h-screen px-4 py-10">
    <div className="max-w-3xl mx-auto">
      <div className="glass-card-elevated p-8 space-y-6">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Effective date: March 21, 2026</p>
        <p className="text-sm text-muted-foreground">
          BgZero processes images directly in your browser. Your uploaded files are not sent to a central server by us
          during normal operation.
        </p>
        <p className="text-sm text-muted-foreground">
          We may collect minimal technical telemetry such as anonymous error logs and performance diagnostics to improve
          reliability, but we do not sell personal data.
        </p>
        <p className="text-sm text-muted-foreground">
          If you contact support, any details you share are used only to resolve your request. You can request deletion
          of support messages at any time.
        </p>
        <div>
          <Link to="/" className="btn-secondary !px-4 !py-2">Back to Home</Link>
        </div>
      </div>
    </div>
  </div>
);

export default PrivacyPolicy;
