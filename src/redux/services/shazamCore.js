import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'


export const shazamCoreApi = createApi({
    reducerPath : 'shazamCoreApi',
    baseQuery : fetchBaseQuery({
        baseUrl: 'https://billboard-api2.p.rapidapi.com/hot-100',
        prepareHeaders:  (headers) => {
            headers.set('x-rapidapi-key', '3c7d148085msh3f2adb38827b6f7p1682e6jsne29bd6c7f3fc');
            return headers;
        }
    }),
    endpoints:(builder) => ({
        getTopCharts: builder.query({ query: () => '/hot-100/'}),
    }),
});

export const {
    useGetTopChartsQuery,
} = shazamCoreApi;