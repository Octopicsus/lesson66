import { connect, MyDBC, MyDBC_NEW } from './server.js';

export async function iterateUsersCursor(callback, options = {}) {
    const myDB = await connect();
    const usersCollection = myDB.collection(MyDBC);
    const { sort = {}, skip = 0, limit = 0 } = options;
    
    let query = usersCollection.find({}, { 
        projection: { password: 0 } 
    });

    if (Object.keys(sort).length > 0) {
        query = query.sort(sort);
    }

    if (skip > 0) {
        query = query.skip(skip);
    }
    
    if (limit > 0) {
        query = query.limit(limit);
    }

    const results = [];

    try {
        await query.forEach(doc => {
            const processedDoc = callback(doc);
            if (processedDoc !== undefined) {
                results.push(processedDoc);
            }
        });
    } catch (error) {
        throw error;
    }

    return results;
}

export async function iterateNewListCursor(callback, options = {}) {
    const myDB = await connect();
    const newListCollection = myDB.collection(MyDBC_NEW);
    const { sort = {}, skip = 0, limit = 0 } = options;
    
    let query = newListCollection.find({}, { 
        projection: { password: 0 } 
    });

    if (Object.keys(sort).length > 0) {
        query = query.sort(sort);
    }

    if (skip > 0) {
        query = query.skip(skip);
    }
    
    if (limit > 0) {
        query = query.limit(limit);
    }

    const results = [];

    try {
        await query.forEach(doc => {
            const processedDoc = callback(doc);
            if (processedDoc !== undefined) {
                results.push(processedDoc);
            }
        });
    } catch (error) {
        throw error;
    }

    return results;
}

export async function countUsersByCursor() {
    const myDB = await connect();
    const usersCollection = myDB.collection(MyDBC);
    
    let count = 0;
    
    try {
        await usersCollection.find({}, { projection: { _id: 1 } }).forEach(() => {
            count++;
        });
    } catch (error) {
        throw error;
    }

    return count;
}
