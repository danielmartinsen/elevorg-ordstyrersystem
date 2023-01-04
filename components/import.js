import React, { Component, createRef, useState } from 'react'
import { CSVReader } from 'react-papaparse'
import { loadFirebase } from '../lib/firebase'
import importStyles from '../styles/import.module.scss'

const buttonRef = createRef()
const firebase = loadFirebase()
const db = firebase.firestore()

export default class Import extends Component {
  constructor(props) {
    super(props)
    this.state = {
      feedback: '',
    }
  }

  handleOpenDialog = (e) => {
    if (buttonRef.current) {
      buttonRef.current.open(e)
    }
  }

  handleOnFileLoad = (data) => {
    data.map((entry) => {
      const entryData = { ...entry.data }

      db.collection('deltagere')
        .doc(entryData[1].toString())
        .set({
          navn: entryData[0],
          nummer: entryData[1],
          organisasjon: entryData[2],
          rolle: entryData[3],
          epost: entryData[4]
        })
        .then(() => {})
    })
    this.setState({ feedback: 'Import vellykket!' })
  }

  handleOnError = (err, file, inputElem, reason) => {
    console.log(err)
  }

  handleOnRemoveFile = (data) => {
    console.log(data)
  }

  render() {
    return (
      <div className={importStyles.import}>
        <CSVReader
          ref={buttonRef}
          onFileLoad={this.handleOnFileLoad}
          onError={this.handleOnError}
          noClick
          onRemoveFile={this.handleOnRemoveFile}>
          {({ file }) => (
            <>
              <aside>
                <button type='button' onClick={this.handleOpenDialog} style={{ width: '40%' }}>
                  Last opp en fil
                </button>
                <div className={importStyles.div}>{file && file.name}</div>
              </aside>
              <p>{this.state.feedback}</p>
            </>
          )}
        </CSVReader>
      </div>
    )
  }
}
