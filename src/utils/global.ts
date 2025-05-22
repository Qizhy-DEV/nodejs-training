/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

export function getItemsPerPage(totalItems: number, limit: number): number {
    return Math.ceil(totalItems / limit);
}

export async function generateSlug(name: string, db: any): Promise<string> {
    const baseSlug = name
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/(^-|-$)/g, '');

    let slug = baseSlug;
    let counter = 1;

    while (await db.findOne({ slug })) {
        slug = `${baseSlug}-${counter++}`;
    }

    return slug;
}

export function changeIdAttribute<T>(data: any) {
    const { _id: id, ...dataWithoutId } = data;
    return {
        ...dataWithoutId,
        id,
    } as T;
}
