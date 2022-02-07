import ContentSection, { ContentHeader, ContentImageRow, ContentTextBlock, ContentTextImageLeft, ContentTextImageRight, ContentTripleImageCol, ContentVideoBlock } from "../models/content-section";
import { greyImage } from "../variables";

export function sortByProperty<T>(objectOfUids: { [uid: string]: T }, property: string, direction: 'asc' | 'desc'): Array<T> {
    if (objectOfUids) {
        const array = Object.keys(objectOfUids).sort((a, b) => {
            if (!objectOfUids[a] || !objectOfUids[b]) return 0;

            const aValue = (objectOfUids[a] as any)[property];
            const bValue = (objectOfUids[b] as any)[property];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return (aValue as string).localeCompare((bValue as string));
            }
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return (aValue as number) - ((bValue as number));
            }

            return 0;
        })

        const result = array.map((k) => {
            return objectOfUids[k]
        })

        if (direction === 'asc') {
            return result;
        }
        if (direction === 'desc') {
            return result.reverse();
        }
    }

    return []
}

export function delay(delayInms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, delayInms);
    });
}

export function shortHandNumber(n) {
    if (n < 1e3) return n;
    if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
    if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
    if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
    if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
}

export const getProjectId = () => {
    return process.env.GOOGLE_CLOUD_PROJECT ?? process.env.GCP_PROJECT;
};

export const isMobileDevice = () => {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true
    }
    return false
}

export const removeTypename = (obj: any): any => {
    delete obj.__typename
}

export const getAllImages = (contentSections: ContentSection<any>[]): string[] => {
    return contentSections
        .filter(section => ['image-row', 'text-image-right', 'text-image-left', 'triple-image-col'].includes(section?.type))
        .map((section) => {
            if (section.type === 'triple-image-col') {
                return (section as ContentSection<ContentTripleImageCol>).content.images.map(img => img.url)
            }

            return (section as ContentSection<ContentImageRow | ContentTextImageLeft | ContentTextImageRight>).content.image.url
        })
        .flat()
        .filter(url => url !== greyImage)
}

export const getAllProcessingVideos = (contentSections: ContentSection<any>[]): boolean[] => {
    return contentSections
        .filter(section => ['video-block'].includes(section?.type))
        .map((section) => {
            return (section as ContentSection<ContentVideoBlock>).content.processing
        })
        .filter(bool => bool)
}

export const getImageUrls = (contentSections: ContentSection<any>[]): string[] => {
    return contentSections
        .filter(section => ['image-row', 'text-image-right', 'text-image-left', 'triple-image-col'].includes(section?.type))
        .map((section) => {
            if (section.type === 'triple-image-col') {
                return (section as ContentSection<ContentTripleImageCol>).content.images.map(img => img.url)
            }

            return (section as ContentSection<ContentImageRow | ContentTextImageLeft | ContentTextImageRight>).content.image.url
        })
        .flat()
}

export const getAllTexts = (contentSections: ContentSection<any>[]): string[] => {
    return contentSections
        .filter(section => ['header', 'text-block', 'text-image-right', 'text-image-left'].includes(section?.type))
        .map((section) => {
            return (section as ContentSection<ContentHeader | ContentTextBlock | ContentTextImageLeft | ContentTextImageRight>).content.text.markdown
                ||
                (section as ContentSection<ContentHeader | ContentTextBlock | ContentTextImageLeft | ContentTextImageRight>).content.text.html
        }).flat().filter(text => Boolean(text.trim()))
}

export const getAllDescriptions = (contentSections: ContentSection<any>[]): string[] => {
    return contentSections
        .filter(section => ['text-block', 'text-image-right', 'text-image-left'].includes(section?.type))
        .map((section) => {
            return (section as ContentSection<ContentHeader | ContentTextBlock | ContentTextImageLeft | ContentTextImageRight>).content.text.markdown
                ||
                (section as ContentSection<ContentHeader | ContentTextBlock | ContentTextImageLeft | ContentTextImageRight>).content.text.html
        }).flat().filter(text => Boolean(text.trim()))
}

export const getNameInitials = (name: string): string => {
    if (name.length === 0)
        return ''

    let result = ""

    name.split(" ").forEach(word => {
        result += word[0].toUpperCase()
    })

    return result
}

export const timeDifference = (
    previous: string | Date,
    current: string | Date = new Date(),
) => {
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = new Date(current).getTime() - new Date(previous).getTime();

    if (elapsed < 5000) {
        return 'just now'
    }

    if (elapsed < msPerMinute) {
        return Math.round(elapsed / 1000) + ' seconds ago';
    }

    else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + ' minutes ago';
    }

    else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + ' hours ago';
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed / msPerDay) + ' days ago';
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed / msPerMonth) + ' months ago';
    }

    else {
        return Math.round(elapsed / msPerYear) + ' years ago';
    }
}

export function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
    return Math.ceil(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
 }
