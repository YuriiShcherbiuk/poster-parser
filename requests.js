import axios from 'axios';

const get = async function (url) {
    if (!!url) {
        try {
            return await axios.get(url, {
                timeout: 3000,
                headers: {
                    'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 ${Math.trunc(
                        Math.random() * 100000
                    )}`,
                    'X-App-Hdrezka-App': 1,
                },
            });
        } catch {
            return null;
        }
    } else {
        return null;
    }
};

const getAll = async function (urls) {
    if (!!urls) {
        try {
            return await axios.all(
                urls.map((url) =>
                    axios.get(url, {
                        timeout: 3000,
                        headers: {
                            'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 ${Math.trunc(
                                Math.random() * 100000
                            )}`,
                            'X-App-Hdrezka-App': 1,
                        },
                    })
                )
            );
        } catch {
            return null;
        }
    } else {
        return null;
    }
};

export { get, getAll };
