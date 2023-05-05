// ContentType 'Product'
// Naming convention const ?
"use strict"
const config = require('./config/config.json')

const ACCESS_TOKEN = config.accessToken
const SPACEID = config.space.spaceId
const ENVIRONMENTID = config.space.environmentId
const CONTENT_TYPE = config.contentType.id

const CONTENTID = config.contentType.newContent.id
const CONTENT_TITLE = config.contentType.newContent.title
const CONTENT_PATH = config.contentType.newContent.path
const CONTENT_LABEL = config.contentType.newContent.label
const CONTENT_INTRODUCTION = config.contentType.newContent.introduction

const contentful = require("contentful-management");

async function Connect() {
    const client = contentful.createClient({
        accessToken: ACCESS_TOKEN
    })
    const space = await client.getSpace(SPACEID)
    return await space.getEnvironment(ENVIRONMENTID)
}

async function createEntry(env, { title, path, label, introduction }) {
    const entry = await env.createEntryWithId(CONTENT_TYPE, CONTENTID, {
        fields: {
            title: { 'en-US': title },
            path: { 'en-US': path },
            label: { 'en-US': label },
            introduction: { 'en-US': introduction },
        }
    })

    // err 409
    await entry.update();
    await env.getEntry(CONTENTID)
    entry.publish();
}

async function createField(env, newField) {
    let product = await env.getContentType(CONTENT_TYPE)
    const fields = product.fields

    const titleField = product.displayField
    Object.assign(newField, { defaultValue: { 'en-US': titleField } });

    fields.push(newField);
    await product.update();
    product = await env.getContentType(CONTENT_TYPE);
    product.publish();
}

async function main() {
    const env = await Connect()

    const newContent = {
        title: CONTENT_TITLE,
        path: CONTENT_PATH,
        label: CONTENT_LABEL,
        introduction: CONTENT_INTRODUCTION
    }
    // createEntry(env, newContent);

    const newField = { id: "slug", name: "Slug", type: "Symbol" }
    // createField(env, newField);

    // below not tested
    const fieldUsShop = { id: "usShop", name: "Us shop", type: "Boolean", defaultValue: true }
    // createField(env, fieldUsShop);

    // 6.append your log file with successful or unsuccessful response (in the same format above)
    // 7.Delete the field "Shop" 
    // append your log file with successful or unsuccessful response (in the same format above)
}

main();
