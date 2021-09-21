import React, {useState, useEffect} from 'react'
import { Table } from 'react-bootstrap';

function LendingHistory({lendingData, handleDelete}) {
    const getTableRows = () => {
        return lendingData.map((item, index) => (
            <tr key={`${item.name}${index}`}>
              <td>
                  {item.name}
              </td>
              <td>
                  {item.description}
              </td>
              <td>
                  {item.date}
              </td>
              <td>
                  {item.time}
              </td>
              <td>
                  <button onClick={() => handleDelete(index)}>Delete</button>
              </td>
            </tr>
        ))
    }
    return (
        <div>
          <Table striped hover>
              <thead>
                  <tr>
                    <th>
                        Name
                    </th>
                    <th>
                        Description
                    </th>
                    <th>
                        Date
                    </th>
                    <th>
                        Time
                    </th>
                    <th>
                        Options
                    </th>
                  </tr>
              </thead>
              <tbody>
                  {getTableRows()}
              </tbody>
          </Table>            
        </div>
    )
}
export default LendingHistory