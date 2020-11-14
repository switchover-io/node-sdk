import { Logger } from 'switchover-js-core';
import { HttpFetcher } from '../src/HttpFetcher';
import { API_ENDPOINT_FILENAME, API_ENDPOINT_HOST, API_ENDPOINT_PATH } from '../src/sdk-config';
const nock = require('nock')

test('Test fetch reply 200', done => {

    const dummyResponse = {
        name: "toggle_0001"
    }

    const SDK_KEY = 'SDK_KEY'

    nock(`https://${API_ENDPOINT_HOST}`)
        .get(`${API_ENDPOINT_PATH}/${SDK_KEY}/${API_ENDPOINT_FILENAME}`)
        .reply(200, JSON.stringify(dummyResponse));

    const fetcher = new HttpFetcher(Logger.getLogger());

    fetcher.fetchAll('SDK_KEY', null)
        .then((apiResponse) => {
            expect(apiResponse.payload).not.toBeNull();
            expect(apiResponse.payload.name).toEqual('toggle_0001');
            done();
        })
        .catch(error => {
            console.log(error);
            done();
        })
});

test('Test fetch reply 304', done => {

    const SDK_KEY = 'SDK_KEY'

    nock(`https://${API_ENDPOINT_HOST}`)
        .get(`${API_ENDPOINT_PATH}/${SDK_KEY}/${API_ENDPOINT_FILENAME}`)
        .reply(304, '');

    const fetcher = new HttpFetcher(Logger.getLogger());

    fetcher.fetchAll('SDK_KEY', null)
        .then((apiResponse) => {
            expect(apiResponse).toBeNull();
            done();
        })
        .catch(error => {
            console.log(error);
            done();
        })
});


test('Test fech with reply > 400', done => {
    const SDK_KEY = 'SDK_KEY'

    nock(`https://${API_ENDPOINT_HOST}`)
        .get(`${API_ENDPOINT_PATH}/${SDK_KEY}/${API_ENDPOINT_FILENAME}`)
        .reply(404, '');

    const fetcher = new HttpFetcher(Logger.getLogger());

    fetcher.fetchAll('SDK_KEY', null)
        .then((apiResponse) => {
            expect(apiResponse).not.toBeNull();
            done();
        })
        .catch(error => {
            expect(error).not.toBeNull();
            done();
        })
})