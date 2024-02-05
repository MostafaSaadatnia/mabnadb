const myDB = new MabnaDB();

// Example usage:
myDB.put({ _id: '1', name: 'John Doe', age: 30 });
myDB.put({ _id: '2', name: 'Jane Smith', age: 25 });

const retrievedDoc = myDB.get('1');
console.log(retrievedDoc); // Output: { _id: '1', name: 'John Doe', age: 30 }

myDB.update({ _id: '1', age: 31 });
console.log(myDB.get('1')); // Output: { _id: '1', name: 'John Doe', age: 31 }

myDB.remove('2');
console.log(myDB.getAll()); // Output: [{ _id: '1', name: 'John Doe', age: 31 }]