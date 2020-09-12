import React from 'react'
import Application from './Application';

function Table(props){
    return(
        <div className="container mx-auto px-4 sm:px-8">
          <div className="py-8">
            <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
              <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                  <thead>
                    <tr>
                      <th
                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Project
                                  </th>
                      <th
                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Professor
                                  </th>
                      <th
                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Created on
                                  </th>
                      <th
                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                                  </th>
                    </tr>
                  </thead>
                  <tbody>
                      {props.app && props.app.map((app) => {
                          return <Application
                            name={app.name}
                            createDate={app.createDate}
                            college={app.college}
                            status={app.status}
                            selected={props.selected}
                          />
                      })}   
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
    )
}

export default Table;