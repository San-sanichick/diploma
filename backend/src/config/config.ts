const config = {
    port: 3000,
    db: {
        address: "mongodb://localhost:27017/",
        name: "test"
    },
    frontOrigin: "http://localhost:8080",
    JWT_SECRET: process.env["JWT_SECRET"]
}

export default config;