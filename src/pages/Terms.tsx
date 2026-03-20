import { Link } from "react-router-dom";

const Terms = () => (
  <div className="min-h-screen px-4 py-10">
    <div className="max-w-3xl mx-auto">
      <div className="glass-card-elevated p-8 space-y-6">
        <h1 className="text-3xl font-bold">Terms of Use</h1>
        <p className="text-sm text-muted-foreground">Effective date: March 21, 2026</p>
        <p className="text-sm text-muted-foreground">
          BgZero is provided as-is for personal and commercial use. By using the service, you agree not to upload
          unlawful or harmful content and to comply with applicable laws in your jurisdiction.
        </p>
        <p className="text-sm text-muted-foreground">
          You retain ownership of your files. You are responsible for the images you upload and how you use generated
          outputs. We do not guarantee results for every file type or image condition.
        </p>
        <p className="text-sm text-muted-foreground">
          The tool may be updated or unavailable at times for maintenance. We are not liable for indirect damages
          arising from use or inability to use the service.
        </p>
        <div>
          <Link to="/" className="btn-secondary !px-4 !py-2">Back to Home</Link>
        </div>
      </div>
    </div>
  </div>
);

export default Terms;
