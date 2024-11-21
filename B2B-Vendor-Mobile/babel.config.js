// module.exports = function(api) {
//   api.cache(true);
//   return {
//     presets: ['babel-preset-expo'],
//     plugins: ['react-native-reanimated/plugin'],
//   };
// };
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin', // Keep this at the end
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env', // Path to your .env file
        },
      ],
    ],
  };
};
