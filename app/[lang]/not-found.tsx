import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="nf wrap">
      <p className="nf__code">404</p>
      <h1 className="nf__t">Страницата не постои. <span>This page does not exist.</span></h1>
      <Link className="line-link" href="/mk">← Почетна / Home</Link>
    </section>
  )
}
