import express from 'express';
import { get, getAll } from './requests.js';
import { parseFilmsFromPage, parseFilm } from './parsing.js';
import { getDomain, getPosters, setData } from './db.js';

const app = express();

const data = {
    domain: '',
    posters: {},
};

async function* parseFilms() {
    const startUrls = [
        'http://hdrzk.org/films/page/1/',
        'http://hdrzk.org/series/page/1/',
        'http://hdrzk.org/cartoons/page/1/',
        'http://hdrzk.org/animation/page/1/',
        'http://hdrzk.org/show/page/1/',
        'http://hdrzk.org/announce/page/1/',
    ];
    let curr = 0;

    let currentUrl = startUrls[curr];

    data.domain = (await getDomain()).val() ?? '';
    data.posters = (await getPosters()).val() ?? {};

    while (!!currentUrl) {
        console.log(currentUrl);

        const res = await get(currentUrl);

        if (!!res) {
            const parse = parseFilmsFromPage(res.data);

            const films = parse.data;

            let count = 0;

            if (!!films) {
                const links = [];

                for (const film of films) {
                    if (film.id in data.posters) {
                        count++;
                    } else {
                        const domain = film.poster.match(
                            new RegExp(
                                /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/,
                                'igm'
                            )
                        )[0];

                        if (data.domain !== domain) {
                            data.domain = domain;
                        }

                        data.posters = {
                            ...data.posters,
                            [film.id]: {
                                listPoster: film.poster.replace(domain, ''),
                            },
                        };

                        links.push(film.link);
                    }
                }

                if (count === films.length) {
                    if (curr + 1 < startUrls.length) {
                        currentUrl = startUrls[curr + 1];
                        curr++;

                        continue;
                    } else {
                        console.log('Updating...');

                        return;
                    }
                }

                const res2 = await getAll(links);

                if (!!res2) {
                    for (const r of res2) {
                        const film = parseFilm(r.data);

                        data.posters[film.id] = {
                            ...data.posters[film.id],
                            optimizedPoster: film.optimizedPoster.replace(
                                new RegExp(
                                    /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/,
                                    'igm'
                                ),
                                ''
                            ),
                            poster: film.poster.replace(
                                new RegExp(
                                    /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/,
                                    'igm'
                                ),
                                ''
                            ),
                        };
                    }

                    if (!parse.nextPage && curr + 1 < startUrls.length) {
                        currentUrl = startUrls[curr + 1];
                        curr++;
                    } else {
                        currentUrl = parse.nextPage;
                    }
                }
            }
        }

        yield;
    }

    return;
}

const generator = parseFilms();

const parser = async () => {
    const time1 = performance.now();
    const res = await generator.next();
    const time2 = performance.now();

    if (res.done) {
        if (!!data.posters) {
            await setData(data);
        }

        console.log('Complete');
    } else {
        const time = time2 - time1;

        setTimeout(parser, 5 * 1000 - time > 0 ? 5 * 1000 - time : 0);
    }
};

parser();

app.get('/:id', (req, res) => {
    const id = req.params.id;

    if (id in data.posters) {
        res.status(200).send({
            listPoster:
                'listPoster' in data.posters[id]
                    ? data.domain + data.posters[id].listPoster
                    : null,
            optimizedPoster:
                'optimizedPoster' in data.posters[id]
                    ? data.domain + data.posters[id].optimizedPoster
                    : null,
            poster:
                'poster' in data.posters[id]
                    ? data.domain + data.posters[id].poster
                    : null,
        });
    } else {
        res.status(404).send();
    }
});

app.all('*', (req, res) => {
    res.status(404).send();
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Serve at http://localhost:${port}`);
});
