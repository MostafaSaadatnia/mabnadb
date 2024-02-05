type MabnaDBDocument = { _id: string;[key: string]: any; attachments?: { [key: string]: string } };
type MabnaDBAttachment = { name: string; data: string };

class MabnaDB {
  private data: { [id: string]: MabnaDBDocument } = {};
  private changes: { operation: string; document: MabnaDBDocument }[] = [];

  put(doc: MabnaDBDocument): void {
    if (!doc._id) {
      throw new Error('MabnaDBDocument must have an _id');
    }

    this.data[doc._id] = { ...doc };
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

    this.data[doc._id] = { ...this.data[doc._id], ...doc };
    this.changes.push({ operation: 'update', document: { ...doc } });
  }

  remove(id: string): void {
    if (!this.data[id]) {
      throw new Error(`Document with _id ${id} not found`);
    }

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

  destroy(): void {
    this.data = {};
  }
}
