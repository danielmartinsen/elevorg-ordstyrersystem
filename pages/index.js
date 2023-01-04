import Head from 'next/head'
import Link from 'next/link'

import styles from '../styles/index.module.scss'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Ordstyrersystem</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <h1 className={styles.title}>Ordstyrersystem</h1>

        <div className={styles.grid}>
          <Link href='/deltagere'>
            <div className={styles.card}>
              <h3>Deltagere &rarr;</h3>
              <p>Administrer deltagere.</p>
            </div>
          </Link>

          <Link href='/debatt'>
            <div className={styles.card}>
              <h3>Styr ordet &rarr;</h3>
              <p>Styr ordet og skjermen.</p>
            </div>
          </Link>

          {/* <Link href='/dagsorden'>
            <div className={styles.card}>
              <h3>Dagsorden &rarr;</h3>
              <p>Sett opp dagsorden med dokumenter og forslag.</p>
            </div>
          </Link>

          <Link href='/votering'>
            <div className={styles.card}>
              <h3>Voteringer &rarr;</h3>
              <p>Styr voteringer, og åpne for stemmegivning</p>
            </div>
          </Link> */}

          <Link href='/skjermgrafikk'>
            <div className={styles.card}>
              <h3>Fullskjerm &rarr;</h3>
              <p>Fullskjerms-grafikk for OBS.</p>
            </div>
          </Link>

          <Link href='/api/login'>
            <div className={styles.card}>
              <h3>Logg inn &rarr;</h3>
              <p>Kontakt Daniel Martinsen for innlogging.</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}
