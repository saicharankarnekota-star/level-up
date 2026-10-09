import { Link } from 'wouter';

export function NotFound() {
  return (
    <div className="not-found page-enter">
      <div className="text-6xl">🧭</div>
      <h1>We got a little lost</h1>
      <p>This page does not exist. Let's head back to familiar ground.</p>
      <Link href="/" className="button button-yellow mt-4">Go home</Link>
    </div>
  );
}
