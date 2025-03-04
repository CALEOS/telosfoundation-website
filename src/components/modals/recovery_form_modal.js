import React, {Component} from 'react';
import {Modal, FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap';
import axios from 'axios';
import {RECOVERY_FORM_ENDPOINT} from '../../config/constants';

import '../../styles/recovery_form_modal.css';

const alphaNumbericRegex = new RegExp(/^[a-zA-Z0-9_\-]+$/);

export default class RecoveryFormModal extends Component {

	constructor(props){
		super(props);
		this.state = {
			email: '',
			ethereumAddress: '',
			newlyGenerated: '',
			signature: '',
			ethereumAddressTouched: false,
			newlyGeneratedTouched: false,
			formSubmitted: false
		};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleEmailChange = this.handleEmailChange.bind(this);
		this.handleEthereumChange = this.handleEthereumChange.bind(this);
		this.handleGeneratedChange = this.handleGeneratedChange.bind(this);
		this.handleSignatureChange = this.handleSignatureChange.bind(this);
	}

	handleSubmit(e){
		e.preventDefault();
		//validate and submit

		const {
			email,
			ethereumAddress,
			newlyGenerated,
			signature
		} = this.state;

		//validation will go here.
		if(
			!this.getEthereumValidationState() ||
			!this.getGeneratedValidationState()
		){
			this.setState({
				ethereumAddressTouched: true,
				newlyGeneratedTouched: true
			});
			return;
		}

		const formData = {
			email: email.trim(),
			ethereumAddress: ethereumAddress.trim(),
			generatedPublicKey: newlyGenerated.trim(),
			signature: signature.trim()
		};

		axios.post(
			RECOVERY_FORM_ENDPOINT,
			formData
		).then(res => {
			console.log(res.data);
			this.setState({formSubmitted: true});
		})
		.catch(error => console.log(error));
	}

	handleEmailChange(e){
		this.setState({
			email: e.target.value
		});
	}

	handleEthereumChange(e){
		this.setState({
			ethereumAddress: e.target.value
		});
	}

	handleGeneratedChange(e){
		this.setState({
			newlyGenerated: e.target.value
		});
	}

	handleSignatureChange(e){
		this.setState({
			signature: e.target.value
		});
	}

	/*validation states*/
	getEthereumValidationState(){
		const {ethereumAddress, ethereumAddressTouched} = this.state;
		if(!ethereumAddressTouched) return null;

		if(ethereumAddress.slice(0, 2) !== '0x') return 'error';

		if(
			!alphaNumbericRegex.test(ethereumAddress) ||
			ethereumAddress.length !== 42
		){
			return 'error';
		}
		return 'success';
	}

	getGeneratedValidationState(){
		const {newlyGenerated, newlyGeneratedTouched} = this.state;
		if(!newlyGeneratedTouched) return null;

		if(!alphaNumbericRegex.test(newlyGenerated)) return 'error';

		if(newlyGenerated.slice(0, 4) === 'TLOS'){
			if(newlyGenerated.length === 54) return 'success';
			return 'error';
		}else if(newlyGenerated.slice(0, 3) === 'EOS'){
			if(newlyGenerated.length === 53) return 'success';
			return 'error';
		}else{
			return 'error';
		}
	}

	renderForm(){
		const {
			email_label,
			ethereum_label,
			generated_label,
			signature_label
		} = this.props.recovery_form;

		return (
        	<div className='recovery_form'>
            	<form onSubmit={this.handleSubmit}>
            		<FormGroup>
            			<ControlLabel
            				htmlFor='email'
            			>
            				{email_label}
            			</ControlLabel>
            			<FormControl
            				id='email'
            				required={false}
            				type='email'
            				value={this.state.email}
            				onChange={this.handleEmailChange}
            			/>
            		</FormGroup>
            		<FormGroup validationState = {this.getEthereumValidationState()}>
            			<ControlLabel
            				htmlFor='ethereumAddress'
            			>
            				{ethereum_label}
            			</ControlLabel>
            			<FormControl
            				id='ethereumAddress'
            				required={true}
            				type='text'
            				value={this.state.ethereumAddress}
            				placeholder='ex: 0x3770054Fa2X911s743143754a1900w9216m2So14'
            				onChange={this.handleEthereumChange}
            				onFocus={() => this.setState({ethereumAddressTouched: true})}
            			/>
            		</FormGroup>
            		<FormGroup validationState = {this.getGeneratedValidationState()}>
            			<ControlLabel
            				htmlFor='generatedKey'
            			>
            				{generated_label}
            			</ControlLabel>
            			<FormControl
            				id='generatedKey'
            				required={true}
            				type='text'
            				value={this.state.newlyGenerated}
            				placeholder='ex: TLOS3sTEi9o2e8Qe1MFijlsUIDpAER4wHhXYgEsOeeW8POrUgiKDFe'
            				onChange={this.handleGeneratedChange}
            				onFocus={() => this.setState({newlyGeneratedTouched: true})}
            			/>
            		</FormGroup>
            		<FormGroup>
            			<ControlLabel
            				htmlFor='signature'
            			>
            				{signature_label}
            			</ControlLabel>
            			<textarea
            				id='signature'
            				className='form-control'
            				value={this.state.signature}
            				onChange={this.handleSignatureChange}
            			></textarea>
            		</FormGroup>
            		<Button 
            			type='submit'
            			bsSize='large'
            			bsStyle='primary'
            		>
            			SUBMIT
            		</Button>
            	</form>
        	</div>
		);
	}

	renderSubmissionResponse(){
		const {response} = this.props.recovery_form;

		return (
			<div className='recovery_form_response'>
				<h4>{response}</h4>
			</div>
		);
	}

	render(){
		const {heading} = this.props.recovery_form;

		return (
            <Modal
            	show={this.props.show}
            	onHide={this.props.onHide}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{heading}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                	{this.state.formSubmitted ? this.renderSubmissionResponse() : this.renderForm() }
                </Modal.Body>
            </Modal>
		);
	}
}