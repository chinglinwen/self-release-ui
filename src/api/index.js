import axios from 'axios';
// import User from '../user';
// import qs from 'qs';
import router from '../router';

// 环境的切换
if (process.env.NODE_ENV == 'production') {
    // axios.defaults.baseURL = 'http://www.hdyx.haodai.net/';
    axios.defaults.baseURL = 'http://192.168.10.234:8089/';
}

// 请求超时时间
axios.defaults.timeout = 10000;

// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

// 请求拦截器
// axios.interceptors.request.use(
//     config => {
//         if ((config.data || config.method.toLowerCase() != 'GET') && config.url.indexOf('auth/login_pwd') === -1) {
//             User.isLogin() && (config.data['access_token'] = User().access_token);
//             config.data = qs.stringify(config.data);
//         }
//         return config;
//     },
//     error => {
//         return Promise.error(error);
//     }
// );

// 响应拦截器
axios.interceptors.response.use(
    res => {
        if (res.data.result_code == '-1') {
            router.replace({
                path: '/passport/login',
                query: { redirect: router.currentRoute.fullPath }
            });
        }
        return res;
    },
    // defined by validateStatus()
    // status >= 200 && status < 300 default
    error => {
        return Promise.reject({ result_code: -2, result_msg: '网络错误，请重试' });
    }
);

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
    return new Promise((resolve, reject) => {
        axios
            .get(url, {
                params: params
            })
            .then(res => {
                if (res.data.result_code == '0') {
                    resolve(res.data);
                } else {
                    // todo
                    if (res.data && res.data.data && res.data.data.error && res.data.data.error.length) {
                        res.data.result_msg = res.data.data.error[0];
                    }
                    reject(res.data);
                }
            })
            .catch(err => {
                console.error(err);
                reject({ result_code: -1, result_msg: '网络错误，请重试' });
            });
    });
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, data) {
    return new Promise((resolve, reject) => {
        console.log(url, data);
        axios
            .post(url, data)
            .then(res => {
                if (res.data.result_code == '0') {
                    resolve(res.data);
                } else {
                    // todo
                    if (res.data && res.data.data && res.data.data.error && res.data.data.error.length) {
                        res.data.result_msg = res.data.data.error[0];
                    }
                    reject(res.data);
                }
            })
            .catch(err => {
                console.error(err);
                reject({ result_code: -2, result_msg: '网络错误，请重试' });
            });
    });
}