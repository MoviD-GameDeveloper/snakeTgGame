const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',  // Точка входа
    output: {
        filename: 'bundle.js',  // Имя выходного файла
        path: path.resolve(__dirname, 'dist'),  // Папка для сборки
    },
    module: {
        rules: [
            {
                test: /\.css$/,  // Обработка CSS
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/,  // Обработка изображений
                use: ['file-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',  // Шаблон HTML
        }),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),  // Папка для разработки
        compress: true,
        port: 9000,
    },
};