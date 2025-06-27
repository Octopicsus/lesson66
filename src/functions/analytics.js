import { connect, MyDBC, MyDBC_NEW } from './server.js';


export async function getUsersStats() {
    const myDB = await connect();
    const usersCollection = myDB.collection(MyDBC);
    
    const stats = await usersCollection.aggregate([
        {
            $group: {
                _id: null,
                totalUsers: { $sum: 1 },
                avgNameLength: { $avg: { $strLenCP: "$name" } }
            }
        },
        {
            $project: {
                _id: 0,
                totalUsers: 1,
                avgNameLength: { $round: ["$avgNameLength", 2] }
            }
        }
    ]).toArray();
    
    return stats[0] || { totalUsers: 0, avgNameLength: 0 };
}
