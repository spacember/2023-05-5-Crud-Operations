"use strict"

const config = require('./config/config.json')
const log = require("./utils/log");
const date = new Date();

const ACCESS_TOKEN = config.accessToken
const SPACEID = config.space.spaceId
const ENVIRONMENTID = config.space.environmentId
const LOCALE = config.space.locale
const CONTENT_TYPE = config.contentType.id

const fs = require('fs')
const createReadStream = fs.createReadStream

const contentful = require("contentful-management");

async function connectToCMA() {
    try {
        const client = contentful.createClient({ accessToken: ACCESS_TOKEN })
        const space = await client.getSpace(SPACEID)
        return await space.getEnvironment(ENVIRONMENTID)
    } catch (err) {
        log(`Error occured on connect`)
    }
}

// Param 'entry' destructured into { id, ...entry }
async function createEntry(env, { id, ...entry }) {
    try {
        console.log(entry.title[LOCALE]);
        const createdEntry = await env.createEntryWithId(CONTENT_TYPE, id.LOCALE, { fields: entry })
        await env.getEntry(id.LOCALE)
        await createdEntry.publish();

        log(`DATE: ${date} \nPublished entry: ${entry.title[LOCALE]} - id: ${id[LOCALE]}`)
    } catch (err) {
        log(`Error occured on createEntry. Entry title: ${entry.title[LOCALE]} - id: ${id[LOCALE]}`)
    }
}

async function createField(env, field) {
    try {
        let product = await env.getContentType(CONTENT_TYPE)
        const fields = product.fields

        if (field.defaultValue && field.defaultValue[LOCALE] == "titleField")
            field.defaultValue[LOCALE] = product.displayField

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

// Param 'property' destructured into [key, value]
async function updateField(env, index, [key, value]) {
    try {
        let product = await env.getContentType(CONTENT_TYPE)
        const field = product.fields[index]

        field[key] = value

        await product.update()
        product = await env.getContentType(CONTENT_TYPE)
        await product.publish()
        log(`DATE: ${date} \nUpdated field: ${field.name} - id: ${field.id}`)
    }
    catch (err) {
        log(`Error occured on updateField. Field name: ${field.name} - id: ${field.id}`)
    }
}

// Deletes a field. If the field exixts, it is first omitted then deleted.
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
        if (!fields[index].omitted) {
            await updateField(env, index, ["omitted", true])
            product = await env.getContentType(CONTENT_TYPE)
            fields = product.fields
        }

        // delete
        fields.splice(index, 1)
        await product.update()
        product = await env.getContentType(CONTENT_TYPE)
        await product.publish()
        log(`DATE: ${date} \nDeleted field: ${field.name} - id: ${field.id}`)
    }
    catch (err) {
        log(`Error occured on deleteField. Field name: ${field.name} - id: ${field.id}`)
    }
}

async function createAsset(env, fields) {
    try {
        let asset = await env.createAssetFromFiles({ fields: fields })
        await asset.processForAllLocales()

        const assetId = asset.sys.id

        asset = await env.getAsset(assetId)
        await asset.publish()
        log(`DATE: ${date} \nCreated asset id: ${assetId}`)
    } catch (err) {
        log(`Error occured on createAsset. Asset id: someId`)
    }
}

async function main() {
    const env = await connectToCMA()

    const entry = {
        id: { "en-US": "sensitvePampers" },
        title: { "en-US": "sensitve pampers" },
        path: { "en-US": "pampers.com/sensitive" },
        label: { "en-US": "wipes" },
        introduction: { "en-US": "Pampers Swaddlers diapers are the number one choice of hospitals, based on, protection, comfort, dryness and more. Buy now at Pampers.com" }
    }
    const fieldSlug = { id: "slug", name: "Slug", type: "Symbol", defaultValue: { "en-US": "titleField" } }
    const fieldUsShop = { id: "usShop", name: "Us shop", type: "Boolean", defaultValue: { "en-US": true } }
    const fieldImage = { id: "image", name: "Image", type: "Link" }
    const assetFields = {
        title: {
            "en-US": "A test"
        },
        file: {
            "en-US": {
                contentType: "image/jpg",
                fileName: "image.jpg",
                file: createReadStream('assets/images/image.jpg')
            }
        }
    }

    // await createEntry(env, entry);
    // await createField(env, fieldSlug)
    // await createField(env, fieldUsShop)
    // await deleteField(env, fieldUsShop)
    // await createField(env, fieldImage)
    await createAsset(env, assetFields)
}

main();
