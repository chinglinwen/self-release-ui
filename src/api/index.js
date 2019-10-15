import axios from 'axios';
// import User from '../user';
// import qs from 'qs';
import router from '../router';

// 环境的切换
if (process.env.NODE_ENV == 'production') {
    axios.defaults.baseURL = 'http://release.haodai.net';
} else {
    axios.defaults.baseURL = 'http://release.haodai.net';
}

// 请求超时时间
axios.defaults.timeout = 10000;

axios.defaults.withCredentials = true

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
        // if (res.data.code == '-1') {
        //     router.replace({
        //         path: '/passport/login',
        //         query: { redirect: router.currentRoute.fullPath }
        //     });
        // }
        return res;
    },
    // defined by validateStatus()
    // status >= 200 && status < 300 default
    error => {
        return Promise.reject({ code: -3, message: '后端服务访问失败' });
    }
);

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params, timeout) {
    return new Promise((resolve, reject) => {
        axios
            .get(url, {
                params: params,
                timeout: timeout
            })
            .then(res => {
                if (res.data.code == '0') {
                    resolve(res.data);
                } else {
                    reject(res.data);
                }
            })
            .catch(err => {
                console.error(url, "params: ", params, "err: ", err);
                if (err.code === -3) {
                    reject(err)
                }
                reject({ code: -1, message: '网络错误，请重试' });
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
        axios
            .post(url, data)
            .then(res => {
                if (res.data.code == '0') {
                    resolve(res.data);
                } else {
                    reject(res.data);
                }
            })
            .catch(err => {
                console.log(url, "data: ", data, "err: ", err);
                if (err.code === -3) {
                    reject(err)
                }
                reject({ code: -2, message: '网络错误，请重试' });
            });
    });
}