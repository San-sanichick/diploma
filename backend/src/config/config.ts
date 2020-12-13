const config = {
    port: 5000,
    db: {
        address: "mongodb://localhost:27017/",
        name: "test"
    },
    frontOrigin: "http://localhost:8080",
    ACCESS_TOKEN_SECRET : process.env["ACCESS_TOKEN_SECRET"]                || "swsh23hjddnns",
    ACCESS_TOKEN_LIFE   : process.env["ACCESS_TOKEN_LIFE"]                  || 30,
    REFRESH_TOKEN_SECRET: process.env["dhw782wujnd99ahmmakhanjkajikhiwn2n"] || "dhw782wujnd99ahmmakhanjkajikhiwn2n",
    REFRESH_TOKEN_LIFE  : process.env["REFRESH_TOKEN_LIFE"]                 || "2y"
}

export default config;