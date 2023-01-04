import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/layout.module.scss'

export default function Layout({ user, loading = false, children }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Ordstyrersystem</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      {!user && (
        <main>
          <div className={styles.menugrid}>
            <Link href='/'>
              <div className={styles.card}>
                <h4>Hjem</h4>
              </div>
            </Link>

            <Link href='/api/login'>
              <div className={styles.card}>
                <h4>Logg inn</h4>
              </div>
            </Link>
          </div>
        </main>
      )}

      {user && (
        <main>
          <div className={styles.menugrid}>
            <Link href='/'>
              <div className={styles.card}>
                <h4>Hjem</h4>
              </div>
            </Link>

            <Link href='/deltagere'>
              <div className={styles.card}>
                <h4>Deltagere</h4>
              </div>
            </Link>

            <Link href='/debatt'>
              <div className={styles.card}>
                <h4>Styr ordet</h4>
              </div>
            </Link>

            {/* <Link href='/dagsorden'>
              <div className={styles.card}>
                <h3>Dagsorden</h3>
              </div>
            </Link> */}

            {/* <Link href='/votering'>
              <div className={styles.card}>
                <h3>Votering</h3>
              </div>
            </Link> */}

            <Link href='/skjermgrafikk'>
              <div className={styles.card}>
                <h4>Fullskjerm</h4>
              </div>
            </Link>

            <Link href='/api/logout'>
              <div className={styles.card}>
                <h4>Logg ut</h4>
              </div>
            </Link>
          </div>

          <div style={{ marginTop: '3rem' }}></div>

          {children}
        </main>
      )}
    </div>
  )
}
