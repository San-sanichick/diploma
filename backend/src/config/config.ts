const config = {
    port: process.env.PORT || 5000,
    db: {
        address: process.env["MONGO_URI"] || "mongodb://localhost:27017/",
        name: process.env["DBNAME"] || "test"
    },
    frontOrigin: process.env["ORIGIN_URI"] || "http://localhost:8080",
    ACCESS_TOKEN_SECRET : process.env["ACCESS_TOKEN_SECRET"]                || "swsh23hjddnns",
    ACCESS_TOKEN_LIFE   : process.env["ACCESS_TOKEN_LIFE"]                  || 86400,
    REFRESH_TOKEN_SECRET: process.env["REFRESH_TOKEN_SECRET"]               || "dhw782wujnd99ahmmakhanjkajikhiwn2n",
    REFRESH_TOKEN_LIFE  : process.env["REFRESH_TOKEN_LIFE"]                 || "2y"
}

export default config;