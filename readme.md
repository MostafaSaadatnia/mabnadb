## MabnaDB

![](https://33333.cdn.cke-cs.com/kSW7V9NHUXugvhoQeFaf/images/db60e41f65a10ecb8d46715c15c8235fa7f6979f1bd03150.png)

###   
**Description:** 

**"MabnaDB"** is a powerful TypeScript library designed for seamless data storage, retrieval, and management. Drawing inspiration from the efficiency of some well-known offline databases, **MabnaDB** offers a developer-friendly experience for handling data in your applications. Whether you are building web, mobile, or server applications, **MabnaDB** simplifies the process of working with data, providing a robust and flexible storage solution.

**Slogan:** “Empower Your Data with MabnaDB – Effortless Storage, Seamless Retrieval.”

---

**Installation:**
```bash
npm install mabnadb
```
---

**Simple Usage:**

```typescript
// src/example.ts
import MabnaDB from './MabnaDB';

const db = new MabnaDB();
db.put({ _id: '1', name: 'John' });
const result = db.get('1');
console.log(result);
```

---

### **Key Types:**

| Type | Description |
| --- | --- |
| **MabnaDBDocument** | Represents a database document with a mandatory **\_id** field and optional attachments. |
| **MabnaDBAttachment** | Represents an attachment associated with a document, consisting of a name and data. |
| **MabnaDBIndex** | Represents an index on a specified field, with an optional unique flag. |
| **MabnaDBChangeEvent** | Represents a change event with information about the operation and the affected document. |
| **MabnaDBTask** | Represents a background task with an ID, type, status, and optional result. |
| **MabnaDBSettings** | Contains settings for the database, including an optional debug mode. |
| **MabnaDBPlugin** | Represents a plugin that can be applied to the database. |

---

### **Key Features and Methods:**

| Feature / Method | Description |
| --- | --- |
| **Constructor** | Represents a database document with a mandatory **\_id** field and optional attachments. |
| **CRUD Operations** | 
*   **put**: Inserts or updates a document.
*   **get**: Retrieves a document by its ID.
*   **update**: Updates a document.
*   **remove**: Deletes a document.
*   **getAll**: Retrieves all documents.
*   **fetchDocument**: Retrieves a document based on custom criteria.
*   **deleteDocument**: Deletes a document by ID.
*   **batchCreate**: Inserts multiple documents.
*   **batchFetch**: Retrieves multiple documents by ID.

 |
| **Indexing** | 

*   **createIndex**: Creates an index on a specified field.
*   **queryIndex**: Queries an index for documents based on a field and value.
*   **explainIndex**: Provides information about an index.
*   **listIndexes**: Lists all indexes.
*   **deleteIndex**: Deletes an index.

 |
| **Replication and Synchronization** | 

*   **replicate**: Replicates changes to another MabnaDB instance.
*   **sync**: Bi-directional synchronization between two MabnaDB instances.

 |
| **Attachments** | 

*   **saveAttachment**: Saves an attachment to a document.
*   **getAttachment**: Retrieves an attachment from a document.
*   **deleteAttachment**: Deletes an attachment from a document.

 |
| **Map-Reduce Views** | 

*   **mapReduce**: Executes a map-reduce operation on all documents.
*   **createView**: Creates a named view with a map and reduce function.
*   **getView**: Retrieves the results of a named view.

 |
| **Database Information** | **getDatabaseInfo**: Retrieves information about the database. |
| **Utility Methods** | 

*   **compact**: Compacts the database by removing deleted documents.
*   **getRevisionDiff**: Retrieves the differences between two revisions of a document.
*   **bulkGet**: Retrieves multiple documents by ID.

 |
| **Event Handling** | 

*   **on**: Adds an event listener.
*   **emit**: Emits an event with associated data.

 |
| **Task Management** | 

*   **startTask**: Starts a background task.
*   **completeTask**: Completes a background task.
*   **failTask**: Fails a background task.

 |
| **Asynchronous Operations** | **putAsync**: Asynchronously puts a document. |
| **Configuration and Debugging** | 

*   **configure**: Configures the database with settings.
*   **logDebug**: Logs debug messages if debug mode is enabled.

 |
| **Plugin System** | 

*   **use**: Adds a plugin to the database.
*   **applyPlugins**: Applies all registered plugins.

 |
| **Database Closure** | **close**: Closes the database, performing cleanup if needed. |

_**This class serves as a foundation for an in-memory database with extensibility through plugins and various features for managing data, attachments, indexes, replication, and more.**_

### **Keywords:**

#TypeScript\_Database #Data\_Storage #PouchDB\_Alternative #NoSQL #Lightweight #Seamless\_Integration #Developer\_Friendly #Cross\_Platform #TypeScript\_Library #Web\_Development #Mobile\_Development #Server\_Applications #Efficient\_Data\_Management #JSON\_Documents