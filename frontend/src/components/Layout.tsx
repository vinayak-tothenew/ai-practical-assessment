import { Link } from "react-router-dom";

interface LayoutProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function Layout({ title, children, actions }: LayoutProps) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">
            <Link to="/">Support Tickets</Link>
          </p>
          <h1>{title}</h1>
        </div>
        {actions}
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return <div className="banner error">{message}</div>;
}

export function SuccessBanner({ message }: { message: string }) {
  return <div className="banner success">{message}</div>;
}
