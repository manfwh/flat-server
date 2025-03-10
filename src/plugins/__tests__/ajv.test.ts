import test from "ava";
import Ajv from "ajv";
import { ajvSelfPlugin } from "../Ajv";
import { v4 } from "uuid";
import { CloudStorage } from "../../constants/Process";

const namespace = "[plugins][plugins-ajv]";

test(`${namespace} - inject self plugin`, ava => {
    const ajv = new Ajv();
    ajvSelfPlugin(ajv);

    ava.deepEqual(Object.keys(ajv.formats), [
        "unix-timestamp",
        "uuid-v4",
        "file-suffix",
        "url-file-suffix",
        "url",
    ]);
});

test(`${namespace} - uuid-v4`, ava => {
    const ajv = new Ajv();
    ajvSelfPlugin(ajv);

    const validate = ajv.compile({
        type: "object",
        required: ["uuid"],
        properties: {
            uuid: {
                type: "string",
                format: "uuid-v4",
            },
        },
    });

    {
        const testUUIDValidFail = {
            uuid: "x",
        };

        validate(testUUIDValidFail);

        ava.true(validate.errors !== null);
    }

    {
        const testUUIDValidSuccess = {
            uuid: v4(),
        };

        validate(testUUIDValidSuccess);

        ava.is(validate.errors, null);
    }
});

test(`${namespace} - unix-timestamp`, ava => {
    const ajv = new Ajv();
    ajvSelfPlugin(ajv);

    const validate = ajv.compile({
        type: "object",
        required: ["timestamp"],
        properties: {
            timestamp: {
                type: "integer",
                format: "unix-timestamp",
            },
        },
    });

    {
        const testTimestampValidFail = {
            timestamp: 100000,
        };

        validate(testTimestampValidFail);

        ava.true(validate.errors !== null);
    }

    {
        const testTimestampValidSuccess = {
            timestamp: Date.now(),
        };

        validate(testTimestampValidSuccess);

        ava.is(validate.errors, null);
    }
});

test(`${namespace} - file-suffix`, ava => {
    const ajv = new Ajv();
    ajvSelfPlugin(ajv);

    const validate = ajv.compile({
        type: "object",
        required: ["fileName"],
        properties: {
            fileName: {
                type: "string",
                format: "file-suffix",
            },
        },
    });

    {
        const testFileSuffixValidFail = {
            fileName: v4(),
        };

        validate(testFileSuffixValidFail);

        ava.true(validate.errors !== null);
    }

    {
        const testFileSuffixValidSuccess = {
            fileName: `test.${CloudStorage.ALLOW_FILE_SUFFIX[0]}`,
        };

        validate(testFileSuffixValidSuccess);

        ava.is(validate.errors, null);
    }
});

test(`${namespace} - url-file-suffix`, ava => {
    const ajv = new Ajv();
    ajvSelfPlugin(ajv);

    const validate = ajv.compile({
        type: "object",
        required: ["fileName"],
        properties: {
            fileName: {
                type: "string",
                format: "url-file-suffix",
            },
        },
    });

    {
        const testURLFileSuffixValidFail = {
            fileName: "hi.txt",
        };

        validate(testURLFileSuffixValidFail);

        ava.true(validate.errors !== null);
    }

    {
        const testURLFileSuffixValidSuccess = {
            fileName: `yes.${CloudStorage.ALLOW_URL_FILE_SUFFIX[0]}`,
        };

        validate(testURLFileSuffixValidSuccess);

        ava.is(validate.errors, null);
    }
});

test(`${namespace} - url`, ava => {
    const ajv = new Ajv();
    ajvSelfPlugin(ajv);

    const validate = ajv.compile({
        type: "object",
        required: ["url"],
        properties: {
            url: {
                type: "string",
                format: "url",
            },
        },
    });

    {
        const testURLValidFail = {
            url: "google.com",
        };

        validate(testURLValidFail);

        ava.true(validate.errors !== null);
    }

    {
        const testURLValidSuccess = {
            url: "http://google.com/a/1?a=1!@#$%^*()_&x=1#!c=2",
        };

        validate(testURLValidSuccess);

        ava.is(validate.errors, null);
    }
});
