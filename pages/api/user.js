import { ObjectId } from "mongodb";
import clientPromise from "../../lib/mongodb";

async function updateUser(req, res, db) {
    try {
        await db.collection('users').updateOne(
            {
                _id: new ObjectId(req.body),
            },
            { $set: { published: true } }
        );

        // return a message
        return res.json({
            message: 'User updated successfully',
            success: true,
        });
    } catch (error) {

        // return an error
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
}

async function addUser(req, res, db) {
    try {
        const parsedBody = JSON.parse(req.body)
        await db.collection('users').insertOne({
            name: parsedBody.name,
            phoneNumber: parsedBody.phoneNumber,
            date: parsedBody.date,
            _id: new ObjectId(),
        });
        // return a message
        return res.json({
            message: 'User added successfully',
            success: true,
        });
    } catch (error) {
        // return an error
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
}
async function getUsers(req, res, db) {
    let currentPage = Number(req.query.currentPage)
    let nPerPage = Number(req.query.nPerPage)
    try {
        let users = await db
            .collection('users')
            .find({})
            .sort({ date: -1 })
            .skip(currentPage > 0 ? ((currentPage - 1) * nPerPage) : 0)
            .limit(nPerPage)
            .toArray();
        let count = await db
            .collection('users')
            .count();
        // return the users
        // console.log({users})
        return res.json({
            message: JSON.parse(JSON.stringify({ count, users })),
            success: true,
        });
    } catch (error) {
        // return the error
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
}

async function deleteUser(req, res, db) {
    try {
        // console.log(JSON.parse(req.body), 'sdfsdfsd')

        await db.collection('users').deleteOne({
            _id: new ObjectId(JSON.parse(req.body)),
        })

        // returning a message
        return res.json({
            message: 'User deleted successfully',
            success: true,
        })
    } catch (error) {

        // returning an error
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
}

export default async function handler(req, res) {
    const client = await clientPromise;

    const db = client.db("test");
    switch (req.method) {
        case 'GET': {
            // console.log('getts')
            return getUsers(req, res, db);
        }

        case 'POST': {
            return addUser(req, res, db);
        }

        case 'PUT': {
            return updateUser(req, res, db);
        }

        case 'DELETE': {
            return deleteUser(req, res, db);
        }
    }
}
