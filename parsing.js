import * as cheerio from 'cheerio';

const parseFilmsFromPage = function (toParse) {
    if (!!toParse) {
        const $ = cheerio.load(toParse);

        if (!!$) {
            const result = [];

            for (const element of $(
                'div.b-content__inline_item',
                'div.b-content__inline_items'
            )) {
                const id = $(element).attr('data-id');
                const link = $(element)
                    .find('div.b-content__inline_item-link')
                    .find('a')
                    .attr('href');
                const poster = $(element)
                    .find('div.b-content__inline_item-cover > a > img')
                    .attr('src');

                result.push({
                    id: !!id ? id : null,
                    link: !!link ? link : null,
                    poster: !!poster ? poster : null,
                });
            }

            const nextPage =
                $('span.no-page>span.b-navigation__next').length > 0
                    ? null
                    : $('div.b-navigation a').last().attr('href');

            return {
                data: result,
                nextPage: !!nextPage ? nextPage : null,
            };
        } else {
            return null;
        }
    } else {
        return null;
    }
};

const parseFilm = function (toParse) {
    if (!!toParse) {
        const $ = cheerio.load(toParse);

        if (!!$) {
            const id =
                $('#post_id').attr('value') ??
                $('#send-video-issue').attr('data-id');
            const optimizedPoster = $('.b-sidecover img').attr('src');
            const poster = $('.b-sidecover a').attr('href');

            return {
                id: !!id ? id : null,
                optimizedPoster: !!optimizedPoster ? optimizedPoster : null,
                poster: !!poster ? poster : null,
            };
        } else {
            return null;
        }
    } else {
        return null;
    }
};

export { parseFilmsFromPage, parseFilm };
