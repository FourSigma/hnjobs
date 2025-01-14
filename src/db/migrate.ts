import { runMigrate } from ".";

runMigrate()
    .then(() => {
        console.log("migration successful");
    })
    .then(() => {
        console.log("finished");
        process.exit(0);
    })
    .catch((err: Error) => {
        console.error(err);
        process.exit(-1);
    });
