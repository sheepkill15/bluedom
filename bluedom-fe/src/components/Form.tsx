import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export type FormInput = {
    name: string;
    placeholder: string;
    type: 'text' | 'password';
};

export type FormProps = {
    inputs: FormInput[];
    action: string;
    onSubmit: (obj: {[id: string]: string}) => void;
};

const AutoForm = (props: FormProps) => {
    const formData: {[id: string]: string} = {};

    return (
        <Form style={{textAlign: 'start'}} onSubmit={() => props.onSubmit(formData)}>
            {
                props.inputs.map((input) => {
                    return (
                        <Form.Group controlId={`formBasic${input.name}`}>
                            <Form.Label>{input.placeholder}</Form.Label>
                            <Form.Control onChange={(e) => formData[input.name] = e.target.value} 
                                type={input.type} placeholder={input.placeholder}/>
                        </Form.Group>
                    );
                })
            }
            <Button variant="primary" type="submit">{props.action}</Button>
        </Form>
    );
}


export default AutoForm;