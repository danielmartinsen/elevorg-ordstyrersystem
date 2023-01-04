import React from 'react'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

import tableStyles from '../styles/table.module.scss'

export default function DeltagerTable({ data }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead className={tableStyles.tableHeader}>
          <TableRow>
            <TableCell>Skiltnummer</TableCell>
            <TableCell>Navn</TableCell>
            <TableCell>Organisasjon</TableCell>
            <TableCell>Rolle</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody className={tableStyles.tableBody}>
          {data.map((row) => (
            <TableRow>
              <TableCell>{row.nummer}</TableCell>
              <TableCell>{row.navn}</TableCell>
              <TableCell>{row.organisasjon}</TableCell>
              <TableCell>{row.rolle}</TableCell>
              <TableCell>
                <button className={tableStyles.button}>Endre</button>
                <button className={tableStyles.button}>Slett</button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
