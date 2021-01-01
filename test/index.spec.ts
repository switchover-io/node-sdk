
const Switchover = require('../src/index');
const fs = require('fs');
const util = require('util');
import { CachedItem, ResponseCache } from 'switchover-js-core';
import { API_ENDPOINT_FILENAME, API_ENDPOINT_HOST, API_ENDPOINT_PATH } from '../src/sdk-config';

const nock = require('nock')

test('create default client not null', () => {
    const client = Switchover.createClient('key');
    expect(client).not.toBeNull();
});

test('create client with auto refresh', () => {
    const client = Switchover.createClient('key', {
        autoRefresh: true,
        refreshInterval: 2,
        onUpdate: () => { }
    })
    client.stopPolling();
    expect(client).not.toBeNull();
});

test('create client with own cache', async () => {

    let myFileCache = function() {};

    myFileCache.prototype.setValue = async function (key, value) {

        const writeFileContent = util.promisify(fs.writeFile);

        await writeFileContent(`./test/tmp_${key}_test_cache.json`, JSON.stringify(value));
    };

    myFileCache.prototype.getValue = async function (key) {

        const readFileContent = util.promisify(fs.readFile).bind(myFileCache);

        const cacheFile = `./test/tmp_${key}_test_cache.json`;

        try  {
        const content = await readFileContent(cacheFile, { encoding: 'utf-8' });
        return JSON.parse(content);
    } catch(err) {
        return null;
    }

    };

    const dummyResponse = [{
        name: "toggle_0001",
        status: 1,
        strategy: 1,
        value: true,
        type: 1
    }];

    const SDK_KEY = 'SDK_KEY';

    nock(`https://${API_ENDPOINT_HOST}`)
        .get(`${API_ENDPOINT_PATH}/${SDK_KEY}/${API_ENDPOINT_FILENAME}`)
        .reply(200, JSON.stringify(dummyResponse));

        
    const client = Switchover.createClient(SDK_KEY, {
        cache: new myFileCache(),
        ttl: 10
    });

    await client.fetchAsync();

    const featureEnabled = client.toggleValue('toggle_0001', false);

    expect(featureEnabled).toBeTruthy();

});