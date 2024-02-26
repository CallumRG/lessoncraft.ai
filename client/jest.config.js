module.exports = {
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest",
    },
    testEnvironment: 'jsdom',
    moduleNameMapper: {
      "\\.(css|sass|scss)$": "identity-obj-proxy",
    },
    "transformIgnorePatterns": [
      "/node_modules/(?!(axios)/)"
    ]
  };