import React from 'react';
import { TextArea } from '../../../General/Form/FormComponents';

function AnswersAndSop(props){

    return (
        <section className="mt-2 px-2 md:px-24">

            {props.details.questionnaire && props.details.questionnaire.map((question, index) => {

                if (props.details.answers[index].length > 0)
                    return (
                        <TextArea
                            text={question}
                            value={props.details.answers[index]}
                            disabled={true}
                            key={question}
                            extraClass="mb-4"
                        />
                    )
                else
                    return "";
            })}

            {props.errorText.length === 0 && 
                <TextArea
                    text="Statement of Purpose"
                    value={props.details.sop}
                    disabled={true}
                    rows={8}
                    extraClass="mb-4"
                />
            }

        </section>
    )
}

export default AnswersAndSop;