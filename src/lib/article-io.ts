'use server';

import FusionCollection from 'fusionable/FusionCollection';
import path from 'path';
import { checkMDField, MDField } from './article-check';
import fs from 'fs';
import { stackServerApp } from '@/stack';
import { Team } from '@stackframe/stack';
import { lookup } from 'ip-location-api';
import { headers } from 'next/headers';
import {logger} from './logger';

/**
 * Ensures required directories exist at the specified paths.
 * If a path exists but is not a directory, it deletes the path and creates a directory.
 * If a path doesn't exist, it creates a directory.
 * Uses async fs operations for better performance.
 */
export async function setupDirectories(): Promise<void> {
    const directoriesToEnsure = [path.join(process.cwd(), 'drafts'), path.join(process.cwd(), 'raw_articles')];

    for (const dirPath of directoriesToEnsure) {
        try {
            // Check if path exists by attempting to access it
            try {
                const stats = await fs.promises.stat(dirPath);

                // If it exists but is not a directory, delete it and create directory
                if (!stats.isDirectory()) {
                    logger.info(`Found non-directory at ${dirPath}, replacing with directory...`);
                    await fs.promises.unlink(dirPath);
                    await fs.promises.mkdir(dirPath);
                    logger.info(`Created directory at ${dirPath}`);
                } else {
                    logger.info(`Directory already exists at ${dirPath}`);
                }
                /* eslint-disable */
            } catch (error: any) {
                // If path doesn't exist (ENOENT error), create directory
                if (error.code === 'ENOENT') {
                    logger.info(`Creating directory at ${dirPath}`);
                    await fs.promises.mkdir(dirPath);
                    logger.info(`Created directory at ${dirPath}`);
                } else {
                    // Rethrow if it's a different error
                    throw error;
                }

                /* eslint-enable */
            }
        } catch (error) {
            console.error(`Error setting up directory at ${dirPath}:`, error);
        }
    }
}

/**
 * Converts MDField metadata and markdown content into a formatted markdown string
 * @param metadata - The MDField metadata object
 * @param content - The markdown content as a string
 * @returns A formatted markdown string with frontmatter
 */
function formatMarkdownWithMetadata(metadata: MDField, content: string): string {
    // Convert tags Set to array for YAML frontmatter
    const tagsArray = Array.from(metadata.tags);

    // Build the frontmatter section
    let frontmatter = '---\n';

    // Add required fields
    frontmatter += `title: "${metadata.title}"\n`;
    frontmatter += `description: "${metadata.description}"\n`;
    frontmatter += `date: "${metadata.date}"\n`;

    // Add tags array
    frontmatter += 'tags: [';
    if (tagsArray.length > 0) {
        frontmatter += tagsArray.map((tag) => `"${tag}"`).join(', ');
    }
    frontmatter += ']\n';

    // Add optional geo fields if they exist
    if (metadata.geoAllow && metadata.geoAllow.size > 0) {
        const geoAllowArray = Array.from(metadata.geoAllow);
        frontmatter += 'geoAllow: [';
        frontmatter += geoAllowArray.map((geo) => `"${geo}"`).join(', ');
        frontmatter += ']\n';
    }

    if (metadata.geoBlock && metadata.geoBlock.size > 0) {
        const geoBlockArray = Array.from(metadata.geoBlock);
        frontmatter += 'geoBlock: [';
        frontmatter += geoBlockArray.map((geo) => `"${geo}"`).join(', ');
        frontmatter += ']\n';
    }

    // Close frontmatter section
    frontmatter += '---\n\n';

    // Combine frontmatter with content
    return frontmatter + content;
}

/**
 * Retrieves a list of articles with optional tag filtering
 * @param tags - Optional tag to filter articles by
 * @param checkDrafts - Whether to look in drafts directory (default: false)
 * @returns Array of article objects with filename and validated metadata fields
 * @throws Error if collection structure is invalid or data validation fails
 */
export async function getArticleList(tags?: string, checkDrafts: boolean = false): Promise<{ filename: string; fields: MDField }[]> {
    const user = await stackServerApp.getUser();
    const userTeam: Team[] = (await user?.listTeams()) ?? [];

    if (userTeam.find((item) => item.id === (process.env.SITE_ADMIN_TEAM_ID ?? '')) === undefined && checkDrafts) {
        throw new Error('Unauthorized');
    }

    const article_path = path.join(process.cwd(), checkDrafts ? 'drafts' : 'raw_articles');

    const collection = new FusionCollection().loadFromDir(article_path.toString()).orderBy('date', 'desc').getItemsArray();

    if (!Array.isArray(collection)) {
        throw new Error('Collection is not array');
    }

    for (const item of collection) {
        if (item['fields'] === undefined || !checkMDField(item['fields']).success) {
            throw new Error('Invalid data structure');
        }
    }
    if (userTeam.find((item) => item.id === (process.env.SITE_ADMIN_TEAM_ID ?? '')) !== undefined) {
        return tags === undefined
            ? collection
            : collection
                  .filter((item: { filename: string; fields: MDField }) => [...item.fields.tags].includes(tags))
                  .map((item) => {
                      return {
                          filename: item.filename ?? '',
                          fields: item.fields! as MDField,
                      };
                  });
    } else {
        const userGEO = await lookup((await headers()).get('user-ip') ?? '::1');
        logger.debug(userGEO);

        if (!userGEO) {
            return [];
        }

        return (
            tags === undefined
                ? collection
                : collection
                      .filter((item: { filename: string; fields: MDField }) => [...item.fields.tags].includes(tags))
                      .map((item) => {
                          return {
                              filename: item.filename ?? '',
                              fields: item.fields! as MDField,
                          };
                      })
        ).filter((item: { filename: string; fields: MDField }) => {
            if (item.fields.geoAllow) {
                if ([...item.fields.geoAllow].find((item) => item.toLowerCase() === userGEO.country!.toLowerCase()) !== undefined) {
                    return true;
                }
                return false;
            }

            if (item.fields.geoBlock) {
                if ([...item.fields.geoBlock].find((item) => item.toLowerCase() === userGEO.country!.toLowerCase()) === undefined) {
                    return true;
                }
                return false;
            }

            return true;
        });
    }
}

/**
 * Retrieves a single article by filename
 * @param filename - Name of the article file (without extension)
 * @param checkDrafts - Whether to look in drafts directory (default: false)
 * @returns Object containing article metadata and content
 * @throws Error if article not found or data validation fails
 */
export async function getItem(filename: string, checkDrafts: boolean = false): Promise<{ fields: MDField; content: string }> {
    const articlePath = path.join(process.cwd(), checkDrafts ? 'drafts' : 'raw_articles');

    const user = await stackServerApp.getUser();
    const userTeam: Team[] = (await user?.listTeams()) ?? [];

    const userGEO = await lookup((await headers()).get('user-ip') ?? '::1');

    if (userTeam.find((item) => item.id === (process.env.SITE_ADMIN_TEAM_ID ?? '')) === undefined && checkDrafts) {
        throw new Error('Unauthorized');
    }

    if (!userGEO && userTeam.find((item) => item.id === (process.env.SITE_ADMIN_TEAM_ID ?? '')) === undefined) {
        throw new Error('Unauthorized');
    }

    const item = new FusionCollection().loadFromDir(articlePath).getOneByFilename(filename + '.md');

    if (!item) {
        throw new Error('Invalid item');
    }

    if (!checkMDField(item.getFields()).success) {
        throw new Error('Invalid data structure');
    }

    if (userTeam.find((item) => item.id === (process.env.SITE_ADMIN_TEAM_ID ?? '')) !== undefined) {
        return { fields: item.getFields() as MDField, content: item.getContent() };
    } else {
        if (item.getField('geoBlock') && (item.getField('geoBlock') as string[]).find((item) => item.toLowerCase() === userGEO!.country!.toLowerCase()) !== undefined) {
            throw new Error('Unauthorized');
        }

        if (item.getField('geoAllow') && (item.getField('geoAllow') as string[]).find((item) => item.toLowerCase() === userGEO!.country!.toLowerCase()) === undefined) {
            throw new Error('Unauthorized');
        }
        return { fields: item.getFields() as MDField, content: item.getContent() };
    }
}

/**
 * Generates a tag frequency count from all articles
 * @param checkDrafts - Whether to include drafts (default: false)
 * @returns Object mapping tags to their occurrence counts
 */
export async function getTagsList(checkDrafts: boolean = false): Promise<Record<string, number>> {
    const articleList = (await getArticleList(undefined, checkDrafts)).map((item) => [...item.fields.tags]);

    const counts: Record<string, number> = {};

    for (const sublist of articleList) {
        for (const tag of sublist) {
            counts[tag] = (counts[tag] || 0) + 1;
        }
    }

    return counts;
}

/**
 * Saves an article to the filesystem
 * @param filename - Name of the article file (without extension)
 * @param metadata - article metadata
 * @param content - Content of the article
 * @param toDrafts - Whether to save to drafts directory (default: false)
 * @throws Error if file write operation fails
 */
export async function saveArticle(filename: string, metadata: MDField, content: string, toDrafts: boolean = false) {
    try {
        const user = await stackServerApp.getUser();
        const userTeam: Team[] = (await user?.listTeams()) ?? [];

        if (userTeam.find((item) => item.id === (process.env.SITE_ADMIN_TEAM_ID ?? '')) === undefined) {
            throw new Error('Unauthorized');
        }
        const getCurrentDate = (): string => {
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
            const day = String(date.getDate()).padStart(2, '0');

            return `${year}-${month}-${day}`;
        };
        const metadataWithDate = { ...metadata, date: getCurrentDate() };
        const concatenatedContent = formatMarkdownWithMetadata(metadataWithDate, content);

        const articlePath = path.join(process.cwd(), toDrafts ? 'drafts' : 'raw_articles');
        await fs.promises.writeFile(path.join(articlePath, `${filename}.md`), concatenatedContent);
    } catch (e) {
        console.log(e);
        throw new Error('Cannot write the file right now');
    }
}

/**
 * Deletes an article from the filesystem
 * @param filename - Name of the article file (without extension)
 * @param fromDrafts - Whether to delete from drafts directory (default: false)
 * @throws Error if file deletion fails
 */
export async function deleteArticle(filename: string, fromDrafts: boolean = false) {
    try {
        const user = await stackServerApp.getUser();
        const userTeam: Team[] = (await user?.listTeams()) ?? [];

        if (userTeam.find((item) => item.id === (process.env.SITE_ADMIN_TEAM_ID ?? '')) === undefined) {
            throw new Error('Unauthorized');
        }

        const articlePath = path.join(process.cwd(), fromDrafts ? 'drafts' : 'raw_articles');
        await fs.promises.rm(path.join(articlePath, `${filename}.md`));
    } catch (e) {
        console.log(e);
        throw new Error('Cannot delete the file right now');
    }
}
