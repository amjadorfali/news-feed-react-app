export interface Article {
    source: {
        id: string;
        name: string;
    };

    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string;
}


export enum Sources {
    NEW_YORK_TIMES = 'new-york-times',
    THE_GUARDIAN = 'the-guardian',
    NEWS_API = 'news-api',
}