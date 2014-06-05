var fs = require('fs');

eval(fs.readFileSync('src/core/utils.js').toString());

module.exports = {
    "Utils.parseUri": {
        'Protocol and domain (no trailing /)': function (test) {
            var uri = Utils.parseUri("http://my.domain.com");
            test.equal(uri.protocol, "http");
            test.equal(uri.hostname, "my.domain.com");
            test.strictEqual(uri.path, undefined);
            test.strictEqual(uri.query, undefined);
            test.strictEqual(uri.hash, undefined);
            test.done();
        },
        'Protocol, domain and path': function (test) {
            var uri = Utils.parseUri("http://my.domain.com/path/to/file.html");
            test.equal(uri.protocol, "http");
            test.equal(uri.hostname, "my.domain.com");
            test.strictEqual(uri.path, "/path/to/file.html");
            test.strictEqual(uri.query, undefined);
            test.strictEqual(uri.hash, undefined);
            test.done();
        },
        'Protocol, domain, path and query': function (test) {
            var uri = Utils.parseUri("http://my.domain.com/path/to/file.html?key=value");
            test.equal(uri.protocol, "http");
            test.equal(uri.hostname, "my.domain.com");
            test.strictEqual(uri.path, "/path/to/file.html");
            test.strictEqual(uri.query, "?key=value");
            test.strictEqual(uri.hash, undefined);
            test.done();
        },
        'Protocol, domain, path and hash': function (test) {
            var uri = Utils.parseUri("http://my.domain.com/path/to/file.html#hash");
            test.equal(uri.protocol, "http");
            test.equal(uri.hostname, "my.domain.com");
            test.strictEqual(uri.path, "/path/to/file.html");
            test.strictEqual(uri.query, undefined);
            test.strictEqual(uri.hash, "#hash");
            test.done();
        },
        'Protocol, domain, path, query and hash': function (test) {
            var uri = Utils.parseUri("http://my.domain.com/path/to/file.html?key=value#hash");
            test.equal(uri.protocol, "http");
            test.equal(uri.hostname, "my.domain.com");
            test.strictEqual(uri.path, "/path/to/file.html");
            test.strictEqual(uri.query, "?key=value");
            test.strictEqual(uri.hash, "#hash");
            test.done();
        },
        'Protocol relative domain': function (test) {
            var uri = Utils.parseUri("//my.domain.com");
            test.equal(uri.protocol, undefined);
            test.equal(uri.hostname, "my.domain.com");
            test.strictEqual(uri.path, undefined);
            test.strictEqual(uri.query, undefined);
            test.strictEqual(uri.hash, undefined);
            test.done();
        },
        'Protocol relative domain and path': function (test) {
            var uri = Utils.parseUri("//my.domain.com/path/to/file.html");
            test.equal(uri.protocol, undefined);
            test.equal(uri.hostname, "my.domain.com");
            test.strictEqual(uri.path, "/path/to/file.html");
            test.strictEqual(uri.query, undefined);
            test.strictEqual(uri.hash, undefined);
            test.done();
        },
        'Protocol relative domain, path and query': function (test) {
            var uri = Utils.parseUri("//my.domain.com/path/to/file.html?key=value");
            test.equal(uri.protocol, undefined);
            test.equal(uri.hostname, "my.domain.com");
            test.strictEqual(uri.path, "/path/to/file.html");
            test.strictEqual(uri.query, "?key=value");
            test.strictEqual(uri.hash, undefined);
            test.done();
        },
        'Protocol relative domain, path and hash': function (test) {
            var uri = Utils.parseUri("//my.domain.com/path/to/file.html#hash");
            test.equal(uri.protocol, undefined);
            test.equal(uri.hostname, "my.domain.com");
            test.strictEqual(uri.path, "/path/to/file.html");
            test.strictEqual(uri.query, undefined);
            test.strictEqual(uri.hash, "#hash");
            test.done();
        },
        'Protocol relative domain, path, query and hash': function (test) {
            var uri = Utils.parseUri("//my.domain.com/path/to/file.html?key=value#hash");
            test.equal(uri.protocol, undefined);
            test.equal(uri.hostname, "my.domain.com");
            test.strictEqual(uri.path, "/path/to/file.html");
            test.strictEqual(uri.query, "?key=value");
            test.strictEqual(uri.hash, "#hash");
            test.done();
        },
        'path': function (test) {
            var uri = Utils.parseUri("/path/to/file.html");
            test.equal(uri.protocol, undefined);
            test.equal(uri.hostname, undefined);
            test.strictEqual(uri.path, "/path/to/file.html");
            test.strictEqual(uri.query, undefined);
            test.strictEqual(uri.hash, undefined);
            test.done();
        },
        'path and query': function (test) {
            var uri = Utils.parseUri("/path/to/file.html?key=value");
            test.equal(uri.protocol, undefined);
            test.equal(uri.hostname, undefined);
            test.strictEqual(uri.path, "/path/to/file.html");
            test.strictEqual(uri.query, '?key=value');
            test.strictEqual(uri.hash, undefined);
            test.done();
        },
        'path and hash': function (test) {
            var uri = Utils.parseUri("/path/to/file.html#hash");
            test.equal(uri.protocol, undefined);
            test.equal(uri.hostname, undefined);
            test.strictEqual(uri.path, "/path/to/file.html");
            test.strictEqual(uri.query, undefined);
            test.strictEqual(uri.hash, "#hash");
            test.done();
        },
        'path, query and hash': function (test) {
            var uri = Utils.parseUri("/path/to/file.html?key=value#hash");
            test.equal(uri.protocol, undefined);
            test.equal(uri.hostname, undefined);
            test.strictEqual(uri.path, "/path/to/file.html");
            test.strictEqual(uri.query, "?key=value");
            test.strictEqual(uri.hash, "#hash");
            test.done();
        },
        'dataURI': function (test) {
            var uri = Utils.parseUri("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAAb0lEQVR42p2RMQ7AIAhFWXsG1h7Gtffo6urqyJGpwyetomnwJ38BH/wgfZSaS7PABbVOqkqm3Fzx6IQTatlDb5PJi21YBy1iuNgjJIgzFXqyCcXj1Z1DXNGTiw01aP252DCCgH7Fk41h8KaAGMDxADnaOPucd/m3AAAAAElFTkSuQmCC");
            test.equal(uri, undefined);
            test.done();
        }
    }
};