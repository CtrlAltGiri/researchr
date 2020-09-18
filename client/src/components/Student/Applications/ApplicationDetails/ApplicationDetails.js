import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Error, TextArea, TextField, Title } from '../../../General/Form/FormComponents';

function ApplicationDetails(props) {

    const { projectId } = useParams();
    const [details, setDetails] = useState({});
    const [errorText, setError] = useState('');

    useEffect(() => {
        axios.get('/api/student/application/' + projectId.toString())
            .then(res => {
                if (res.data.answers.length !== res.data.questionnaire.length) {
                    setError("The number of questions and answers don't match")
                }
                else
                    setDetails(res.data)
            })
            .catch(err => setError(err.response.data));
    }, [])

    return (
        <section className="mt-2 px-12 md:px-24">

            <div className="mb-8 px-1">
                <Title text={<p>Application for <span className="text-teal-700">Project_name</span></p> }/>
            </div>
            {details.questionnaire && details.questionnaire.map((question, index) => {

                if (details.answers[index].length > 0)
                    return (
                        <TextArea
                            text={question}
                            value={details.answers[index]}
                            disabled={true}
                            key={question}
                            extraClass="mb-4"
                        />
                    )
                else
                    return "";
            })}

            {errorText.length === 0 && 
            <TextArea
                text="Statement of Purpose"
                value={details.sop}
                disabled={true}
                rows={8}
                extraClass="mb-4"
            />
            }

            <Error text={errorText} />
        </section>
    )

}

export default ApplicationDetails;