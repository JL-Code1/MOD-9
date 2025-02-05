import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, _, next) => {
    console.log(`➡️ Incoming Request: ${req.method} ${req.url}`);
    console.log(`📦 Body:`, req.body);
    next();
});


// ✅ Register API routes FIRST
console.log("➡️ Attempting to register API routes...");
app.use('/api', routes);
console.log("✅ API routes should be registered now.");


// ✅ Serve static frontend files, but ONLY if they exist
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
    app.use(express.static(clientDistPath));
} else {
    console.warn("⚠️ WARNING: Frontend `client/dist/` folder is missing. API will still work.");
}

// ✅ Catch-all route should be the LAST middleware
const indexPath = path.join(clientDistPath, 'index.html');
if (fs.existsSync(indexPath)) {
    app.get('*', (_, res) => {
        res.sendFile(indexPath);
    });
}

// ✅ Debugging: Print all registered routes
// ✅ Debugging: Force print all registered routes in Express
console.log("\n✅ FINAL ROUTE CHECK BEFORE SERVER START:");
app._router.stack.forEach((middleware: any) => {
    if (middleware.route) { 
        console.log(`➡️ Registered route: ${middleware.route.path}`);
    } else if (middleware.name === 'router') { 
        middleware.handle.stack.forEach((handler: any) => {
            if (handler.route) {
                console.log(`➡️ Registered nested route: ${handler.route.path}`);
            }
        });
    }
});
console.log("✅ FINAL ROUTE CHECK COMPLETE.\n");


// ✅ Start the server
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
