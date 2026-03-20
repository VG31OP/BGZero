import { Link } from "react-router-dom";

const Contact = () => (
  <div className="min-h-screen px-4 py-10">
    <div className="max-w-3xl mx-auto">
      <div className="glass-card-elevated p-8 space-y-6">
        <h1 className="text-3xl font-bold">Contact</h1>
        <p className="text-sm text-muted-foreground">
          Need help, want to report a bug, or request a feature? Reach out through any of the options below.
        </p>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Email: <a className="text-primary" href="mailto:vraj@shiroya.in">vraj@shiroya.im</a></p>
          <p>Instagram: <a className="text-primary" href="https://instagram.com/shiroya.in" target="_blank" rel="noreferrer">@shiroya.in</a></p>
          <p>Website: <a className="text-primary" href="https://shiroya.in" target="_blank" rel="noreferrer">shiroya.in</a></p>
          <p>Response time: Usually within 24-48 hours.</p>
        </div>
        <div>
          <Link to="/" className="btn-secondary !px-4 !py-2">Back to Home</Link>
        </div>
      </div>
    </div>
  </div>
);

export default Contact;
