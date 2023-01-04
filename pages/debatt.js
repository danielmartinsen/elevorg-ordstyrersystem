import React, { useState, useEffect } from 'react'
import Layout from '../components/layout'
import { loadFirebase } from '../lib/firebase'
import { loadCSS } from 'fg-loadcss'
import * as moment from 'moment'
import { useFetchUser } from '../lib/user'

import Icon from '@material-ui/core/Icon'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

import styles from '../styles/debatt.module.scss'
import tableStyles from '../styles/table.module.scss'

export default function Debatt() {
  const firebase = loadFirebase()
  const db = firebase.firestore()
  const { user, loading } = useFetchUser({ required: true })

  const [mode, setMode] = useState('debatt')
  const [content, setContent] = useState('')
  const [nummer, setNummer] = useState('')
  const [nummer2, setNummer2] = useState('')
  const [sakstittel, setSakstittel] = useState('')
  const [nextData, setNextData] = useState([])
  const [saksopplysningData, setSaksopplysningData] = useState([])
  const [replikkData, setReplikkData] = useState([])
  const [talerlisteData, setTalerlisteData] = useState([])
  const [ferdig, setFerdig] = useState('')
  const [seconds, setSeconds] = useState(0)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    loadCSS(
      'https://use.fontawesome.com/releases/v5.12.0/css/all.css',
      document.querySelector('#font-awsome-css')
    )
  }, [])

  useEffect(() => {
    db.collection('main')
      .doc('config')
      .get()
      .then((doc) => {
        setMode(doc.data().mode)
        setSakstittel(doc.data().sakstittel)
      })
  }, [])

  useEffect(() => {
    return db
      .collection('main')
      .doc('saksopplysning')
      .onSnapshot((docSnapshot) => {
        if (docSnapshot.data().nummer != '') {
          setSaksopplysningData([docSnapshot.data()])
        } else {
          setSaksopplysningData([])
        }
      })
  }, [])

  useEffect(() => {
    return db.collection('talerliste').onSnapshot((docSnapshot) => {
      const talerliste = []

      docSnapshot.forEach((doc) => {
        if (doc.id != '--config--') {
          if (doc.data().skip == false) {
            const data = doc.data()
            data.id = parseInt(doc.id)
            talerliste.push(data)
          }
        }
      })
      const talerlisteSort = talerliste.sort((a, b) => a.id - b.id)
      const replikker = []

      if (talerlisteSort[0] != undefined) {
        setNextData([talerlisteSort[0]])

        const replikkData = talerlisteSort[0].replikk
        setReplikkData([])

        for (var replikk in replikkData) {
          if (replikk != 'config' && replikk != 'next') {
            replikker.push({
              active: replikkData[replikk].active,
              id: replikkData[replikk],
              nummer: replikkData[replikk].nummer,
              navn: replikkData[replikk].navn,
              org: replikkData[replikk].org,
            })
          }
        }
        setReplikkData(replikker)
      } else {
        setNextData([])
        setReplikkData([])

        reset()
        setIsActive(false)
      }

      setTalerlisteData(talerlisteSort.slice(1))

      const minutes = talerliste.length * 2 + replikker.length * 1
      const nowTime = new Date()
      const ferdigTime = moment(nowTime).add(minutes, 'm').toDate()
      setFerdig(
        ('0' + ferdigTime.getHours()).slice(-2) +
          ':' +
          ('0' + ferdigTime.getMinutes()).slice(-2)
      )
    })
  }, [])

  useEffect(() => {
    let interval = null
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1)
      }, 1000)
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isActive, seconds])

  function toggle() {
    setIsActive(!isActive)
  }

  function reset() {
    setSeconds(0)
    setIsActive(false)
  }

  function saksopplysningInput() {
    if (nummer2 != '') {
      db.collection('deltagere')
        .doc(nummer2.toString())
        .get()
        .then((doc) => {
          if (doc.exists) {
            const userData = doc.data()

            db.collection('main').doc('saksopplysning').set({
              navn: userData.navn,
              nummer: userData.nummer,
              org: userData.organisasjon,
            })
          }
        })
      setNummer2('')
    } else {
      db.collection('main').doc('saksopplysning').set({
        navn: '',
        nummer: '',
        org: '',
      })
    }
  }

  function sakstittelInput() {
    if (sakstittel != '') {
      db.collection('main').doc('config').set(
        {
          sakstittel: sakstittel,
        },
        { merge: true }
      )
    } else {
      db.collection('main').doc('config').set(
        {
          sakstittel: '',
        },
        { merge: true }
      )
    }
  }

  function talerInput() {
    if (nummer == '') {
      reset()
      setIsActive(true)

      db.collection('talerliste')
        .doc(nextData[0].id.toString())
        .get()
        .then((doc) => {
          if (
            doc.data().replikk.config > 0 &&
            doc.data().replikk.next <= doc.data().replikk.config
          ) {
            db.collection('talerliste')
              .doc(nextData[0].id.toString())
              .set({ active: false }, { merge: true })

            for (
              var replikkNummer = 1;
              replikkNummer <= doc.data().replikk.config;
              replikkNummer++
            ) {
              db.collection('talerliste')
                .doc(nextData[0].id.toString())
                .set(
                  {
                    replikk: {
                      [replikkNummer]: {
                        active: false,
                      },
                    },
                  },
                  { merge: true }
                )
            }

            db.collection('talerliste')
              .doc(nextData[0].id.toString())
              .set(
                {
                  replikk: {
                    [doc.data().replikk.next]: {
                      active: true,
                    },
                    next: doc.data().replikk.next + 1,
                  },
                },
                { merge: true }
              )
          } else {
            db.collection('talerliste')
              .doc('--config--')
              .get()
              .then((doc) => {
                const next = doc.data().next
                const count = doc.data().count

                if (next < count) {
                  db.collection('talerliste')
                    .doc((next + 1).toString())
                    .get()
                    .then((doc) => {
                      if (doc.data().skip) {
                        const increment = firebase.firestore.FieldValue.increment(1)

                        db.collection('talerliste').doc(next.toString()).delete()
                        db.collection('talerliste')
                          .doc('--config--')
                          .update({ next: increment })

                        for (var i = next + 1; i <= count; i++) {
                          db.collection('talerliste')
                            .doc(i.toString())
                            .get()
                            .then((doc) => {
                              if (doc.data().skip) {
                                db.collection('talerliste')
                                  .doc(doc.id.toString())
                                  .delete()
                                db.collection('talerliste')
                                  .doc('--config--')
                                  .update({ next: increment })
                              } else {
                                return
                              }
                            })
                        }
                      } else {
                        db.collection('talerliste')
                          .doc(next.toString())
                          .delete()
                          .then(() => {
                            db.collection('talerliste')
                              .doc('--config--')
                              .update({ next: next + 1 })
                          })
                      }
                    })
                } else if (next == count) {
                  db.collection('talerliste')
                    .doc(next.toString())
                    .delete()
                    .then(() => {
                      db.collection('talerliste')
                        .doc('--config--')
                        .update({ next: next + 1 })
                    })
                }
              })
          }
        })
    } else if (nummer == '++') {
      db.collection('talerliste')
        .doc(nextData[0].id.toString())
        .get()
        .then((doc) => {
          const count = doc.data().replikk.config
          const newCount = count + 1

          db.collection('talerliste')
            .doc(nextData[0].id.toString())
            .set(
              {
                replikk: {
                  config: newCount,
                  next: 1,
                  [newCount]: {
                    active: false,
                    navn: nextData[0].navn,
                    nummer: nextData[0].nummer,
                    org: nextData[0].org,
                  },
                },
              },
              { merge: true }
            )
        })

      setNummer('')
    } else if (nummer.charAt(0) == '+') {
      db.collection('deltagere')
        .doc(nummer.substr(1).toString())
        .get()
        .then((doc) => {
          if (doc.exists) {
            const userData = doc.data()

            db.collection('talerliste')
              .doc(nextData[0].id.toString())
              .get()
              .then((doc) => {
                const count = doc.data().replikk.config
                const newCount = count + 1

                db.collection('talerliste')
                  .doc(nextData[0].id.toString())
                  .set(
                    {
                      replikk: {
                        config: newCount,
                        next: 1,
                        [newCount]: {
                          active: false,
                          navn: userData.navn,
                          nummer: userData.nummer,
                          org: userData.organisasjon,
                        },
                      },
                    },
                    { merge: true }
                  )
              })
          }
        })

      setNummer('')
    } else {
      if (talerlisteData.length == 0) {
        setIsActive(true)
      }

      db.collection('deltagere')
        .doc(nummer.toString())
        .get()
        .then((doc) => {
          if (doc.exists) {
            const userData = doc.data()

            db.collection('talerliste')
              .doc('--config--')
              .get()
              .then((doc) => {
                const count = doc.data().count

                db.collection('talerliste')
                  .doc((count + 1).toString())
                  .set({
                    active: true,
                    skip: false,
                    navn: userData.navn,
                    nummer: userData.nummer,
                    org: userData.organisasjon,
                    replikk: { config: 0 },
                  })
                  .then(() => {
                    db.collection('talerliste')
                      .doc('--config--')
                      .update({ count: count + 1 })
                  })
              })
          }
        })
      setNummer('')
    }
  }

  function strykInnlegg(innleggID) {
    db.collection('talerliste')
      .doc(innleggID.toString())
      .set({ skip: true }, { merge: true })
  }

  const handleChange = (event) => {
    setMode(event.target.value)
    db.collection('main').doc('config').update({ mode: event.target.value })
  }

  function updateContent() {
    db.collection('main').doc('config').update({ content: content })
  }

  async function removeAll() {
    db.collection('talerliste').doc('--config--').update({ count: 0, next: 1 })

    const snapshot = await db.collection('talerliste').get()
    snapshot.forEach((doc) => {
      if (doc.id != '--config--') {
        db.collection('talerliste').doc(doc.id).delete()
      }
    })
  }

  return (
    <Layout user={user} loading={loading}>
      <div className={styles.modeSelect}>
        <FormControl>
          <Select value={mode} onChange={handleChange} displayEmpty>
            <MenuItem value={'debatt'}>Modus: Debatt</MenuItem>
            <MenuItem value={'saksopplysning'}>Modus: Saksopplysning</MenuItem>
            <MenuItem value={'pause'}>Modus: Pause/Beskjed</MenuItem>
            <MenuItem value={'hele'}>Modus: Referer talelista</MenuItem>
          </Select>
        </FormControl>

        <button
          className={styles.buttonSmall}
          style={{ marginLeft: 'auto' }}
          onClick={() => removeAll()}>
          Fjern alle
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.sideDiv}>
          <input
            type='text'
            className={styles.talerInput}
            placeholder='Neste taler'
            value={nummer}
            onChange={(e) => setNummer(e.target.value)}
            onKeyPress={(ev) => {
              if (ev.key === 'Enter') {
                talerInput()
              }
            }}
          />

          <input
            type='text'
            className={styles.talerInput}
            placeholder='Saksopplysning'
            value={nummer2}
            onChange={(e) => setNummer2(e.target.value)}
            onKeyPress={(ev) => {
              if (ev.key === 'Enter') {
                saksopplysningInput()
              }
            }}
          />

          <input
            type='text'
            className={styles.talerInput}
            placeholder='Sakstittel'
            value={sakstittel}
            onChange={(e) => setSakstittel(e.target.value)}
            onKeyPress={(ev) => {
              if (ev.key === 'Enter') {
                sakstittelInput()
              }
            }}
          />

          <div className={styles.timeDiv}>
            <p>FERDIG OMTRENT:</p>
            <h2>{ferdig}</h2>

            <hr />

            <p>TIDSBRUK:</p>
            <h2>{seconds} sekunder</h2>
            <button className={styles.buttonSmall} onClick={toggle}>
              {' '}
              {isActive ? 'Pause' : 'Start'}
            </button>
            <button className={styles.buttonSmall} onClick={reset}>
              Reset
            </button>

            <hr />

            <p style={{ marginBottom: 10 }}>FORKLARING:</p>
            <p>
              <b>Innlegg</b>: [nummer] <br />
              <b>Replikk</b>: +[nummer] <br />
              <b>Svarreplikk</b>: ++ <br />
              <b>Saksopplysning</b>: [nummer]
            </p>
          </div>
        </div>

        <div className={styles.mainContent}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead className={tableStyles.tableHeader}>
                <TableRow>
                  <TableCell>Skiltnummer</TableCell>
                  <TableCell>Navn</TableCell>
                  <TableCell>Organisasjon</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>

              <TableBody className={styles.tableBody}>
                {saksopplysningData.map((taler) => (
                  <TableRow key='saksopplysning' className={styles.saksopplysning}>
                    <TableCell>{taler.nummer}</TableCell>
                    <TableCell>{taler.navn}</TableCell>
                    <TableCell>{taler.org}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                ))}

                {nextData.map((next) => (
                  <TableRow
                    key={next.id}
                    className={next.active ? styles.active : styles.replikkBody}>
                    <TableCell>{next.nummer}</TableCell>
                    <TableCell>{next.navn}</TableCell>
                    <TableCell>{next.org}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                ))}

                {replikkData.map((replikk) => (
                  <TableRow
                    key={replikk.id}
                    className={replikk.active ? styles.active : styles.replikkBody}>
                    <TableCell>&rarr; {replikk.nummer}</TableCell>
                    <TableCell>{replikk.navn}</TableCell>
                    <TableCell>{replikk.org}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                ))}

                {talerlisteData.map((taler) => (
                  <TableRow key={taler.id}>
                    <TableCell>{taler.nummer}</TableCell>
                    <TableCell>{taler.navn}</TableCell>
                    <TableCell>{taler.org}</TableCell>
                    <TableCell>
                      <Icon
                        className='far fa-times-circle'
                        style={{ cursor: 'pointer', fontSize: 16 }}
                        onClick={() => strykInnlegg(taler.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.mainContent}>
          <textarea
            className={styles.beskjedArea}
            placeholder='Beskjed...'
            onChange={(e) => setContent(e.target.value)}></textarea>
          <button className={styles.buttonSmall} onClick={() => updateContent()}>
            Lagre og vis
          </button>
        </div>
      </div>
    </Layout>
  )
}
