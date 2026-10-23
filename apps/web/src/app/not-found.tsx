import Link from "next/link";
export default function NotFound(){return <main className="wrap section"><div className="eyebrow">404 · Page not found</div><h1 style={{fontSize:48}}>This path ends here.</h1><p className="muted">The page may have moved, or its address may be incorrect.</p><Link className="btn btn-primary" href="/courses">Explore courses</Link></main>}
