"use strict";
class MabnaDB {
    data = {};
    indexes = {};
    changes = [];
    views = {};
    isOpen = true;
    eventListeners = {};
    activeTasks = [];
    taskIdCounter = 1;
    settings = {};
    plugins = [];
    constructor() {
        // Initialize the database
        // Apply plugins during database initialization
        this.applyPlugins();
    }
    put(doc) {
        if (!doc._id) {
            throw new Error('MabnaDBDocument must have an _id');
        }
        this.data[doc._id] = { ...doc };
        this.updateIndexes(doc);
        this.changes.push({ operation: 'put', document: { ...doc } });
        this.logDebug(`Document ${doc._id} was put.`);
    }
    get(id) {
        const doc = this.data[id];
        this.logDebug(`Document ${doc._id} was get.`);
        return doc ? { ...doc } : null;
    }
    update(doc) {
        if (!doc._id) {
            throw new Error('MabnaDBDocument must have an _id');
        }
        if (!this.data[doc._id]) {
            throw new Error(`MabnaDBDocument with _id ${doc._id} not found`);
        }
        // Remove old values from indexes before updating the document
        this.removeIndexes(this.data[doc._id]);
        this.data[doc._id] = { ...this.data[doc._id], ...doc };
        this.updateIndexes(this.data[doc._id]);
        this.changes.push({ operation: 'update', document: { ...doc } });
        this.logDebug(`Document ${doc._id} was update.`);
    }
    remove(id) {
        if (!this.data[id]) {
            throw new Error(`Document with _id ${id} not found`);
        }
        // Remove values from indexes before removing the document
        this.removeIndexes(this.data[id]);
        delete this.data[id];
        this.changes.push({ operation: 'remove', document: { _id: id } });
    }
    getAll() {
        return Object.values(this.data).map((doc) => ({ ...doc }));
    }
    fetchDocument(criteria) {
        const matchingDocument = Object.values(this.data).find(criteria);
        return matchingDocument ? { ...matchingDocument } : null;
    }
    deleteDocument(id) {
        if (!this.data[id]) {
            throw new Error(`Document with _id ${id} not found`);
        }
        delete this.data[id];
    }
    batchCreate(docs) {
        docs.forEach((doc) => {
            if (!doc._id) {
                throw new Error('Documents must have an _id');
            }
            this.data[doc._id] = { ...doc };
        });
    }
    batchFetch(ids) {
        const result = [];
        ids.forEach((id) => {
            const doc = this.data[id];
            if (doc) {
                result.push({ ...doc });
            }
        });
        return result;
    }
    getChanges() {
        return [...this.changes];
    }
    clearChanges() {
        this.changes = [];
    }
    replicate(targetDB) {
        const changesToReplicate = this.getChanges();
        changesToReplicate.forEach(({ operation, document }) => {
            switch (operation) {
                case 'put':
                    targetDB.put(document);
                    break;
                case 'update':
                    targetDB.update(document);
                    break;
                case 'remove':
                    targetDB.remove(document._id);
                    break;
                default:
                    break;
            }
        });
        this.clearChanges();
    }
    sync(targetDB) {
        const sourceChanges = this.getChanges();
        const targetChanges = targetDB.getChanges();
        // Apply changes from the source database to the target database
        sourceChanges.forEach(({ operation, document }) => {
            switch (operation) {
                case 'put':
                    targetDB.put(document);
                    break;
                case 'update':
                    targetDB.update(document);
                    break;
                case 'remove':
                    targetDB.remove(document._id);
                    break;
                default:
                    break;
            }
        });
        // Apply changes from the target database to the source database
        targetChanges.forEach(({ operation, document }) => {
            switch (operation) {
                case 'put':
                    this.put(document);
                    break;
                case 'update':
                    this.update(document);
                    break;
                case 'remove':
                    this.remove(document._id);
                    break;
                default:
                    break;
            }
        });
        // Clear changes in both databases
        this.clearChanges();
        targetDB.clearChanges();
    }
    saveAttachment(docId, attachment) {
        if (!this.data[docId]) {
            throw new Error(`Document with _id ${docId} not found`);
        }
        const document = this.data[docId];
        if (!document.attachments) {
            document.attachments = {};
        }
        document.attachments[attachment.name] = attachment.data;
        this.changes.push({ operation: 'saveAttachment', document: { _id: docId, attachments: { ...document.attachments } } });
    }
    getAttachment(docId, attachmentName) {
        const document = this.data[docId];
        if (document && document.attachments && document.attachments[attachmentName]) {
            return document.attachments[attachmentName];
        }
        return null;
    }
    deleteAttachment(docId, attachmentName) {
        const document = this.data[docId];
        if (document && document.attachments && document.attachments[attachmentName]) {
            delete document.attachments[attachmentName];
            this.changes.push({
                operation: 'deleteAttachment',
                document: { _id: docId, attachments: { ...document.attachments } },
            });
        }
        else {
            throw new Error(`Attachment with name ${attachmentName} not found for document with _id ${docId}`);
        }
    }
    createIndex(index) {
        if (!index.field) {
            throw new Error('Index must have a field specified');
        }
        if (this.indexes[index.field]) {
            throw new Error(`Index on field ${index.field} already exists`);
        }
        this.indexes[index.field] = {};
        this.buildIndex(index.field);
    }
    updateIndexes(doc) {
        for (const field in this.indexes) {
            const value = doc[field];
            if (value !== undefined) {
                if (!this.indexes[field][value]) {
                    this.indexes[field][value] = [];
                }
                this.indexes[field][value].push(doc._id);
            }
        }
    }
    removeIndexes(doc) {
        for (const field in this.indexes) {
            const value = doc[field];
            if (value !== undefined && this.indexes[field][value]) {
                const index = this.indexes[field][value].indexOf(doc._id);
                if (index !== -1) {
                    this.indexes[field][value].splice(index, 1);
                    if (this.indexes[field][value].length === 0) {
                        delete this.indexes[field][value];
                    }
                }
            }
        }
    }
    buildIndex(field) {
        for (const id in this.data) {
            const doc = this.data[id];
            const value = doc[field];
            if (value !== undefined) {
                if (!this.indexes[field][value]) {
                    this.indexes[field][value] = [];
                }
                this.indexes[field][value].push(id);
            }
        }
    }
    queryIndex(field, value) {
        const result = [];
        if (this.indexes[field] && this.indexes[field][value]) {
            this.indexes[field][value].forEach((id) => {
                const doc = this.data[id];
                if (doc) {
                    result.push({ ...doc });
                }
            });
        }
        return result;
    }
    explainIndex(field) {
        const index = this.indexes[field];
        if (index) {
            const unique = Object.values(index).every((ids) => ids.length === 1);
            return { field, unique };
        }
        return null;
    }
    listIndexes() {
        return Object.keys(this.indexes);
    }
    deleteIndex(field) {
        if (this.indexes[field]) {
            delete this.indexes[field];
        }
        else {
            throw new Error(`Index on field ${field} does not exist`);
        }
    }
    mapReduce(mapFn, reduceFn) {
        const mappedResults = [];
        // Apply the map function to all documents
        for (const id in this.data) {
            const doc = this.data[id];
            const mappedResult = mapFn(doc);
            if (mappedResult !== undefined) {
                mappedResults.push(mappedResult);
            }
        }
        // Group mapped results by key
        const groupedResults = {};
        mappedResults.forEach((result) => {
            const key = result.key;
            if (!groupedResults[key]) {
                groupedResults[key] = [];
            }
            groupedResults[key].push(result.value);
        });
        // Apply the reduce function to grouped results
        const reducedResults = [];
        for (const key in groupedResults) {
            const values = groupedResults[key];
            const reducedResult = reduceFn(values);
            if (reducedResult !== undefined) {
                reducedResults.push({ key, value: reducedResult });
            }
        }
        return reducedResults;
    }
    createView(name, mapFn, reduceFn) {
        this.views[name] = (doc) => this.mapReduce(mapFn, reduceFn);
    }
    getView(name) {
        const view = this.views[name];
        if (view) {
            return view(null); // Pass null as a placeholder for the map function
        }
        return null;
    }
    cleanupViews() {
        this.views = {};
    }
    getDatabaseInfo() {
        const size = this.calculateDatabaseSize();
        const numDocuments = Object.keys(this.data).length;
        const numIndexes = Object.keys(this.indexes).length;
        const numViews = Object.keys(this.views).length;
        return { size, numDocuments, numIndexes, numViews };
    }
    calculateDatabaseSize() {
        // This is a simple example, you might want to implement a more accurate size calculation
        return JSON.stringify({ data: this.data, indexes: this.indexes, views: this.views }).length;
    }
    compact() {
        const compactedData = {};
        const compactedIndexes = {};
        for (const id in this.data) {
            const doc = this.data[id];
            // Only include documents that haven't been deleted
            if (!this.isDeleted(doc)) {
                compactedData[id] = { ...doc };
            }
        }
        // Update indexes for the compacted data
        for (const field in this.indexes) {
            compactedIndexes[field] = {};
            for (const value in this.indexes[field]) {
                const ids = this.indexes[field][value];
                const compactedIds = ids.filter((id) => !!compactedData[id]);
                if (compactedIds.length > 0) {
                    compactedIndexes[field][value] = compactedIds;
                }
            }
        }
        this.data = compactedData;
        this.indexes = compactedIndexes;
    }
    isDeleted(doc) {
        // Check if the document has been deleted based on your deletion criteria
        // In this example, we assume a simple flag "_deleted"
        return doc._deleted === true;
    }
    getRevisionDiff(docId, fromRev, toRev) {
        const currentDoc = this.data[docId];
        if (!currentDoc) {
            throw new Error(`Document with _id ${docId} not found`);
        }
        const fromIndex = this.changes.findIndex((change) => change.document._id === docId && change.document._rev === fromRev);
        const toIndex = this.changes.findIndex((change) => change.document._id === docId && change.document._rev === toRev);
        if (fromIndex === -1 || toIndex === -1) {
            throw new Error(`Revisions ${fromRev} or ${toRev} not found for document ${docId}`);
        }
        const changesBetweenRevisions = this.changes.slice(fromIndex + 1, toIndex + 1);
        const added = [];
        const updated = [];
        const deleted = [];
        for (const change of changesBetweenRevisions) {
            const { operation, document } = change;
            switch (operation) {
                case 'put':
                    if (!this.data[document._id]) {
                        added.push(document._id);
                    }
                    else {
                        updated.push(document._id);
                    }
                    break;
                case 'remove':
                    deleted.push(document._id);
                    break;
                default:
                    // Other operations are ignored for revision diff
                    break;
            }
        }
        return { added, updated, deleted };
    }
    bulkGet(docIds) {
        const result = [];
        for (const docId of docIds) {
            const document = this.data[docId];
            if (document) {
                result.push({ ...document });
            }
        }
        return result;
    }
    close() {
        if (this.isOpen) {
            // Perform any necessary cleanup or finalization here
            // For simplicity, we'll just log a message in this example
            console.log('Closing the database');
            // Optionally, clear data and indexes
            this.data = {};
            this.indexes = {};
            // Update state to indicate that the database is closed
            this.isOpen = false;
        }
        else {
            console.log('The database is already closed');
        }
    }
    // purge(docId: string): void {
    //   const document = this.data[docId];
    //   if (document) {
    //     // Remove the document and all of its revisions
    //     delete this.data[docId];
    //     delete this.indexes[docId]; // Assuming you have indexes by docId
    //     // Optionally, mark the document as deleted to prevent conflicts with future revisions
    //     this.changes.push({ operation: 'remove', document: { ...document, _deleted: true } });
    //   }
    // }
    purge(docId) {
        const document = this.data[docId];
        if (document) {
            // Remove the document and all of its revisions
            delete this.data[docId];
            delete this.indexes[docId]; // Assuming you have indexes by docId
            // Optionally, mark the document as deleted to prevent conflicts with future revisions
            this.changes.push({ operation: 'remove', document: { _id: docId, _rev: document._rev, _deleted: true } });
        }
    }
    on(event, listener) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(listener);
    }
    emit(event, eventData) {
        const listeners = this.eventListeners[event];
        if (listeners) {
            for (const listener of listeners) {
                listener(eventData);
            }
        }
    }
    startTask(type) {
        const taskId = this.taskIdCounter++;
        const newTask = { id: taskId, type, status: 'running' };
        this.activeTasks.push(newTask);
        this.emit('taskStart', newTask);
        return taskId;
    }
    completeTask(taskId, result) {
        const taskIndex = this.activeTasks.findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) {
            const completedTask = this.activeTasks.splice(taskIndex, 1)[0];
            completedTask.status = 'completed';
            completedTask.result = result;
            this.emit('taskComplete', completedTask);
        }
    }
    failTask(taskId, error) {
        const taskIndex = this.activeTasks.findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) {
            const failedTask = this.activeTasks.splice(taskIndex, 1)[0];
            failedTask.status = 'failed';
            this.emit('taskFail', failedTask);
        }
    }
    // Example of an asynchronous operation
    async putAsync(document) {
        const taskId = this.startTask('put');
        try {
            // Simulate an asynchronous operation
            await new Promise((resolve) => setTimeout(resolve, 1000));
            this.put(document);
            this.completeTask(taskId);
        }
        catch (error) {
            this.failTask(taskId, error);
        }
    }
    configure(settings) {
        this.settings = { ...this.settings, ...settings };
    }
    logDebug(message) {
        if (this.settings.debug) {
            console.log(`[MabnaDB Debug] ${message}`);
        }
    }
    use(plugin) {
        this.plugins.push(plugin);
        plugin(this); // Initialize the plugin with the current instance
    }
    applyPlugins() {
        for (const plugin of this.plugins) {
            plugin(this);
        }
    }
    destroy() {
        this.data = {};
    }
}
