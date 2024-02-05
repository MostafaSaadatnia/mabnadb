type MabnaDBDocument = { _id: string;[key: string]: any; attachments?: { [key: string]: string } };
type MabnaDBAttachment = { name: string; data: string };
type MabnaDIndex = { field: string; unique?: boolean };

class MabnaDB {
  private data: { [id: string]: MabnaDBDocument } = {};
  private indexes: { [field: string]: { [value: string]: string[] } } = {};
  private changes: { operation: string; document: MabnaDBDocument }[] = [];

  put(doc: MabnaDBDocument): void {
    if (!doc._id) {
      throw new Error('MabnaDBDocument must have an _id');
    }

    this.data[doc._id] = { ...doc };
    this.updateIndexes(doc);
    this.changes.push({ operation: 'put', document: { ...doc } });
  }

  get(id: string): MabnaDBDocument | null {
    const doc = this.data[id];
    return doc ? { ...doc } : null;
  }

  update(doc: MabnaDBDocument): void {
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
  }

  remove(id: string): void {
    if (!this.data[id]) {
      throw new Error(`Document with _id ${id} not found`);
    }

    // Remove values from indexes before removing the document
    this.removeIndexes(this.data[id]);

    delete this.data[id];
    this.changes.push({ operation: 'remove', document: { _id: id } });
  }

  getAll(): MabnaDBDocument[] {
    return Object.values(this.data).map((doc) => ({ ...doc }));
  }

  fetchDocument(criteria: (doc: MabnaDBDocument) => boolean): MabnaDBDocument | null {
    const matchingDocument = Object.values(this.data).find(criteria);
    return matchingDocument ? { ...matchingDocument } : null;
  }

  deleteDocument(id: string): void {
    if (!this.data[id]) {
      throw new Error(`Document with _id ${id} not found`);
    }

    delete this.data[id];
  }

  batchCreate(docs: MabnaDBDocument[]): void {
    docs.forEach((doc) => {
      if (!doc._id) {
        throw new Error('Documents must have an _id');
      }

      this.data[doc._id] = { ...doc };
    });
  }

  batchFetch(ids: string[]): MabnaDBDocument[] {
    const result: MabnaDBDocument[] = [];

    ids.forEach((id) => {
      const doc = this.data[id];
      if (doc) {
        result.push({ ...doc });
      }
    });

    return result;
  }

  getChanges(): { operation: string; document: MabnaDBDocument }[] {
    return [...this.changes];
  }

  clearChanges(): void {
    this.changes = [];
  }

  replicate(targetDB: MabnaDB): void {
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

  sync(targetDB: MabnaDB): void {
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

  saveAttachment(docId: string, attachment: MabnaDBAttachment): void {
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

  getAttachment(docId: string, attachmentName: string): string | null {
    const document = this.data[docId];

    if (document && document.attachments && document.attachments[attachmentName]) {
      return document.attachments[attachmentName];
    }

    return null;
  }

  deleteAttachment(docId: string, attachmentName: string): void {
    const document = this.data[docId];

    if (document && document.attachments && document.attachments[attachmentName]) {
      delete document.attachments[attachmentName];
      this.changes.push({
        operation: 'deleteAttachment',
        document: { _id: docId, attachments: { ...document.attachments } },
      });
    } else {
      throw new Error(`Attachment with name ${attachmentName} not found for document with _id ${docId}`);
    }
  }

  createIndex(index: MabnaDIndex): void {
    if (!index.field) {
      throw new Error('Index must have a field specified');
    }

    if (this.indexes[index.field]) {
      throw new Error(`Index on field ${index.field} already exists`);
    }

    this.indexes[index.field] = {};
    this.buildIndex(index.field);
  }

  private updateIndexes(doc: MabnaDBDocument): void {
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

  private removeIndexes(doc: MabnaDBDocument): void {
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

  private buildIndex(field: string): void {
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

  queryIndex(field: string, value: any): MabnaDBDocument[] {
    const result: MabnaDBDocument[] = [];

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

  explainIndex(field: string): { field: string; unique: boolean } | null {
    const index = this.indexes[field];

    if (index) {
      const unique = Object.values(index).every((ids) => ids.length === 1);
      return { field, unique };
    }

    return null;
  }

  listIndexes(): string[] {
    return Object.keys(this.indexes);
  }

  deleteIndex(field: string): void {
    if (this.indexes[field]) {
      delete this.indexes[field];
    } else {
      throw new Error(`Index on field ${field} does not exist`);
    }
  }

  mapReduce(mapFn: (doc: MabnaDBDocument) => any, reduceFn: (values: any[]) => any[]): any[] {
    const mappedResults: any[] = [];

    // Apply the map function to all documents
    for (const id in this.data) {
      const doc = this.data[id];
      const mappedResult = mapFn(doc);

      if (mappedResult !== undefined) {
        mappedResults.push(mappedResult);
      }
    }

    // Group mapped results by key
    const groupedResults: { [key: string]: any[] } = {};

    mappedResults.forEach((result) => {
      const key = result.key;

      if (!groupedResults[key]) {
        groupedResults[key] = [];
      }

      groupedResults[key].push(result.value);
    });

    // Apply the reduce function to grouped results
    const reducedResults: any[] = [];

    for (const key in groupedResults) {
      const values = groupedResults[key];
      const reducedResult = reduceFn(values);

      if (reducedResult !== undefined) {
        reducedResults.push({ key, value: reducedResult });
      }
    }

    return reducedResults;
  }


  destroy(): void {
    this.data = {};
  }
}
