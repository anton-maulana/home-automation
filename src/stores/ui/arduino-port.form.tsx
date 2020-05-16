import { Form } from 'mobx-react-form';
import dvr from 'mobx-react-form/lib/validators/DVR'
import validatorjs from 'validatorjs';
import en from 'validatorjs/src/lang/en';

validatorjs.setMessages('en', en);

export default class ArduinoPortForm extends Form {
    
    plugins() {
        return {
            dvr: dvr(validatorjs)
        }
    }

    setup() {
        return {
            fields: [
                {
                    name: 'id',
                    label: 'Id',
                    placeholder: 'Id',
                    rules: 'numeric',
                }, 
                {
                    name: 'description',
                    label: 'Descriptions',
                    placeholder: 'Descriptions',
                    rules: 'required|string',
                },
                {
                    name: 'name',
                    label: 'Name',
                    placeholder: 'Name',
                    rules: 'required|string',
                },
                {
                    name: 'value',
                    label: 'Port Number',
                    placeholder: 'Port Number',
                    rules: 'required|numeric',
                }
            ]
        }
    }

    hooks() {
        return {            
            onSuccess(form) {
                console.log(form.values());
            },
            onError(form) {
                console.log(form.errors());
            }
        }
    }
}