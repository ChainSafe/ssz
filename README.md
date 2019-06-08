<p align="center">Webpack + Babel + TypeScript + React Boilerplate</p>
<p align="center">
  <a href="https://david-dm.org/saltyshiomix/babel-typescript-react-boilerplate">
    <img src="https://david-dm.org/saltyshiomix/babel-typescript-react-boilerplate.svg">
  </a>
  <a href="https://david-dm.org/saltyshiomix/babel-typescript-react-boilerplate?type=dev">
    <img src="https://david-dm.org/saltyshiomix/babel-typescript-react-boilerplate/dev-status.svg">
  </a>
</p>

As of `babel@7`, now we can handle `.ts` or `.tsx` files same as `.js` or `.jsx` files like this:

```js
// webpack.config.js

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  module: {
    rules: [
      {
        test: [/\.jsx?$/, /\.tsx?$/],
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
}
```

**Use `babel-loader` to `/\.tsx?$/` ?!**

Yes, `babel-loader`. See `.babelrc`:

```json
{
  "presets": [
    "@babel/env",
    "@babel/react",
    "@babel/typescript"
  ]
}
```

Thanks to `@babel/preset-typescript`, we can handle `/\.tsx?$/` files same as `/\.jsx?$/` files :)

## How to use

```bash
# install dependencies
$ yarn

# start a server (development mode)
# it automatically opens `http://localhost:8080` in your default browser, and you'll see "Babel + TypeScript + React = ❤️"
$ yarn dev

# check your types
$ yarn check-types

# production build
$ yarn build

# start a server (production mode)
$ yarn start
```
