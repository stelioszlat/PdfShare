import React, { useCallback } from 'react';

import './FileSelector.css';

const FileSelector = props => {

    return (
        <>
            <label for="file-upload" class="main-selector">
                Upload File
            </label>
            <input id="file-upload" type="file" name="file"/>
        </>
    );
}

export default FileSelector;