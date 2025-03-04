import React from 'react';
import {Modal} from 'react-bootstrap';

const BannerModal = (props) => {
	return (
        <Modal
            {...props}
            bsSize='large'
        >
            <div className='download_banner_modal'>
                <Modal.Header closeButton>
                    <Modal.Title>Banner Download</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                	<img src={props.display_banner} alt='display banner' className='banner_modal_img' />
                </Modal.Body>
                <Modal.Footer>
                    <div className='banner_meta'>
                        <p>Type: <strong>JPG</strong></p>
                        <p>Size: <strong>{props.download_banner_file_size}</strong></p>
                    </div>
                	<a href={props.download_banner} download={props.download_banner_name} className='btn btn-lg btn-primary banner_download_btn'>DOWNLOAD</a>
                </Modal.Footer>
            </div>
        </Modal>
	);
};

export default BannerModal;