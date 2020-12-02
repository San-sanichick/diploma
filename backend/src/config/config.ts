const config = {
    port: 5000,
    db: {
        address: "mongodb://localhost:27017/",
        name: "test"
    },
    frontOrigin: "http://localhost:8080",
    JWT_SECRET: process.env["JWT_SECRET"] || "swsh23hjddnns"
}

export default config;