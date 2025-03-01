import {getArticleList} from "@/lib/article-io";
import {MetadataRoute} from "next";


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    return (await getArticleList()).map((item) => ({
        url: `https://blog.ost.vg/articles/${item.filename.substring(0, item.filename.length - 3)}`,
        lastModified: item.fields.date,
        changeFrequency: 'monthly',
        priority: 0.8
    }))
}
