type MabnaDBDocument = { _id: string; [key: string]: any };

class MabnaDB {
  private data: { [id: string]: MabnaDBDocument } = {};

  put(doc: MabnaDBDocument): void {
    if (!doc._id) {
      throw new Error('MabnaDBDocument must have an _id');
    }

    this.data[doc._id] = { ...doc };
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
  }

  remove(id: string): void {
    delete this.data[id];
  }

  getAll(): MabnaDBDocument[] {
    return Object.values(this.data).map((doc) => ({ ...doc }));
  }
}
