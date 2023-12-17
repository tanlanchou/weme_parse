// 引入需要的库
const axios = require('axios');
const log = require('./log');

function getHtml(url) {
    log.error(`开始请求:${url}`);
    return axios.get(url)
        .then(response => {
            return response.data;
        })
        .catch(err => {
            // 输出错误信息
            log.error('请求失败:', err);
        });
}

function getImage(url) {
    return axios({  
        method: 'get',  
        url: url,  
        responseType: 'stream' // 这很重要，以流的形式获取响应体  
    })  
    .then(response => {  
        // 使用 writeFile 或 writeFileSync 根据你的需求来保存文件  
        return response.data
    })  
    .catch(error => {  
        console.error('Error:', error);  
    });
}

module.exports = {
    getHtml,
    getImage
}