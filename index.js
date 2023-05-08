"use strict"

const config = require('./config/config.json')
const log = require("./utils/log");
const date = new Date();

const ACCESS_TOKEN = config.accessToken
const SPACEID = config.space.spaceId
const ENVIRONMENTID = config.space.environmentId
const CONTENT_TYPE = config.contentType.id

const contentful = require("contentful-management");

// should add log here too
async function Connect() {
    const client = contentful.createClient({ accessToken: ACCESS_TOKEN })
    const space = await client.getSpace(SPACEID)
    return await space.getEnvironment(ENVIRONMENTID)
}

async function createEntry(env, { id, ...entry }) {
    try {
        const createdEntry = await env.createEntryWithId(CONTENT_TYPE, id["en-US"], { fields: entry })
        await env.getEntry(id["en-US"])
        await createdEntry.publish();
        log(`DATE: ${date} \nPublished entry: ${entry.title["en-US"]} - id: ${id["en-US"]}`)
    } catch (err) {
        console.log(err);
        log(`Error occured on createEntry. Entry title: ${entry.title["en-US"]} - id: ${id["en-US"]}`)
    }
}

async function createField(env, field) {
    try {
        let product = await env.getContentType(CONTENT_TYPE)
        const fields = product.fields

        if (field.defaultValue['en-US'] == "titleField")
            field.defaultValue['en-US'] = product.displayField

        fields.push(field)
        await product.update()
        product = await env.getContentType(CONTENT_TYPE)
        await product.publish()
        log(`DATE: ${date} \nPublished field: ${field.name} - id: ${field.id}`)
    }
    catch (err) {
        console.log(err);
        log(`Error occured on createField. Field name: ${field.name} - id: ${field.id}`)
    }
}

async function updateField(env, index, { key: value }) {
    try {
        let product = await env.getContentType(CONTENT_TYPE)
        const field = product.fields[index]

        field.omitted = true

        await product.update()
        product = await env.getContentType(CONTENT_TYPE)
        await product.publish()
        log(`DATE: ${date} \nUpdated field: ${field.name} - id: ${field.id}`)
    }
    catch (err) {
        log(`Error occured on updateField. Field name: ${field.name} - id: ${field.id}`)
    }
}

async function deleteField(env, field) {
    try {
        let product = await env.getContentType(CONTENT_TYPE)
        let fields = product.fields
        const index = fields.findIndex((element) => element.id === field.id)

        if (index === -1) {
            log(`Error occured on deleteField \nField name: ${field.name} not found`)
            return
        }

        // omit
        if (!fields[index].omitted){
            await updateField(env, index, { omitted: true })
            product = await env.getContentType(CONTENT_TYPE)
            fields = product.fields
        }

        // delete field
        fields.splice(index, 1)
        await product.update()
        product = await env.getContentType(CONTENT_TYPE)
        await product.publish()
        log(`DATE: ${date} \nDeleted field: ${field.name} - id: ${field.id}`)
    }
    catch (err) {
        console.log(err);
        log(`Error occured on deleteField. Field name: ${field.name} - id: ${field.id}`)
    }
}

async function main() {
    const env = await Connect()

    const entry = {
        id: { "en-US": "sensitvePampers" },
        title: { "en-US": "sensitve pampers" },
        path: { "en-US": "pampers.com/sensitive" },
        label: { "en-US": "wipes" },
        introduction: { "en-US": "Pampers Swaddlers diapers are the number one choice of hospitals, based on, protection, comfort, dryness and more. Buy now at Pampers.com" }
    }
    const fieldSlug = { id: "slug", name: "Slug", type: "Symbol", defaultValue: { 'en-US': "titleField" } }
    const fieldUsShop = { id: "usShop", name: "Us shop", type: "Boolean", defaultValue: { 'en-US': true } }

    await createEntry(env, entry);
    await createField(env, fieldSlug)
    await createField(env, fieldUsShop)
    await deleteField(env, fieldUsShop)
}

main();
