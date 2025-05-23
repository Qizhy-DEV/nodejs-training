/* eslint-disable @typescript-eslint/no-explicit-any */
export function responseAPI({
    message,
    token,
    data,
}: {
    message?: string;
    token?: string;
    data: any;
}) {
    return {
        ...(message ? { message: message } : {}),
        data: {
            ...(token ? { token: token } : {}),
            data,
        },
    };
}
