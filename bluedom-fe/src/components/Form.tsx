import React, {useState} from 'react';
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
    const [formData, setFormData] = useState<{[id: string]: string}>({});

    const onChangeInput = (name: string, inputValue: string) => {
        setFormData({...formData, [name]: inputValue});
    }

    return (
        <Form onSubmit={(e) => {
            e.preventDefault();
            props.onSubmit(formData);
        }}>
            {
                props.inputs.map((input) => {
                    return (
                        <Form.Group style={{textAlign: 'start', paddingTop: '1em'}}
                        key={input.name} controlId={`formBasic${input.name}`}>
                            <Form.Label>{input.placeholder}</Form.Label>
                            <Form.Control required 
                                onChange={(e) => onChangeInput(input.name, e.target.value)} 
                                type={input.type} placeholder={input.placeholder}/>
                        </Form.Group>
                    );
                })
            }
            <Button style={{margin: '1em'}} variant="primary" type="submit">{props.action}</Button>
        </Form>
    );
}


export default AutoForm;