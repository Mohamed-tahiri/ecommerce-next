import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import config from '../utils/config';

export const client = sanityClient({
    projectId: config.projectId,
    dataset: config.dataset,
    apiVersion: '2022-08-10',
    useCdn: true,
    token: process.env.SANITY_AUTH_TOKEN
})


const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);   