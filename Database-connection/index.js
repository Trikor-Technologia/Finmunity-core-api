import mongoose from "mongoose";
import chalk from "chalk";
export const database = () => {
    mongoose.connect(process.env.DATABASE_URL)
        .then(() => {
            console.log(chalk.green('Connected to MongoDB'));
        })
        .catch((error) => {
            console.error(chalk.red('Error connecting to MongoDB:', error));
        });
}