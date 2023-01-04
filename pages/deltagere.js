import React, { useState, useEffect } from 'react'
import { loadFirebase } from '../lib/firebase'

import Import from '../components/import'
import { useFetchUser } from '../lib/user'

import styles from '../styles/deltagere.module.scss'
import modalStyles from '../styles/modal.module.scss'
import tableStyles from '../styles/table.module.scss'

import Layout from '../components/layout'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

export default function Deltagere() {
  const firebase = loadFirebase()
  const db = firebase.firestore()
  const { user, loading } = useFetchUser({ required: true })

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [openEdit, setOpenEdit] = useState(false)
  const handleOpenEdit = (data) => {
    setNavn(data.navn)
    setNummer(data.nummer)
    setOrg(data.organisasjon)
    setRolle(data.rolle)
    setOpenEdit(true)
  }
  const handleCloseEdit = () => setOpenEdit(false)

  const [openImport, setOpenImport] = useState(false)
  const handleOpenImport = () => setOpenImport(true)
  const handleCloseImport = () => {
    loadDeltagere()
    setOpenImport(false)
  }

  const [deltagere, setDeltagere] = useState([])

  const [navn, setNavn] = useState('')
  const [nummer, setNummer] = useState('')
  const [org, setOrg] = useState('')
  const [rolle, setRolle] = useState('')
  const [epost, setEpost] = useState('')

  useEffect(() => {
    loadDeltagere()
  }, [])

  function loadDeltagere() {
    db.collection('deltagere')
      .get()
      .then((snapshot) => {
        if (!snapshot.empty) {
          const result = []

          snapshot.forEach((doc) => {
            result.push(doc.data())
          })

          setDeltagere(result)
        } else {
          setDeltagere([])
        }
      })
  }

  function addDeltager() {
    db.collection('deltagere')
      .doc(nummer.toString())
      .set({ navn: navn, nummer: nummer, organisasjon: org, rolle: rolle, epost: epost })
      .then(() => {
        loadDeltagere()
        clearForm()
        handleClose()
      })
  }

  function editDeltager() {
    db.collection('deltagere')
      .doc(nummer.toString())
      .update({ navn: navn, nummer: nummer, organisasjon: org, rolle: rolle, epost: epost })
      .then(() => {
        loadDeltagere()
        clearForm()
        handleCloseEdit()
      })
  }

  function delDeltager(nummer) {
    db.collection('deltagere')
      .doc(nummer)
      .delete()
      .then(() => {
        loadDeltagere()
        handleClose()
      })
  }

  function clearForm() {
    setNavn('')
    setNummer('')
    setOrg('')
    setRolle('')
  }

  return (
    <Layout user={user} loading={loading}>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id='alert-dialog-title'>
          <h2 className={modalStyles.modalTitle}>Legg til en ny deltager</h2>
          <p>
            PS! Om du bruker et skiltnummer som allerede er i bruk så overstyrer dette tidligere
            informasjon.
          </p>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <input
              type='text'
              className={modalStyles.addInput}
              placeholder='Fullt navn'
              onChange={(e) => setNavn(e.target.value)}
              autoComplete='off'
            />
            <input
              type='text'
              className={modalStyles.addInput}
              placeholder='Skiltnummer'
              onChange={(e) => setNummer(e.target.value)}
              autoComplete='off'
            />
            <input
              type='text'
              className={modalStyles.addInput}
              placeholder='Organisasjon/Skole'
              onChange={(e) => setOrg(e.target.value)}
              autoComplete='off'
            />
            <input
              type='text'
              className={modalStyles.addInput}
              placeholder='Rolle (Delegat, Observatør, Gjest)'
              onChange={(e) => setRolle(e.target.value)}
              autoComplete='off'
            />
            <input
              type='text'
              className={modalStyles.addInput}
              placeholder='E-post'
              onChange={(e) => setEpost(e.target.value)}
              autoComplete='off'
            />

            <input
              type='button'
              value='Legg til'
              className={modalStyles.addButton}
              onClick={() => addDeltager()}
            />
            <input
              type='button'
              value='Avbryt'
              className={modalStyles.addButton}
              style={{ marginLeft: 10 }}
              onClick={() => handleClose()}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <Dialog open={openImport} onClose={handleCloseImport}>
        <DialogTitle id='alert-dialog-title'>
          <h2 className={modalStyles.modalTitle}>Importer deltagere</h2>
          <p>
            Import deltagere fra en .csv fil her. Filen må være kommaskilt og i rekkefølgen Navn,
            Skiltnummer, Organisasjon, Rolle, E-post og uten header.
          </p>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <Import />
            <input
              type='button'
              value='Ferdig'
              className={modalStyles.addButton}
              onClick={() => handleCloseImport()}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <Dialog open={openEdit} onClose={handleCloseEdit}>
        <DialogTitle id='alert-dialog-title'>
          <h2 className={modalStyles.modalTitle}>Endre en deltager</h2>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <input
              type='text'
              className={modalStyles.addInput}
              placeholder='Fullt navn'
              onChange={(e) => setNavn(e.target.value)}
              value={navn}
              autoComplete='off'
            />
            <input
              type='text'
              className={modalStyles.addInput}
              placeholder='Skiltnummer'
              onChange={(e) => setNummer(e.target.value)}
              value={nummer}
              autoComplete='off'
            />
            <input
              type='text'
              className={modalStyles.addInput}
              placeholder='Organisasjon/Skole'
              onChange={(e) => setOrg(e.target.value)}
              value={org}
              autoComplete='off'
            />
            <input
              type='text'
              className={modalStyles.addInput}
              placeholder='Rolle (Delegat, Observatør, Gjest)'
              onChange={(e) => setRolle(e.target.value)}
              value={rolle}
              autoComplete='off'
            />
            <input
              type='text'
              className={modalStyles.addInput}
              placeholder='E-post'
              onChange={(e) => setEpost(e.target.value)}
              value={epost}
              autoComplete='off'
            />

            <input
              type='button'
              value='Lagre'
              className={modalStyles.addButton}
              onClick={() => editDeltager()}
            />
            <input
              type='button'
              value='Avbryt'
              className={modalStyles.addButton}
              style={{ marginLeft: 10 }}
              onClick={() => handleCloseEdit()}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <div className={styles.actionButtons}>
        <button onClick={() => handleOpen()}>Legg til en deltager</button>
        <button onClick={() => handleOpenImport()}>Importer deltagere</button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead className={tableStyles.tableHeader}>
            <TableRow>
              <TableCell>Skiltnummer</TableCell>
              <TableCell>Navn</TableCell>
              <TableCell>Organisasjon</TableCell>
              <TableCell>Rolle</TableCell>
              <TableCell>E-post</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody className={tableStyles.tableBody}>
            {deltagere.map((row) => (
              <TableRow key={row.nummer}>
                <TableCell>{row.nummer}</TableCell>
                <TableCell>{row.navn}</TableCell>
                <TableCell>{row.organisasjon}</TableCell>
                <TableCell>{row.rolle}</TableCell>
                <TableCell>{row.epost}</TableCell>
                <TableCell>
                  <button className={tableStyles.button} onClick={() => handleOpenEdit(row)}>
                    Endre
                  </button>
                  <button className={tableStyles.button} onClick={() => delDeltager(row.nummer)}>
                    Slett
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Layout>
  )
}
