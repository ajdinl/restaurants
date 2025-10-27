const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    try {
        const envPath = path.join(__dirname, '..', '.env.local');
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/MONGODB_URI=(.+)/);
        if (match) {
            MONGODB_URI = match[1].trim();
        }
    } catch (error) {
        console.error('Could not read .env.local file');
    }
}

if (!MONGODB_URI) {
    console.error('MONGODB_URI not found. Please set it in .env.local or as an environment variable.');
    process.exit(1);
}

async function fixOrphanedRecords() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;

        const tables = await db.collection('tables').find({}).toArray();
        const restaurants = await db.collection('restaurants').find({}).toArray();

        console.log(`Found ${tables.length} tables`);
        console.log(`Found ${restaurants.length} restaurants`);

        for (const restaurant of restaurants) {
            const restaurantTables = tables.filter((t) => t.restaurant_id.toString() === restaurant._id.toString());

            const orders = await db.collection('orders').find({ restaurant_id: restaurant._id }).toArray();

            const reservations = await db.collection('reservations').find({ restaurant_id: restaurant._id }).toArray();

            console.log(
                `\nRestaurant: ${restaurant.name} - ${restaurantTables.length} tables, ${orders.length} orders, ${reservations.length} reservations`
            );

            for (const order of orders) {
                if (order.table_number && !order.table_id) {
                    let table = restaurantTables.find((t) => t.number === order.table_number);

                    if (!table) {
                        console.log(`  ⚠️  Creating missing table #${order.table_number} for order #${order.number}`);
                        const newTable = {
                            restaurant_id: restaurant._id,
                            number: order.table_number,
                            capacity: 4,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        };
                        const result = await db.collection('tables').insertOne(newTable);
                        table = { ...newTable, _id: result.insertedId };
                        restaurantTables.push(table);
                    }

                    await db.collection('orders').updateOne(
                        { _id: order._id },
                        {
                            $set: { table_id: table._id },
                            $unset: { table_number: '' },
                        }
                    );
                    console.log(`  ✓ Migrated order #${order.number} to table_id`);
                }
            }

            for (const reservation of reservations) {
                if (reservation.table_number && !reservation.table_id) {
                    let table = restaurantTables.find((t) => t.number === reservation.table_number);

                    if (!table) {
                        console.log(
                            `  ⚠️  Creating missing table #${reservation.table_number} for reservation #${reservation.number}`
                        );
                        const newTable = {
                            restaurant_id: restaurant._id,
                            number: reservation.table_number,
                            capacity: reservation.capacity || 4,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        };
                        const result = await db.collection('tables').insertOne(newTable);
                        table = { ...newTable, _id: result.insertedId };
                        restaurantTables.push(table);
                    }

                    await db.collection('reservations').updateOne(
                        { _id: reservation._id },
                        {
                            $set: { table_id: table._id },
                            $unset: { table_number: '' },
                        }
                    );
                    console.log(`  ✓ Migrated reservation #${reservation.number} to table_id`);
                }
            }
        }

        console.log('\n✅ Fix completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Fix failed:', error);
        process.exit(1);
    }
}

fixOrphanedRecords();
