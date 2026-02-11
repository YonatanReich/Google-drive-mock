import React from 'react';
import FileItem from './FileItem';
import '../styles/FileList.css';
import '../styles/global.css';

function FileList({ files = [], searchQuery, view, onFileClick, onDelete, onRestore, isTrash, onShare, onStar, isRecent, onViewDetails, onRenameFolder }) {
    // filter files based on search and sort them
    const filtered = files.filter(file => {
        const query = searchQuery.toLowerCase();
        const nameMatches = file.name && file.name.toLowerCase().includes(query);

        const contentMatches = file.content && file.content.toLowerCase().includes(query);
        console.log(`Searching file: ${file.name}, hasContent: ${!!file.content}`);
        return nameMatches || contentMatches;
    });

    const filteredFiles = isRecent
        ? filtered
        : [...filtered].sort((a, b) => {
            if (a.isFolder && !b.isFolder) return -1;
            if (!a.isFolder && b.isFolder) return 1;
            return a.name.localeCompare(b.name);
        });

    // show message if list is empty
    if (filteredFiles.length === 0) {
        return <p>{isTrash ? "Trash is empty" : "No files yet."}</p>;
    }

    // render list container with dynamic class for view type
    return (
        <div className={`file-list ${view === 'grid' ? 'grid-view' : 'list-view'}`}>
            {filteredFiles.map(file => (
                <FileItem
                    key={file.id}
                    file={file}
                    view={view}
                    onClick={onFileClick}
                    onDelete={onDelete}
                    onRestore={onRestore}
                    isTrash={isTrash}
                    onShare={onShare}
                    onStar={onStar}
                    onViewDetails={onViewDetails}
                    onRenameFolder={onRenameFolder}

                />
            ))}
        </div>
    );
}

export default FileList;