import { useState, useEffect } from 'react';
import '../styles/NewFile.css';
import '../styles/global.css';

function NewFile({ onSave, onClose, initialData, isReadOnly }) {
    const [name, setName] = useState(initialData?.name || '');
    const [content, setContent] = useState(initialData?.content || '');
    console.log("permissions:" + isReadOnly);
    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setContent(initialData.content || '');
        }
    }, [initialData]);

    const handleSave = () => {
        if (name.trim() === '') {
            alert('Please enter a file name');
            return;
        }
        onSave({ name, content });
        onClose();
    };

    return (
        <div className="new-file-container position-fixed top-0 start-0 w-100 h-100 z-3" style={{ overflowY: 'auto' }}> 
            <div className="container py-5">
                <div className="card border-0 shadow-sm rounded-4 mx-auto" style={{ maxWidth: '900px' }}>
                    <div className="card-header bg-white pt-4 px-4 d-flex justify-content-between align-items-center">
                        <h5 className="modal-title fs-4 fw-normal text-dark">
                            {initialData?.id ? 'Edit Document' : 'New Document'}
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="card-body p-4">
                        <div className="mb-4">
                            <label className="form-label text-muted small fw-bold text-uppercase">File Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                autoFocus
                                disabled={isReadOnly}
                                placeholder="Name your document"
                            ></input>
                        </div>
                        <div className="mb-4">
                            <label className="form-label text-muted small fw-bold text-uppercase">Content</label>
                            <textarea
                                className="form-control"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                disabled={isReadOnly}
                                placeholder="Start typing..."
                                style={{ resize: 'none', fontFamily: 'monospace', height: '500px', overflowY: 'scroll' }}
                            ></textarea>
                        </div>
                        <div className="d-flex justify-content-end gap-4">
                            <button type="button" className="btn btn-outline-primary rounded-pill fw-medium px-4"
                                onClick={onClose}>{initialData?.id ? 'cancel document editing' : 'Cancel document creation'}</button>
                            <button type="button" className="btn btn-primary rounded-pill fw-medium px-4"
                                onClick={handleSave}>{initialData?.id ? 'Save changes' : 'Create Document'}</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default NewFile;
