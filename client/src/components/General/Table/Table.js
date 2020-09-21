import React from 'react'
import Application from '../../Student/Applications/Application'; 

function Table(props) {
  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="py-8">
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  {
                    props.headers.map(header => {
                      return (
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          {header}
                        </th>
                      )
                    })
                  }
                </tr>
              </thead>
              <tbody>

                {props.children ? props.children : 
                  props.app && props.app.map((app) => {
                    return <Application
                      name={app.name}
                      createDate={app.doa}
                      professor={app.professorName}
                      status={app.status}
                      selected={props.selected}
                      projID={app.projectID}
                      key={app.projectID}
                      professorMsg={app.professorMsg}
                      setError={props.setError}
                      finalDate={app.timeToAccept}
                    />
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Table;